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
app.use(bingoPostRoutes)
app.use(historialRoutes)
app.use(bingoDeleteRoutes)
app.use(loginPostRoutes)
app.use(loginGetRoutes)
app.use(loginDeleteRoutes)

io.on('connection', (socket) => {
  console.log('Cliente conectado')
})

server.listen(PORT, () => {
  console.log('Servidor corriendo en puerto', PORT)
})
