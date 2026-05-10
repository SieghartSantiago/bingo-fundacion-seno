export interface Login {
  id: number
  username: string
  password_hash: string
  created_at: Date
  admin: boolean
  nombre: string
  habilitado: boolean
}
