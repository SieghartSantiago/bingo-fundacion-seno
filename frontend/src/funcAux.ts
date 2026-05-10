import type { Bingo } from './types/Bingo'
import type { Login } from './types/Login.ts'
import type { Historial } from './types/Historial'

import {
  arrConfigAvisos,
  datosBingo,
  editarFila,
  editarFilaUsuario,
  id,
  numeroBingoCambiando,
  setCambiandoConfigAvisos,
} from './main.ts'
import { DateTime } from 'luxon'
import * as elementosHtml from './elements.ts'
import type { Cuotas } from './types/Cuotas.ts'

let tablaVaciaBingo: boolean = true
let tablaVaciaUsuario: boolean = true
let tablaVaciaHistorial: boolean = true

const STR_CLASS_OCULTO: string = 'oculto'

elementosHtml.checkOcultarCancelados.addEventListener('input', (e): void => {
  e.preventDefault()
  renderTablaBingo(datosBingo)
})

function renderTablaBingo(data: Bingo[], orden: boolean = false): void {
  elementosHtml.tbodyBingo.innerHTML = ''
  let cant = 0

  if (!orden) elementosHtml.numeroBingoColumna.classList.add('desc')

  console.log(data)

  data.forEach((item) => {
    if (tablaVaciaBingo) {
      tablaVaciaBingo = false
      elementosHtml.arrTablasHtml[0].classList.remove('skeleton-tabla')
    }
    if (!(elementosHtml.checkOcultarCancelados.checked && item.deshabilitado)) {
      const tr = document.createElement('tr')
      tr.onclick = () => {
        editarFila(item.numero_bingo)
      }

      tr.classList.add('fila-bingo')

      if (item.deshabilitado) {
        tr.classList.add('fila-deshabilitada')
      }

      tr.innerHTML = `
      <td>${item.numero_bingo}</td>
      <td>${item.nombre}</td>
      <td>${item.apellido}</td>
      <td>${item.domicilio}</td>
      <td>${item.telefono}</td>
      <td>${item.barrio}</td>
      <td>${item.lugar_cobro}</td>
      <td>${item.mes_inicio_str}</td>
      <td>${item.fecha_cobro}</td>
      <td>${item.localidad}</td>
      <td>${renderCuotas(item.cuotas, item.mes_inicio_str)}</td>
      <td>${strConfigAviso(true, item.configAvisos[0])}</td>
      <td>${strConfigAviso(false, item.configAvisos[1])}</td>
    `

      elementosHtml.tbodyBingo.appendChild(tr)
      cant++
    }
  })
  elementosHtml.cantNumBingo.innerText = String(cant)
}

function strConfigAviso(esMes: boolean, num: number): string {
  if (num === 0) return 'Nunca'

  if (esMes) return `Cada ${String(num)} mes${num > 1 ? 'es' : ''}`

  switch (num) {
    case 31:
      return 'Último día del mes'
    case 32:
      return 'Anteúltimo día del mes'
    case 33:
      return 'Penúltimo día del mes'
    default:
      return `Día número ${num} del mes`
  }
}

function mesesTranscurridos(desde: string): number {
  const inicio = new Date(desde)
  const hoy = new Date()

  let meses =
    (hoy.getFullYear() - inicio.getFullYear()) * 12 +
    (hoy.getMonth() - inicio.getMonth())

  return meses + 1 // porque la cuota 1 cuenta
}

function renderCuotas(cuotasPagadas: Cuotas[], mes_inicio: string): string {
  const meses = mesesTranscurridos(mes_inicio)

  return `
    <div class="indicador-cuotas-pagas">
      ${Array.from({ length: 8 })
        .map((_, i) => {
          const numero = i + 1

          if (numero <= cuotasPagadas.length) {
            return `<div class="cuota-paga">${medioPago(cuotasPagadas[i].medio_pago)}</div>`
          }

          if (numero < meses) {
            return `<div class="cuota-no-paga">${numero}</div>`
          }

          return `<div class="cuota-vacia">${numero}</div>`
        })
        .join('')}
    </div>
  `
}

function medioPago(numMedioPago: number): string {
  return numMedioPago === 0 ? 'MP' : 'EF'
}

function calcularDeuda(item: Bingo): number {
  const meses = mesesTranscurridos(item.mes_inicio_str)
  return Math.max(0, meses - item.cuotas.length)
}

function eliminarFila(numBingo: number): void {
  const filas = Array(
    ...document.querySelectorAll('#tabla-body tr'),
  ) as HTMLElement[]

  filas.forEach((fila) => {
    const celdas = fila.querySelectorAll('td')

    if (celdas[0]?.textContent === `${numBingo}`) {
      fila.remove()
    }
  })
}

function renderTablaHistorial(data: Historial[], orden: boolean = false): void {
  elementosHtml.tbodyHistorial.innerHTML = ''
  let cant: number = 0

  if (!orden) elementosHtml.idHistorialColumna.classList.add('desc')

  data.forEach((item: Historial) => {
    if (tablaVaciaHistorial) {
      tablaVaciaHistorial = false
      elementosHtml.arrTablasHtml[1].classList.remove('skeleton-tabla')
    }
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.tabla_afectada}</td>
      <td>${item.registro_id}</td>
      <td>${item.accion}</td>
      <td>${
        item.datos_anteriores
          ? Object.entries(item.datos_anteriores)
              .map(
                ([key, value]) =>
                  `<strong>${key !== 'cuotas_arr' ? key : 'cuotas'}:</strong> ${key !== 'cuotas_arr' ? value : value.map((cuota: number) => medioPago(cuota))}`,
              )
              .join('<br>')
          : ''
      }</td>
      <td>${
        item.datos_nuevos
          ? Object.entries(item.datos_nuevos)
              .map(
                ([key, value]) =>
                  `<strong>${key !== 'cuotas_arr' ? key : 'cuotas'}:</strong> ${key !== 'cuotas_arr' ? value : value.map((cuota: number) => medioPago(cuota))}`,
              )
              .join('<br>')
          : ''
      }</td>
      <td>${item.nombre_usuario}</td>
      <td>${DateTime.fromISO(item.fecha).toFormat('dd/MM/yyyy HH:mm:ss')}</td>
    `

    elementosHtml.tbodyHistorial.appendChild(tr)
    cant++
  })
  elementosHtml.cantNumHistorial.innerText = String(cant)
}

function renderTablaUsuarios(data: Login[], orden: boolean = false): void {
  elementosHtml.tbodyUsuarios.innerHTML = ''
  let cant = 0

  if (!orden) elementosHtml.idUsuarioColumna.classList.add('desc')

  data.forEach((item) => {
    if (tablaVaciaUsuario) {
      tablaVaciaUsuario = false
      elementosHtml.arrTablasHtml[2].classList.remove('skeleton-tabla')
    }
    const tr = document.createElement('tr')

    tr.classList.add('fila-usuarios')

    tr.onclick = () => {
      editarFilaUsuario(item.id)
    }

    if (!item.habilitado) {
      tr.classList.add('fila-deshabilitada')
    }

    console.log(item.id)
    console.log(id)

    if (item.id === id) {
      tr.classList.add('fila-usuario-propio')
    }

    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.nombre}</td>
      <td>${item.username}</td>
      <td>${item.admin ? 'Si' : 'No'}</td>
      <td>${new Date(item.created_at).toLocaleDateString()}</td>
    `

    elementosHtml.tbodyUsuarios.appendChild(tr)
    cant++
  })
  elementosHtml.cantNumUsuarios.innerText = String(cant)
}

function mostrarElemento(elemento: HTMLElement, mostrar: boolean = true): void {
  const contieneClass = elementoOculto(elemento)

  if (mostrar && contieneClass) {
    elemento.classList.remove(STR_CLASS_OCULTO)
    return
  }

  if (!mostrar && !contieneClass) elemento.classList.add(STR_CLASS_OCULTO)
}

function elementoOculto(elemento: HTMLElement): boolean {
  return elemento.classList.contains(STR_CLASS_OCULTO)
}

function transitionElement(elemento: HTMLElement, t: number): void {
  elemento.classList.add('aviso-transform')
  setTimeout(() => {
    elemento.classList.remove('aviso-transform')
  }, t)
}

function mostrarAvisoError(mensaje: string): void {
  elementosHtml.txtAvisoError.innerText = 'Error: ' + mensaje
  transitionElement(elementosHtml.avisoError, 5000)
}

function checkErroresHTTP(resp: Response): boolean {
  switch (resp.status) {
    case 500:
      mostrarElemento(elementosHtml.pantallaErrorConexion)
      return true
    case 401:
      return true
    case 403:
      mostrarElemento(elementosHtml.pantallaErrorPermisos)
      return true
    case 400:
      return true
    case 404:
      return true
  }
  return false
}

function mostrarContenedorFormConfigAvisos(): void {
  setCambiandoConfigAvisos(true)
  console.log(arrConfigAvisos)

  if (numeroBingoCambiando) {
    switch (arrConfigAvisos[0]) {
      case 0:
        elementosHtml.selectAvisosMeses.value = '2'
        mostrarElemento(
          elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoXMes,
          false,
        )
        break
      case 1:
        elementosHtml.selectAvisosMeses.value = '0'
        mostrarElemento(
          elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoXMes,
          false,
        )
        break
      default:
        elementosHtml.selectAvisosMeses.value = '1'
        mostrarElemento(
          elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoXMes,
        )
        elementosHtml.inputSelectConfigAvisosPersonalizadoXMes.value = String(
          arrConfigAvisos[0],
        )
        break
    }

    switch (arrConfigAvisos[1]) {
      case 0:
        mostrarElemento(elementosHtml.selectAvisosDia, false)
        mostrarElemento(
          elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoDia,
          false,
        )
        break
      case 1:
        mostrarElemento(elementosHtml.selectAvisosDia)
        mostrarElemento(
          elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoDia,
          false,
        )
        elementosHtml.selectAvisosDia.value = '0'
        break
      case 31:
      case 32:
      case 33:
        mostrarElemento(elementosHtml.selectAvisosDia)
        mostrarElemento(
          elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoDia,
          false,
        )
        elementosHtml.selectAvisosDia.value = String(arrConfigAvisos[1] - 30)
        break
      default:
        mostrarElemento(elementosHtml.contenedorSelectAvisosDia)
        mostrarElemento(
          elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoDia,
        )
        elementosHtml.selectAvisosDia.value = '4'
        elementosHtml.inputSelectConfigAvisosPersonalizadoDia.value = String(
          arrConfigAvisos[1],
        )
        break
    }
  } else {
    elementosHtml.selectAvisosMeses.value = '0'
    elementosHtml.inputSelectConfigAvisosPersonalizadoXMes.value = '1'
    elementosHtml.selectAvisosDia.value = '0'
    elementosHtml.inputSelectConfigAvisosPersonalizadoDia.value = '1'

    mostrarElemento(
      elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoXMes,
      false,
    )

    mostrarElemento(elementosHtml.selectAvisosDia)
    mostrarElemento(
      elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoDia,
      false,
    )
  }

  mostrarElemento(elementosHtml.modalFormBingo, false)
  mostrarElemento(elementosHtml.modalFormBingoConfigAvisos)
}

function esconderContenedorFormConfigAvisos(): void {
  setCambiandoConfigAvisos(false)
  mostrarElemento(elementosHtml.modalFormBingoConfigAvisos, false)
  mostrarElemento(elementosHtml.modalFormBingo)
}

export {
  renderTablaBingo,
  calcularDeuda,
  eliminarFila,
  renderTablaHistorial,
  renderTablaUsuarios,
  mostrarElemento,
  elementoOculto,
  transitionElement,
  mostrarAvisoError,
  checkErroresHTTP,
  mostrarContenedorFormConfigAvisos,
  esconderContenedorFormConfigAvisos,
}
