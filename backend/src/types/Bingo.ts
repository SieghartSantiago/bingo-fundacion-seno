import { Cuotas } from "./Cuotas"

export interface Bingo {
  id: number
  numero_bingo: number
  nombre: string
  apellido: string
  domicilio: string
  barrio: string
  localidad: string
  telefono: string
  lugar_cobro: string
  mes_inicio: Date
  fecha_cobro: string
  cuotas: Cuotas[]
  cuotas_arr: number[]
  deshabilitado: boolean
  config_meses: number
  config_dia:number
}
