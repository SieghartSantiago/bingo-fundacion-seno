import bcrypt from 'bcrypt'
import { pool } from '../db.js'
import express from 'express'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import auth, { AuthRequest } from '../middleware/auth.js'
import { addHistorial } from '../app.js'

const router = express.Router()

router.post('/login', async (req: Request, res: Response) => {
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

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string)

  const admin = user.admin

  res.json({ token, admin })
})

router.post('/create-user', auth, async (req: AuthRequest, res) => {
  const { name, username, password } = req.body

  if (!name || !username || !password) {
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
      'INSERT INTO login (username, password_hash, nombre) VALUES ($1, $2, $3) RETURNING id',
      [username, hash, name],
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
        nombre: name,
        admin: false,
      },
      req.user!.id,
    )
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error creando usuario' })
  }
})

export default router
