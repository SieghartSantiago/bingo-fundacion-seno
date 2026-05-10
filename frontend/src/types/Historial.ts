export type Historial = {
  id: number
  tabla_afectada: string
  registro_id: number
  accion: string
  datos_anteriores: JSON | null
  datos_nuevos: JSON | null
  usuario_id: number
  nombre_usuario: string
  fecha: string
}
