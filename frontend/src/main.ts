import type { Bingo } from './Bingo.ts'

import './style.css'
import { io } from 'socket.io-client'
import { esconderForm } from './btnAdd.ts'
import { cantCuotasPagas } from './selectCuotas.ts'
import { renderTabla, calcularDeuda } from './funcAux.ts'
import intlTelInput from 'intl-tel-input/intlTelInputWithUtils'

let token = localStorage.getItem('token')
const inputAddName = document.getElementById(
  'input-submit-name',
) as HTMLInputElement
const inputAddUser = document.getElementById(
  'input-submit-user',
) as HTMLInputElement
const btnSubmitUser = document.getElementById(
  'submit-user',
) as HTMLButtonElement
const inputAddPassword = document.getElementById(
  'input-submit-password',
) as HTMLInputElement
const form = document.getElementById('form') as HTMLFormElement
const appDiv = document.getElementById('app') as HTMLDivElement
const loginForm = document.getElementById('login') as HTMLFormElement
const input = document.getElementById('telefono') as HTMLInputElement
const buscador = document.getElementById('buscador') as HTMLInputElement
const inputUsername = document.getElementById('user') as HTMLInputElement
const inputPassword = document.getElementById('pass') as HTMLInputElement
const btnLogin = document.getElementById('btn-login') as HTMLInputElement
const btnAddUser = document.getElementById('btn-add-user') as HTMLButtonElement
const contenedorLeyenda = document.getElementById('leyenda') as HTMLTableElement

let asc = true
let timeout: any
let datos: Bingo[] = []

btnSubmitUser.addEventListener('click', async (e) => {
  e.preventDefault()

  const name = inputAddName.value
  const username = inputAddUser.value
  const password = inputAddPassword.value

  const res = await fetch('https://backend-production-ecc8.up.railway.app/auth/create-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, username, password }),
  })

  const data = await res.json()

  if (data.ok) {
    alert('Usuario añadido con éxito')
  } else {
    alert(data.error)
  }
})

if (token) {
  mostrarApp()
}

btnLogin.addEventListener('click', async (e) => {
  if (!loginForm.checkValidity()) {
    e.preventDefault()
    loginForm.reportValidity()
    return
  }
  e.preventDefault()
  const username = inputUsername.value
  const password = inputPassword.value

  if (!username || !password) return

  const res = await fetch('https://backend-production-ecc8.up.railway.app/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()

  if (data.token) {
    localStorage.clear()
    localStorage.setItem('token', data.token)
    token = data.token
    mostrarApp()

    if (data.admin) {
      btnAddUser.classList.remove('oculto')
      localStorage.setItem('admin', data.admin)
    }
  } else {
    alert(data.error)
  }
})

function mostrarApp() {
  loginForm.style.display = 'none'
  appDiv.classList.remove('oculto')
  contenedorLeyenda.classList.remove('oculto')

  cargarDatos()
}

async function cargarDatos() {
  const res = await fetch('https://backend-production-ecc8.up.railway.app/bingo')
  datos = await res.json()

  if (localStorage.getItem('admin')) {
    btnAddUser.classList.remove('oculto')
  }

  renderTabla(datos)
}

const iti = intlTelInput(input, {
  initialCountry: 'ar',
  preferredCountries: ['ar', 'cl', 'us'],
  utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input/build/js/utils.js',
} as any)

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const numeroBingo = parseInt(
    (document.querySelector('#numero-bingo') as HTMLInputElement).value,
  )
  const nombre = (document.querySelector('#nombre') as HTMLInputElement).value
  const apellido = (document.querySelector('#apellido') as HTMLInputElement)
    .value
  const domicilio = (document.querySelector('#domicilio') as HTMLInputElement)
    .value
  await iti.promise
  if (!iti.isValidNumber()) {
    alert('Número inválido')
    return
  }
  let telefono = iti.getNumber()
  const country = iti.getSelectedCountryData()?.iso2
  if (country === 'ar' && !telefono.startsWith('+549')) {
    telefono = telefono.replace('+54', '+549')
  }
  const barrio = (document.querySelector('#barrio') as HTMLInputElement).value
  const lugarDeCobro = (
    document.querySelector('#lugar-de-cobro') as HTMLInputElement
  ).value
  const mesInicio = (document.querySelector('#mes-inicio') as HTMLInputElement)
    .value
  const fechaDeCobro = (
    document.querySelector('#fecha-de-cobro') as HTMLInputElement
  ).value
  const localidad = (document.querySelector('#localidad') as HTMLInputElement)
    .value
  const cuotasPagas = cantCuotasPagas()

  const res = await fetch('https://backend-production-ecc8.up.railway.app/bingo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      numeroBingo,
      nombre,
      apellido,
      domicilio,
      telefono,
      barrio,
      lugarDeCobro,
      mesInicio,
      fechaDeCobro,
      localidad,
      cuotasPagas,
    }),
  })

  const result = await res.json()

  if (result.ok) esconderForm()

  if (result.error.code === '23505') alert('Numero bingo ya ingresado')
})

document.querySelectorAll('th').forEach((th) => {
  th.addEventListener('click', () => {
    const campo = th.getAttribute('data-campo')

    if (campo === 'cuotas-pagas') {
      datos.sort((a, b) => {
        const deudaA = calcularDeuda(a)
        const deudaB = calcularDeuda(b)

        return asc ? deudaB - deudaA : deudaA - deudaB
      })

      asc = !asc
      renderTabla(datos)
      return
    }

    const campoId = th.getAttribute('data-campo') as keyof Bingo

    if (!campoId) return

    datos.sort((a, b) => {
      const valA = a[campoId]
      const valB = b[campoId]

      // números
      if (typeof valA === 'number' && typeof valB === 'number') {
        return asc ? valA - valB : valB - valA
      }

      // fechas
      if (campoId.includes('fecha') || campoId.includes('mes')) {
        return asc
          ? new Date(valA as string).getTime() -
              new Date(valB as string).getTime()
          : new Date(valB as string).getTime() -
              new Date(valA as string).getTime()
      }

      // strings
      return asc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })

    asc = !asc

    renderTabla(datos)
  })
})

buscador.addEventListener('input', () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    const texto = buscador.value.toLowerCase()

    const filtrados = datos.filter((item) =>
      Object.values(item).some((valor) =>
        String(valor).toLowerCase().includes(texto),
      ),
    )

    renderTabla(filtrados)
  }, 300)
})

const socket = io('https://backend-production-ecc8.up.railway.app')

socket.on('actualizar-tabla', () => {
  console.log('Actualizar datos')

  cargarDatos()
})
