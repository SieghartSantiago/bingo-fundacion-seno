export interface Historial {
  id: number
  tabla_afectada: string
  registro_id: number
  accion: string
  datos_anteriores: JSON
  datos_nuevos: JSON
  usuario_id: number
  fecha: Date

  nombre_usuario: string
}
