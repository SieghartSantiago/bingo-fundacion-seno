import bcrypt from 'bcrypt'
import { pool } from '../db'
import express from 'express'
import jwt from 'jsonwebtoken'
import { addHistorial } from './historial'
import type { Request, Response } from 'express'
import auth, { AuthRequest } from '../middleware/auth'
import { schemaLogin } from '../types/schema.login'
import { io } from '../app'
import { Login } from '../types/Login'

const router = express.Router()

router.post('/login', async (req: Request, res: Response) => {
  const parsed = schemaLogin.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: parsed.error.message,
    })
  }

  const { username, password } = req.body

  const result = await pool.query('SELECT * FROM login WHERE username = $1', [
    username.trim(),
  ])

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Usuario no existe' })
  }

  const user = result.rows[0]

  const valid = await bcrypt.compare(password, user.password_hash)

  if (!valid) {
    return res.status(401).json({ error: 'Contraseña incorrecta' })
  }

  const habilitado = user.habilitado

  if (!habilitado) {
    return res.status(403).json({ error: 'Usuario deshabilitado' })
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string)

  const admin = user.admin

  const id = user.id

  res.json({ token, admin, id })
})

router.post('/login/crear', auth, async (req: AuthRequest, res) => {
  const parsed = schemaLogin.safeParse(req.body)

  console.log(req.body)
  console.log(parsed)

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: parsed.error.message,
    })
  }

  const { nombre, username, password, habilitado } = req.body

  if (!nombre || !username || !password) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

  try {
    const result = await pool.query('SELECT admin FROM login WHERE id = $1', [
      req.user!.id,
    ])

    const currentUser = result.rows[0]

    if (!currentUser) {
      return res.sendStatus(401)
    }

    if (!currentUser.admin) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    const hash = await bcrypt.hash(password, 10)

    const insertResult = await pool.query(
      'INSERT INTO login (username, password_hash, nombre, habilitado) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, hash, nombre, habilitado],
    )

    res.json({ ok: true })

    const newUserId = insertResult.rows[0].id

    await addHistorial(
      'login',
      newUserId,
      'INSERT',
      null,
      {
        username,
        nombre,
        admin: false,
        habilitado,
      },
      req.user!.id,
    )

    io.emit('actualizar-tabla')
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error creando usuario' })
  }
})

router.post('/login/cambio', auth, async (req: AuthRequest, res) => {
  const parsed = schemaLogin.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: parsed.error.message,
    })
  }

  const { id, nombre, username, habilitado, admin } = req.body

  try {
    // 1. Obtener registro actual
    const currentResult = await pool.query(
      `SELECT * FROM login WHERE id = $1`,
      [id],
    )

    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' })
    }

    const actual: Login = currentResult.rows[0]

    // 2. Construir objeto nuevo
    const nuevo: Partial<Login> = {
      nombre,
      username,
      habilitado,
      admin,
    }

    console.log(actual)
    console.log(nuevo)

    if (actual.admin && !admin && id === req.user!.id) {
      return res.status(403).json({
        error: 'No puedes modificar tus propios permisos de administrador',
      })
    }

    if (actual.habilitado && !habilitado && id === req.user!.id) {
      return res.status(403).json({
        error: 'No puedes deshabilitar tus propio perfil',
      })
    }

    // 3. Detectar cambios
    const cambios: Partial<Login> = {}
    const anteriores: Partial<Login> = {}

    for (const key in nuevo) {
      const k = key as keyof Partial<Login>

      if (nuevo[k] !== actual[k]) {
        ;(cambios as any)[k] = nuevo[k]
        ;(anteriores as any)[k] = actual[k]
      }
    }

    console.log(cambios)
    console.log(anteriores)

    // 4. Si no hay cambios
    if (Object.keys(cambios).length === 0) {
      return res.json({ ok: true, message: 'Sin cambios' })
    }

    // 5. Armar query dinámica
    const setQuery = Object.keys(cambios)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ')

    const values = Object.values(cambios)

    console.log(setQuery)

    values.push(id)

    const updateQuery = `
        UPDATE login
        SET ${setQuery}
        WHERE id = $${values.length}
      `

    await pool.query(updateQuery, values)

    res.json({ ok: true })

    // 6. Historial
    const usuarioId = req.user!.id

    await addHistorial('login', id, 'UPDATE', anteriores, cambios, usuarioId)

    if (actual.habilitado && !habilitado) {
      io.emit(`actualizar-perfil`)
    } else {
      io.emit('actualizar-tabla')
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
