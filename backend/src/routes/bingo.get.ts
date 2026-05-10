import { pool } from '../db'
import { Router } from 'express'
import auth, { AuthRequest } from '../middleware/auth'

const router: Router = Router()

router.get('/bingo', auth, async (req: AuthRequest, res): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT 
      b.*,
      json_agg(c ORDER BY c.num_cuota)
        FILTER (WHERE c.id IS NOT NULL) AS cuotas,

      (
        SELECT ARRAY[
          av.config_meses,
          av.config_dia
        ]
        FROM avisos av
        WHERE av.bingo_id = b.id
        LIMIT 1
      ) AS "configAvisos"
      FROM bingo b
      LEFT JOIN cuotas c 
        ON c.bingo_id = b.id
      GROUP BY b.id
      ORDER BY b.numero_bingo;
    `)

    const data: any[] = result.rows
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo datos' })
  }
})

export default router
