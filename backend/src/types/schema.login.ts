import { z } from 'zod'

export const schemaLogin = z.object({
  id: z.coerce.number().min(1).optional(),
  nombre: z.string().min(1).optional(),
  username: z.string().min(1),
  password: z.string().min(1).optional(),
  habilitado: z.coerce.boolean().optional()
})
