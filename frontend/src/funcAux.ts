import type { Bingo } from './Bingo'

function formatearFecha(fecha: string) {
  const d = new Date(fecha)
  return d.toLocaleDateString()
}

function formatearMes(fecha: string) {
  const d = new Date(fecha)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function renderTabla(data: Bingo[]) {
  const tbody = document.getElementById('tabla-body') as HTMLElement
  tbody.innerHTML = ''

  data.forEach((item) => {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td>${item.numero_bingo}</td>
      <td>${item.nombre}</td>
      <td>${item.apellido}</td>
      <td>${item.domicilio}</td>
      <td>${item.telefono}</td>
      <td>${item.barrio}</td>
      <td>${item.lugar_cobro}</td>
      <td>${formatearMes(item.mes_inicio)}</td>
      <td>${formatearFecha(item.fecha_cobro)}</td>
      <td>${item.localidad}</td>
      <td>${renderCuotas(item.cuotas_pagas, item.mes_inicio)}</td>
    `

    tbody.appendChild(tr)
  })
}

function mesesTranscurridos(desde: string) {
  const inicio = new Date(desde)
  const hoy = new Date()

  let meses =
    (hoy.getFullYear() - inicio.getFullYear()) * 12 +
    (hoy.getMonth() - inicio.getMonth())

  return meses + 1 // porque la cuota 1 cuenta
}

function renderCuotas(cuotasPagadas: number, mes_inicio: string) {
  const meses = mesesTranscurridos(mes_inicio)

  return `
    <div class="indicador-cuotas-pagas">
      ${Array.from({ length: 8 })
        .map((_, i) => {
          const numero = i + 1

          if (numero <= cuotasPagadas) {
            return `<div class="cuota-paga">${numero}</div>`
          }

          if (numero <= meses) {
            return `<div class="cuota-no-paga">${numero}</div>`
          }

          return `<div class="cuota-vacia">${numero}</div>`
        })
        .join('')}
    </div>
  `
}

function calcularDeuda(item: Bingo) {
  const meses = mesesTranscurridos(item.mes_inicio)
  return Math.max(0, meses - item.cuotas_pagas)
}

export { renderTabla, calcularDeuda }
