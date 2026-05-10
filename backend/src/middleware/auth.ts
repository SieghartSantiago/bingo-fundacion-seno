import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { pool } from '../db'

export interface AuthRequest extends Request {
  user?: { id: number }
}

export default async function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const header: string | undefined = req.headers.authorization

  if (!header) return res.sendStatus(401)

  const token: string = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number }

    const user = await pool.query(
      'SELECT id, habilitado FROM login WHERE id = $1',
      [decoded.id],
    )

    if (user.rows.length === 0) {
      return res.sendStatus(401)
    }

    if (!user.rows[0].habilitado) {
      return res.sendStatus(403)
    }

    req.user = { id: decoded.id }

    next()
  } catch {
    return res.sendStatus(401)
  }
}
