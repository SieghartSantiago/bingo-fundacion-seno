import type { Bingo } from '../types/Bingo'

import { io } from '../app'
import { pool } from '../db'
import { Router } from 'express'
import { addHistorial } from './historial'
import auth, { AuthRequest } from '../middleware/auth'
import { QueryResult } from '@supabase/supabase-js'

const router: Router = Router()

router.delete('/bingo', auth, async (req: AuthRequest, res): Promise<void> => {
  const bingoNum: number = req.body.bingoNum

  console.log(bingoNum)

  try {
    const resultHistorial: Bingo = (
      await pool.query(`SELECT * FROM bingo WHERE numero_bingo = $1`, [
        bingoNum,
      ])
    ).rows[0]

    const result: QueryResult<any> = await pool.query(
      `DELETE FROM bingo WHERE numero_bingo = $1`,
      [bingoNum],
    )

    io.emit('actualizar-tabla')
    res.json({ ok: true })
    console.log(resultHistorial)
    const id: number = resultHistorial.id
    const usuarioId: number = req.user!.id
    await addHistorial('bingo', id, 'DELETE', resultHistorial, null, usuarioId)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

export default router
