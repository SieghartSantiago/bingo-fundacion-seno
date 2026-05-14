import express from 'express'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import loginPostRoutes from './routes/login.post'
import loginGetRoutes from './routes/login.get'
import loginDeleteRoutes from './routes/login.delete'
import bingoGetRoutes from './routes/bingo.get'
import historialRoutes from './routes/historial'
import bingoPostRoutes from './routes/bingo.post'
import bingoDeleteRoutes from './routes/bingo.delete'
import whatsappRoutes, { enviarMensajeWhatsApp } from './whatsapp'
import cron from 'node-cron'
import { pool } from './db'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000, // max 100 requests
})
const PORT = process.env.PORT || 3005
export const app = express()
const server = http.createServer(app)
export const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

dotenv.config()

console.log(new URL(process.env.DATABASE_URL!))

app.use(express.json())
app.use(limiter)
app.use(
  cors({
    origin: '*',
  }),
)
app.use(bingoGetRoutes)
app.use(loginGetRoutes)
app.use(whatsappRoutes)
app.use(bingoPostRoutes)
app.use(historialRoutes)
app.use(loginPostRoutes)
app.use(bingoDeleteRoutes)
app.use(loginDeleteRoutes)

io.on('connection', (socket) => {
  console.log('Cliente conectado')
})

server.listen(PORT, () => {
  console.log('Servidor corriendo en puerto', PORT)
  process.env.BACKEND_PORT = String(PORT)
})

cron.schedule('54 10 * * *', async (): Promise<void> => {
  console.log('schedule')
  const respFilas = await pool.query(`
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
      ORDER BY b.numero_bingo;`)

  const filas = respFilas.rows

  const hoy = new Date()
  const maniana = new Date(hoy)

  for (const bingo of filas) {
    const cuotasAdeudadas: number =
      mesesTranscurridos(bingo.mes_inicio) - bingo.cuotas.length
    if (cuotasAdeudadas <= 0) continue
    if (
      cuotasAdeudadas / bingo.config_meses !==
      Math.floor(cuotasAdeudadas / bingo.config_meses)
    )
      continue

    switch (bingo.config_dia) {
      case 0:
        continue

      case 31:
        maniana.setDate(hoy.getDate() + 1)
        if (hoy.getMonth() !== maniana.getMonth())
          enviarMensajeWhatsApp(
            String(bingo.numero_bingo),
            bingo.telefono,
            bingo.nombre,
            cuotasAdeudadas > 1,
          )
        continue

      case 32:
        maniana.setDate(hoy.getDate() + 2)
        if (hoy.getMonth() !== maniana.getMonth())
          enviarMensajeWhatsApp(
            String(bingo.numero_bingo),
            bingo.telefono,
            bingo.nombre,
            cuotasAdeudadas > 1,
          )
        continue

      case 33:
        maniana.setDate(hoy.getDate() + 3)
        if (hoy.getMonth() !== maniana.getMonth())
          enviarMensajeWhatsApp(
            String(bingo.numero_bingo),
            bingo.telefono,
            bingo.nombre,
            cuotasAdeudadas > 1,
          )
        continue

      default:
          enviarMensajeWhatsApp(
            String(bingo.numero_bingo),
            bingo.telefono,
            bingo.nombre,
            cuotasAdeudadas > 1,
          )
        continue
    }
  }
})

console.log('cors::::::::::::::::::::::::::::::::::::::::')
console.log(cors.toString())
console.log('fin cors')

function mesesTranscurridos(inicio: Date): number {
  const hoy = new Date()

  let meses =
    (hoy.getFullYear() - inicio.getFullYear()) * 12 +
    (hoy.getMonth() - inicio.getMonth())

  return meses + 1
}
