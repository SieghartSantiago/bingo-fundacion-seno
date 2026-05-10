import { pool } from '../db'
import { Router } from 'express'
import auth from '../middleware/auth'

const router = Router()

export async function addHistorial(
  tabla: string,
  registroId: number,
  accion: string,
  datosAnteriores: any,
  datosNuevos: any,
  usuarioId: number,
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO historial 
      (tabla_afectada, registro_id, accion, datos_anteriores, datos_nuevos, usuario_id)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        tabla,
        registroId,
        accion,
        datosAnteriores ? JSON.stringify(datosAnteriores) : null,
        datosNuevos ? JSON.stringify(datosNuevos) : null,
        usuarioId,
      ],
    )
  } catch (err) {
    console.error('Error guardando historial:', err)
  }
}

router.get('/historial', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        h.id,
        h.tabla_afectada,
        h.registro_id,
        h.accion,
        h.datos_anteriores,
        h.datos_nuevos,
        h.usuario_id,
        h.fecha,
        l.nombre AS nombre_usuario
      FROM historial h
      LEFT JOIN login l ON h.usuario_id = l.id
      ORDER BY h.id
    `)

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo datos' })
  }
})

export default router
