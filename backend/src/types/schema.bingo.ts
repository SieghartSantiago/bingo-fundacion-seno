import { z } from 'zod'

export const schemaBingo = z.object({
  numeroBingo: z.coerce.number().int().min(1),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  domicilio: z.string().min(1),
  barrio: z.string().min(1),
  localidad: z.string().min(1),
  telefono: z.string().min(8),
  lugarDeCobro: z.string().min(1),
  mesInicio: z.string().refine((val) => !isNaN(Date.parse(val))),
  fechaDeCobro: z.string().min(1).max(50),
  arrOptionsCuotas: z.array(z.number().int().min(0).max(1)),
  deshabilitado: z.coerce.boolean(),
  arrConfigAvisos: z.array(z.number().int().min(0).max(33)).max(2),
})
