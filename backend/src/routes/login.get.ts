import { pool } from '../db'
import express from 'express'
import auth from '../middleware/auth'

const router = express.Router()

router.get('/login', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        username,
        created_at,
        admin,
        nombre,
        habilitado
      FROM login
      ORDER BY id
    `)

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo datos' })
  }
})

export default router