import type { Cuotas } from "./Cuotas"

export type Bingo = {
  numero_bingo: number
  nombre: string
  apellido: string
  domicilio: string
  telefono: string
  barrio: string
  lugar_cobro: string
  mes_inicio: Date
  fecha_cobro: string
  localidad: string
  deshabilitado: boolean

  cuotas: Cuotas[]
  configAvisos: number[]

  mes_inicio_str: string
}
