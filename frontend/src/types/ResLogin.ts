import type { Res } from './Res'

export type ResLogin = Res & {
  id: number
  nombre: string
  username: string
  admin: boolean
  created_at: Date
  habilitado: boolean
  token: string
}
