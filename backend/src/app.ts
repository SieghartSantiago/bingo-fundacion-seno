import express from 'express'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import cors from 'cors'
import http from 'http'
import { pool } from './db.js'
import { Server } from 'socket.io'
import authRoutes from './routes/auth.js'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max 100 requests
})

dotenv.config()
console.log(new URL(process.env.DATABASE_URL!))

const app = express()
app.use(express.json())
app.use(limiter)
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)
app.use('/auth', authRoutes)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log('Cliente conectado')
})

app.get('/', (req, res) => {
  res.send('Hola mundo')
})

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000')
})

server.listen(3001, () => {
  console.log('Servidor corriendo en 3001')
})

app.get('/test-db', async (req, res) => {
  const result = await pool.query('SELECT NOW()')
  res.json(result.rows)
})

const schema = z.object({
  numeroBingo: z.coerce.number().min(1),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  domicilio: z.string().min(1),
  barrio: z.string().min(1),
  localidad: z.string().min(1),
  telefono: z.string().min(8),
  lugarDeCobro: z.string().min(1),
  mesInicio: z.string().refine((val) => !isNaN(Date.parse(val))),
  fechaDeCobro: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Fecha inválida',
  }),
  cuotasPagas: z.coerce.number().min(0).max(8),
})

app.post('/bingo', async (req, res) => {
  const parsed = schema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: parsed.error.message,
    })
  }

  const {
    numeroBingo,
    nombre,
    apellido,
    domicilio,
    telefono,
    barrio,
    lugarDeCobro,
    mesInicio,
    fechaDeCobro,
    localidad,
    cuotasPagas,
  } = req.body

  const fechaMesInicio = new Date(mesInicio)
  fechaMesInicio.setDate(1)

  const stringFechaMesInicio = `${fechaMesInicio.getFullYear()}-${String(fechaMesInicio.getMonth() + 1).padStart(2, '0')}-${String(fechaMesInicio.getDate()).padStart(2, '0')}`

  try {
    const result = await pool.query(
      `INSERT INTO bingo 
      (numero_bingo, nombre, apellido, domicilio, barrio, localidad, telefono, lugar_cobro, mes_inicio, fecha_cobro, cuotas_pagas)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING id`,
      [
        numeroBingo,
        nombre,
        apellido,
        domicilio,
        barrio,
        localidad,
        telefono,
        lugarDeCobro,
        stringFechaMesInicio,
        fechaDeCobro,
        cuotasPagas,
      ],
    )

    io.emit('actualizar-tabla')
    res.json({ ok: true, id: result.rows[0].id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

app.get('/bingo', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        numero_bingo,
        nombre,
        apellido,
        domicilio,
        telefono,
        barrio,
        lugar_cobro,
        mes_inicio,
        fecha_cobro,
        localidad,
        cuotas_pagas
      FROM bingo
      ORDER BY numero_bingo
    `)

    // 🔥 adaptar formato para frontend
    const data = result.rows
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo datos' })
  }
})
