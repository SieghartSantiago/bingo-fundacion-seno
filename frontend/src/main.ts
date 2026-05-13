import type { Bingo } from './types/Bingo.ts'
import type { Historial } from './types/Historial.ts'

import './common.css'
import './style.css'

import {
  renderTablaBingo,
  eliminarFila,
  renderTablaHistorial,
  renderTablaUsuarios,
  mostrarElemento,
  checkErroresHTTP,
} from './funcAux.ts'
import { io, Socket } from 'socket.io-client'
import { checkChecks, setSelectCuotas } from './selectCuotas.ts'
import intlTelInput from 'intl-tel-input/intlTelInputWithUtils'
import type { Iti } from 'intl-tel-input/intlTelInputWithUtils'
import {
  mostrarContenedorForm,
  mostrarContenedorFormUsuario,
  setIconoTh,
} from './btn.ts'

import * as elementosHtml from './elements.ts'
import type { Login } from './types/Login.ts'

const STR_CURSOR_CARGANDO = 'cursor-cargando'

export let token: string | null = localStorage.getItem('token')

export function setToken(val: string | null): void {
  token = val
}

export let id: number | null = Number(localStorage.getItem('id'))

export function setId(val: number | null): void {
  id = val
}

export const iti: Iti = intlTelInput(elementosHtml.telefonoInput, {
  initialCountry: 'ar',
  preferredCountries: ['ar', 'cl', 'us'],
  utilsScript: import.meta.env.VITE_CDN_UTILS,
} as any)

export let pantallaActual: HTMLDivElement = elementosHtml.contenedorBingo
export let pantallaActualNum: number

export let cargandoDatos: boolean = false

export let datosBingo: Bingo[] = []

export function setDatosBingo(val: Bingo[]): void {
  datosBingo = val
}

export let datosHistorial: Historial[] = []

export function setDatosHistorial(val: Historial[]): void {
  datosHistorial = val
}

export let datosUsuarios: Login[] = []

export function setDatosUsuarios(val: Login[]): void {
  datosUsuarios = val
}

export let cambiandoConfigAvisos: boolean = false

export function setCambiandoConfigAvisos(val: boolean) {
  cambiandoConfigAvisos = val
}

export const arrConfigAvisos: number[] = [0, 0]

let numPantallaActual: number = parseInt(localStorage.getItem('pantalla')!) || 0
export let numeroBingoCambiando: number | null = null
export let idUsuarioCambiando: number | null = null
export function setIdUsuarioCambiando(val : number | null) {
  idUsuarioCambiando = val
}

export const API: string = import.meta.env.VITE_API_URL

export function mostrarApp(): void {
  elementosHtml.avisoBorrado.classList.add('aviso-transition')
  elementosHtml.cargaDiscreta.classList.add('aviso-transition')
  elementosHtml.avisoNingunCambio.classList.add('aviso-transition')
  elementosHtml.avisoCambiosExito.classList.add('aviso-transition')
  elementosHtml.avisoBorradoUsuario.classList.add('aviso-transition')
  mostrarElemento(elementosHtml.avisoBorrado)
  mostrarElemento(elementosHtml.btnCerrarSesion)
  mostrarElemento(elementosHtml.contenedorHeader)
  mostrarElemento(elementosHtml.avisoBorradoUsuario)
  mostrarElemento(elementosHtml.modalFormLogin, false)

  if (localStorage.getItem('admin')) {
    elementosHtml.arrBtnHeader.push(elementosHtml.btnUsuarios)
    elementosHtml.arrPantallas.push(elementosHtml.contenedorUsuarios)
  }

  const socket: Socket = io(API)

  socket.on('actualizar-tabla', (): void => {
    elementosHtml.cargaDiscreta.classList.add('aviso-transform')
    cargarDatos()
  })

  socket.on('actualizar-perfil', (): void => {
    window.location.href = window.location.href
  })

  cambioPantalla(numPantallaActual)

  cargarDatos()
}

async function cargarDatos(): Promise<void> {
  cargandoDatos = true

  setElementosCursorCargando(true)

  const resBingo: Response = await fetch(`${API}/bingo`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const resHistorial: Response = await fetch(`${API}/historial`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (checkErroresHTTP(resBingo)) return
  if (checkErroresHTTP(resHistorial)) return

  setDatosBingo(await resBingo.json())

  datosBingo.forEach((fila): void => {
    fila.mes_inicio = new Date(fila.mes_inicio)
    fila.mes_inicio_str = `${fila.mes_inicio.getFullYear()}-${String(fila.mes_inicio.getMonth() + 1).padStart(2, '0')}`
  })

  if (numeroBingoCambiando) {
    eliminarFila(numeroBingoCambiando)
    numeroBingoCambiando = null
  }

  renderTablaBingo(datosBingo)

  setDatosHistorial(await resHistorial.json())

  renderTablaHistorial(datosHistorial)

  if (localStorage.getItem('admin')) {
    const resUsuarios: Response = await fetch(`${API}/login`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (checkErroresHTTP(resUsuarios)) return

    setDatosUsuarios(await resUsuarios.json())

    renderTablaUsuarios(datosUsuarios)
  }

  elementosHtml.cargaDiscreta.classList.remove('aviso-transform')

  setElementosCursorCargando(false)
  cargandoDatos = false
}

export function editarFila(numBingo: number): void {
  if (cargandoDatos) return

  const fila: Bingo | undefined = datosBingo.find(
    (f): boolean => f.numero_bingo === numBingo,
  )

  if (!fila) return

  mostrarElemento(elementosHtml.actualizarDatosTxt)
  elementosHtml.btnSubmitBingo.value = 'Editar Participante'

  elementosHtml.numeroBingoInput.value = `${numBingo}`
  elementosHtml.nombreInput.value = fila.nombre
  elementosHtml.apellidoInput.value = fila.apellido
  elementosHtml.domicilioInput.value = fila.domicilio
  iti.setNumber(fila.telefono)
  elementosHtml.barrioInput.value = fila.barrio
  elementosHtml.lugarDeCobroInput.value = fila.lugar_cobro
  elementosHtml.mesInicioInput.value = fila.mes_inicio_str

  elementosHtml.fechaDeCobroInput.value = fila.fecha_cobro

  elementosHtml.localidadInput.value = fila.localidad

  elementosHtml.checkDeshabilitado.checked = fila.deshabilitado

  arrConfigAvisos[0] = fila.configAvisos[0]
  arrConfigAvisos[1] = fila.configAvisos[1]

  checkChecks(fila.cuotas.length - 1, true, true)
  setSelectCuotas(fila.cuotas.map((e): number => e.medio_pago))

  numeroBingoCambiando = numBingo

  mostrarContenedorForm(true)
}

export function editarFilaUsuario(idUsuario: number): void {
  if (cargandoDatos) return

  const fila: Login | undefined = datosUsuarios.find(
    (f): boolean => f.id === idUsuario,
  )

  if (!fila) return

  elementosHtml.inputAddName.value = fila.nombre
  elementosHtml.inputAddUser.value = fila.username
  elementosHtml.inputAdmin.checked = fila.admin
  elementosHtml.checkDeshabilitadoUsuario.checked = !fila.habilitado

  idUsuarioCambiando = idUsuario

  elementosHtml.inputAdmin.disabled = idUsuarioCambiando === id
  elementosHtml.checkDeshabilitadoUsuario.disabled = idUsuarioCambiando === id

  mostrarElemento(elementosHtml.pantallaCargaFormUsuarios, false)
  mostrarContenedorFormUsuario(true)
}

export function nullCambioDatos(): void {
  numeroBingoCambiando = null
}

export function vaciarInputsForm(): void {
  elementosHtml.numeroBingoInput.value = ''
  elementosHtml.nombreInput.value = ''
  elementosHtml.apellidoInput.value = ''
  elementosHtml.domicilioInput.value = ''
  iti.setNumber('')
  iti.setCountry('ar')
  elementosHtml.barrioInput.value = ''
  elementosHtml.lugarDeCobroInput.value = ''
  elementosHtml.mesInicioInput.value = ''
  elementosHtml.fechaDeCobroInput.value = ''
  elementosHtml.localidadInput.value = ''
  elementosHtml.checkDeshabilitado.checked = false
  checkChecks(0, false, true)
  arrConfigAvisos[0] = 1
  arrConfigAvisos[1] = 1
}

export function vaciarInputsFormUsuario(): void {
  elementosHtml.inputAddName.value = ''
  elementosHtml.inputAddPassword.value = ''
  elementosHtml.inputAddUser.value = ''
  elementosHtml.checkDeshabilitadoUsuario.checked = false
}

export function cambioPantalla(num: number): void {
  for (let i: number = 0; i < elementosHtml.arrPantallas.length; i++) {
    if (i === num) {
      pantallaActual = elementosHtml.arrPantallas[i]
      mostrarElemento(pantallaActual)
      mostrarElemento(elementosHtml.arrBtnHeader[i], false)
      setIconoTh(i)
      localStorage.setItem('pantalla', String(i))
    } else {
      mostrarElemento(elementosHtml.arrPantallas[i], false)
      mostrarElemento(elementosHtml.arrBtnHeader[i])
    }
  }

  if (num === 0) {
    mostrarElemento(elementosHtml.contenedorLeyenda)
  } else {
    mostrarElemento(elementosHtml.contenedorLeyenda, false)
  }

  pantallaActualNum = num
}

function setElementosCursorCargando(val: boolean): void {
  setCursorCargando(elementosHtml.btnAdd, val)
  setCursorCargando(elementosHtml.btnAddUsuario, val)
  setCursorCargando(elementosHtml.contenedorUsuarios, val)
  setCursorCargando(elementosHtml.contenedorBingo, val)
  Array(
    ...(document.getElementsByClassName(
      'fila-bingo',
    ) as HTMLCollectionOf<HTMLElement>),
  ).forEach((fila): void => setCursorCargando(fila, val))
  Array(
    ...(document.getElementsByClassName(
      'fila-usuarios',
    ) as HTMLCollectionOf<HTMLElement>),
  ).forEach((fila): void => setCursorCargando(fila, val))
}

function setCursorCargando(element: HTMLElement, val: boolean): void {
  if (!val) {
    if (element.classList.contains(STR_CURSOR_CARGANDO)) {
      element.classList.remove(STR_CURSOR_CARGANDO)
    }
    return
  }

  if (!element.classList.contains(STR_CURSOR_CARGANDO))
    element.classList.add(STR_CURSOR_CARGANDO)
}

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (cambiandoConfigAvisos) return
    elementosHtml.arrModals.forEach((modal): void =>
      mostrarElemento(modal, false),
    )
  }
})

window.addEventListener('load', (): void => {
  mostrarElemento(elementosHtml.modalFormLogin)
  elementosHtml.avisoError.classList.add('aviso-transition')
  mostrarElemento(elementosHtml.contenedorAvisos)
  if (token) {
    mostrarApp()
  }
  elementosHtml.pantallaCarga.classList.add('ocultandose')
  setTimeout((): void => {
    mostrarElemento(elementosHtml.pantallaCarga, false)
    document.body.style.overflow = 'auto'
    document.body.style.height = ''
  }, 1000)
})
