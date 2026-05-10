import type { Login } from '../types/Login'

import { io } from '../app'
import { pool } from '../db'
import { Router } from 'express'
import { addHistorial } from './historial'
import auth, { AuthRequest } from '../middleware/auth'

const router = Router()

router.delete('/login', auth, async (req: AuthRequest, res) => {
  const id = req.body.idUsuario

  try {
    const resultHistorial: Login = (
      await pool.query(`SELECT * FROM login WHERE id = $1`, [
        id,
      ])
    ).rows[0]

    await pool.query(
      `DELETE FROM login WHERE id = $1`,
      [id],
    )

    io.emit('actualizar-tabla')
    res.json({ ok: true })
    const usuarioId = req.user!.id
    await addHistorial('login', id, 'DELETE', resultHistorial, null, usuarioId)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

export default router
