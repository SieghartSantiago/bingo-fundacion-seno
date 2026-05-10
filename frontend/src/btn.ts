import type { Bingo } from './types/Bingo.ts'
import type { Login } from './types/Login.ts'
import type { Historial } from './types/Historial.ts'

import {
  nullCambioDatos,
  vaciarInputsForm,
  cambioPantalla,
  API,
  token,
  numeroBingoCambiando,
  setToken,
  mostrarApp,
  iti,
  datosBingo,
  setDatosBingo,
  pantallaActual,
  datosHistorial,
  datosUsuarios,
  idUsuarioCambiando,
  vaciarInputsFormUsuario,
  setId,
  id,
  cargandoDatos,
  arrConfigAvisos,
} from './main.ts'
import { cantCuotasPagas } from './selectCuotas.ts'
import {
  renderTablaBingo,
  calcularDeuda,
  renderTablaHistorial,
  renderTablaUsuarios,
  mostrarElemento,
  elementoOculto,
  transitionElement,
  mostrarAvisoError,
  checkErroresHTTP,
  esconderContenedorFormConfigAvisos,
  mostrarContenedorFormConfigAvisos,
} from './funcAux.ts'

import type { ResLogin } from './types/ResLogin.ts'
import type { Res } from './types/Res.ts'
import type { Cuotas } from './types/Cuotas.ts'
import * as elementosHtml from './elements.ts'

let menuAddShow: boolean = false
let menuAddUsuarioShow: boolean = false
let numeroBingoBorrandose: boolean = false
let usuarioBorrandose: boolean = false

let ascBingo: boolean = false
let thBingo: HTMLTableCellElement = elementosHtml.numeroBingoColumna
let ascHistorial: boolean = false
let thHistorial: HTMLTableCellElement = elementosHtml.idHistorialColumna
let ascUsuarios: boolean = false
let thUsuarios: HTMLTableCellElement = elementosHtml.idUsuarioColumna
let timeoutBingo: number | undefined
let timeoutHistorial: number | undefined
let timeoutUsuarios: number | undefined

export function setIconoTh(numPantalla: number): void {
  const arrAsc: boolean[] = [ascBingo, ascHistorial, ascUsuarios]
  const arrTh: HTMLTableCellElement[] = [thBingo, thHistorial, thUsuarios]

  if (arrAsc[numPantalla]) {
    arrTh[numPantalla].classList.remove('desc')
    arrTh[numPantalla].classList.add('asc')
  } else {
    arrTh[numPantalla].classList.remove('asc')
    arrTh[numPantalla].classList.add('desc')
  }
}

elementosHtml.loginForm.addEventListener('submit', async (e): Promise<void> => {
  e.preventDefault()
  mostrarElemento(elementosHtml.pantallaCargaFormLogin)
  if (!elementosHtml.loginForm.checkValidity()) {
    elementosHtml.loginForm.reportValidity()
    mostrarElemento(elementosHtml.pantallaCargaFormLogin, false)
    return
  }
  const username: string = elementosHtml.inputUsername.value
  const password: string = elementosHtml.inputPassword.value

  if (!username || !password) return

  const res: Response = await fetch(`${API}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (checkErroresHTTP(res) && res.status !== 401) return

  const data: ResLogin = await res.json()

  if (data.token) {
    localStorage.clear()
    localStorage.setItem('token', data.token)
    localStorage.setItem('id', String(data.id))
    setToken(data.token)
    setId(data.id)

    if (data.admin) {
      localStorage.setItem('admin', String(data.admin))
    } else if (localStorage.getItem('admin')) {
      localStorage.removeItem('admin')
    }

    mostrarApp()
  } else {
    if (res.status === 401) {
      elementosHtml.inputPassword.classList.add('input-erroneo')
      setTimeout((): void => {
        elementosHtml.inputPassword.classList.remove('input-erroneo')
      }, 5000)
      mostrarAvisoError('Contraseña incorrecta')
    } else {
      alert(data.error)
    }
  }

  mostrarElemento(elementosHtml.pantallaCargaFormLogin, false)
})

elementosHtml.btnCerrarSesion.addEventListener('click', (e): void => {
  e.preventDefault()
  localStorage.clear()
  window.location.assign(window.location.href)
})

elementosHtml.btnAdd.addEventListener('click', (e): void => {
  e.preventDefault()
  nullCambioDatos()
  arrConfigAvisos[0] = 1
  arrConfigAvisos[1] = 1
  mostrarContenedorForm()
})

elementosHtml.btnAddUsuario.addEventListener('click', (e): void => {
  e.preventDefault()
  mostrarContenedorFormUsuario()
})

elementosHtml.btnCerrarForm.addEventListener('click', (e): void => {
  e.preventDefault()
  nullCambioDatos()
  esconderForm()
})

function esconderForm(): void {
  if (menuAddShow) {
    menuAddShow = false
    mostrarElemento(elementosHtml.actualizarDatosTxt, false)
    mostrarElemento(elementosHtml.modalFormBingo, false)
    vaciarInputsForm()
  }
}

function mostrarContenedorForm(cambiando: boolean = false): void {
  if (cargandoDatos) return

  if (!cambiando) elementosHtml.btnSubmitBingo.value = 'Agregar Participante'
  menuAddShow = true
  mostrarElemento(elementosHtml.modalFormBingo)
}

function esconderFormUsuario(): void {
  if (menuAddUsuarioShow) {
    menuAddUsuarioShow = false
    mostrarElemento(elementosHtml.actualizarDatosUsuarioTxt, false)
    mostrarElemento(elementosHtml.modalFormAgregarUsuario, false)
  }
}

function mostrarContenedorFormUsuario(cambio: boolean = false): void {
  if (cargandoDatos) return

  menuAddUsuarioShow = true

  if (cambio) {
    mostrarElemento(elementosHtml.contenedorPasswordUsuario, false)
    mostrarElemento(elementosHtml.contenedorInputAdmin)
    mostrarElemento(elementosHtml.actualizarDatosUsuarioTxt)
    elementosHtml.btnSubmitUser.value = 'Editar Usuario'
  } else {
    mostrarElemento(elementosHtml.contenedorPasswordUsuario)
    mostrarElemento(elementosHtml.contenedorInputAdmin, false)
    mostrarElemento(elementosHtml.actualizarDatosUsuarioTxt, false)
    elementosHtml.btnSubmitUser.value = 'Agregar Usuario'
  }

  mostrarElemento(elementosHtml.modalFormAgregarUsuario)
}

elementosHtml.btnHome.addEventListener('click', (e): void => {
  e.preventDefault()

  cambioPantalla(0)
})

elementosHtml.btnHistorial.addEventListener('click', (e): void => {
  e.preventDefault()

  cambioPantalla(1)
})

elementosHtml.btnUsuarios.addEventListener('click', (e): void => {
  e.preventDefault()

  cambioPantalla(2)
})

elementosHtml.btnCerrarAddLogin.addEventListener('click', (e): void => {
  e.preventDefault()
  esconderFormUsuario()
})

elementosHtml.btnLimpiarForm.addEventListener('click', (e): void => {
  e.preventDefault()
  vaciarInputsForm()
})

elementosHtml.btnLimpiarFormUsuario.addEventListener('click', (e): void => {
  e.preventDefault()
  vaciarInputsFormUsuario()
})

elementosHtml.btnAvisoBorradoNo.addEventListener('click', (e): void => {
  e.preventDefault()
  if (numeroBingoBorrandose) {
    numeroBingoBorrandose = false
    elementosHtml.avisoBorrado.classList.remove('aviso-transform')
  }
})

elementosHtml.btnAvisoBorradoSi.addEventListener(
  'click',
  async (e): Promise<void> => {
    e.preventDefault()
    if (numeroBingoBorrandose) {
      numeroBingoBorrandose = false
      elementosHtml.avisoBorrado.classList.remove('aviso-transform')
      mostrarElemento(elementosHtml.pantallaCargaForm)

      const res: Response = await fetch(`${API}/bingo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bingoNum: numeroBingoCambiando,
        }),
      })

      if (checkErroresHTTP(res)) return

      const result: Res = await res.json()
      mostrarElemento(elementosHtml.pantallaCargaForm, false)

      if (result.ok) esconderForm()

      if (!result.error) return
    }
  },
)

elementosHtml.btnAvisoBorradoUsuarioNo.addEventListener('click', (e): void => {
  e.preventDefault()
  if (usuarioBorrandose) {
    usuarioBorrandose = false
    elementosHtml.avisoBorradoUsuario.classList.remove('aviso-transform')
  }
})

elementosHtml.btnAvisoBorradoUsuarioSi.addEventListener(
  'click',
  async (e): Promise<void> => {
    e.preventDefault()
    if (usuarioBorrandose) {
      usuarioBorrandose = false
      elementosHtml.avisoBorradoUsuario.classList.remove('aviso-transform')
      mostrarElemento(elementosHtml.pantallaCargaFormUsuarios)

      const res: Response = await fetch(`${API}/login`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idUsuario: idUsuarioCambiando,
        }),
      })

      if (checkErroresHTTP(res)) return

      const result: Res = await res.json()

      mostrarElemento(elementosHtml.pantallaCargaFormUsuarios, false)

      if (result.ok) esconderFormUsuario()

      if (!result.error) return
    }
  },
)

elementosHtml.formUsuarios.addEventListener(
  'submit',
  async (e): Promise<void> => {
    e.preventDefault()
    mostrarElemento(elementosHtml.pantallaCargaFormUsuarios)

    const nombre: string = elementosHtml.inputAddName.value
    const username: string = elementosHtml.inputAddUser.value
    const habilitado: boolean = !elementosHtml.checkDeshabilitadoUsuario.checked
    if (idUsuarioCambiando && !nombre && !username) {
      mostrarElemento(elementosHtml.pantallaCargaFormUsuarios, false)
      if (idUsuarioCambiando === id) {
        mostrarAvisoError('No se puede eliminar su propia cuenta')
        return
      }
      console.log('hola')
      usuarioBorrandose = true
      elementosHtml.indicadorUsuarioBorrandose.innerText =
        String(idUsuarioCambiando)
      elementosHtml.avisoBorradoUsuario.classList.add('aviso-transform')
      return
    } else {
      inputsFormUsuariosRequired(true)

      if (!elementosHtml.formUsuarios.checkValidity()) {
        e.preventDefault()
        elementosHtml.formUsuarios.reportValidity()
        inputsFormUsuariosRequired(false)
        return
      }
    }

    if (!idUsuarioCambiando) {
      console.log('creando')
      const password: string = elementosHtml.inputAddPassword.value

      const res: Response = await fetch(`${API}/login/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, username, password, habilitado }),
      })

      if (checkErroresHTTP(res)) return

      const data: Res = await res.json()

      if (data.ok) {
        alert('Usuario añadido con éxito')
        esconderFormUsuario()
      } else {
        alert(data.error)
      }
    } else {
      const admin: boolean = elementosHtml.inputAdmin.checked

      console.log('cambiando')
      const res: Response = await fetch(`${API}/login/cambio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: idUsuarioCambiando,
          nombre,
          username,
          habilitado,
          admin,
        }),
      })

      if (checkErroresHTTP(res)) return

      const data: Res = await res.json()

      if (data.ok) {
        if (data.message === 'Sin cambios') {
          transitionElement(elementosHtml.avisoNingunCambio, 3000)
        } else {
          transitionElement(elementosHtml.avisoCambiosExito, 3000)
        }
        esconderFormUsuario()
      } else {
        mostrarElemento(elementosHtml.pantallaCargaFormUsuarios, false)
        alert(data.error)
      }
    }
  },
)

elementosHtml.formBingo.addEventListener('submit', async (e): Promise<void> => {
  e.preventDefault()
  mostrarElemento(elementosHtml.pantallaCargaForm)
  const numeroBingo: number = parseInt(elementosHtml.numeroBingoInput.value)
  const nombre: string = elementosHtml.nombreInput.value
  const apellido: string = elementosHtml.apellidoInput.value
  const domicilio: string = elementosHtml.domicilioInput.value
  const barrio: string = elementosHtml.barrioInput.value
  const lugarDeCobro: string = elementosHtml.lugarDeCobroInput.value
  const mesInicio: string = elementosHtml.mesInicioInput.value
  const fechaDeCobro: string = elementosHtml.fechaDeCobroInput.value
  const localidad: string = elementosHtml.localidadInput.value
  const cuotasPagas: number = cantCuotasPagas()
  const deshabilitado: boolean = elementosHtml.checkDeshabilitado.checked
  await iti.promise

  if (
    numeroBingoCambiando &&
    !numeroBingo &&
    !nombre &&
    !apellido &&
    !domicilio &&
    !barrio &&
    !lugarDeCobro &&
    !mesInicio &&
    !fechaDeCobro &&
    !localidad &&
    !cuotasPagas &&
    !iti.getNumber()
  ) {
    numeroBingoBorrandose = true
    mostrarElemento(elementosHtml.pantallaCargaForm, false)
    elementosHtml.indicadorNumeroBorrandose.innerText =
      String(numeroBingoCambiando)
    elementosHtml.avisoBorrado.classList.add('aviso-transform')
    return
  } else {
    inputsFormRequired(true)

    if (!elementosHtml.formBingo.checkValidity()) {
      e.preventDefault()
      elementosHtml.formBingo.reportValidity()
      inputsFormRequired(false)
      return
    }
  }

  inputsFormRequired(false)

  if (!iti.isValidNumber()) {
    alert('Número inválido')
    return
  }
  let telefono: string = iti.getNumber()
  const country: string | undefined = iti.getSelectedCountryData()?.iso2
  if (country === 'ar' && !telefono.startsWith('+549')) {
    telefono = telefono.replace('+54', '+549')
  }

  const arrOptionsCuotas: number[] = []

  for (let i: number = 0; i < cuotasPagas; i++) {
    arrOptionsCuotas.push(elementosHtml.arrSelectCuotas[i].selectedIndex)
  }

  console.log(arrOptionsCuotas)

  let res: Response

  if (numeroBingoCambiando) {
    res = await fetch(`${API}/bingo/cambio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        numeroBingoCambiando,
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
        arrOptionsCuotas,
        deshabilitado,
        arrConfigAvisos,
      }),
    })
  } else {
    res = await fetch(`${API}/bingo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
        arrOptionsCuotas,
        deshabilitado,
        arrConfigAvisos,
      }),
    })
  }
  if (checkErroresHTTP(res)) return

  const result: Res = await res.json()

  mostrarElemento(elementosHtml.pantallaCargaForm, false)

  if (result.ok) {
    if (numeroBingoCambiando) {
      if (result.message === 'Sin cambios') {
        transitionElement(elementosHtml.avisoNingunCambio, 3000)
      } else {
        transitionElement(elementosHtml.avisoCambiosExito, 3000)
        setDatosBingo(
          datosBingo.filter((u) => u.numero_bingo !== numeroBingoCambiando),
        )
      }
    }
    esconderForm()
  }

  if (!result.error) return

  if (result.error.code === '23505') alert('Numero bingo ya ingresado')
})

document.querySelectorAll('th').forEach((th): void => {
  th.addEventListener('click', () => {
    const campo: string | null = th.getAttribute('data-campo')
    document.querySelectorAll('th').forEach((thTemp): void => {
      if (thTemp.classList.contains('asc')) {
        thTemp.classList.remove('asc')
      } else if (thTemp.classList.contains('desc')) {
        thTemp.classList.remove('desc')
      }
    })

    if (pantallaActual === elementosHtml.contenedorBingo) {
      th.classList.add(ascBingo ? 'desc' : 'asc')
      thBingo = th
      if (campo === 'cuotas-pagas') {
        datosBingo.sort((a, b): number => {
          const deudaA = calcularDeuda(a)
          const deudaB = calcularDeuda(b)

          return ascBingo ? deudaB - deudaA : deudaA - deudaB
        })

        ascBingo = !ascBingo
        renderTablaBingo(datosBingo, true)
        return
      }

      const campoId: keyof Bingo = th.getAttribute('data-campo') as keyof Bingo

      if (!campoId) return

      datosBingo.sort((a, b): number => {
        const valA: string | number | boolean | Date | Cuotas[] | number[] =
          a[campoId]
        const valB: string | number | boolean | Date | Cuotas[] | number[] =
          b[campoId]

        // números
        if (typeof valA === 'number' && typeof valB === 'number') {
          return ascBingo ? valA - valB : valB - valA
        }

        // fechas
        if (campoId.includes('fecha') || campoId.includes('mes')) {
          return ascBingo
            ? new Date(valA as string).getTime() -
                new Date(valB as string).getTime()
            : new Date(valB as string).getTime() -
                new Date(valA as string).getTime()
        }

        // strings
        return ascBingo
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA))
      })

      ascBingo = !ascBingo

      renderTablaBingo(datosBingo, true)
    } else if (pantallaActual === elementosHtml.contenedorHistorial) {
      th.classList.add(ascHistorial ? 'desc' : 'asc')
      thHistorial = th
      const campoId: keyof Historial = th.getAttribute(
        'data-campo',
      ) as keyof Historial

      if (!campoId) return

      datosHistorial.sort((a, b): number => {
        const valA: string | number | JSON | null = a[campoId]
        const valB: string | number | JSON | null = b[campoId]

        // números
        if (typeof valA === 'number' && typeof valB === 'number') {
          return ascHistorial ? valA - valB : valB - valA
        }

        // fechas
        if (campoId.includes('fecha') || campoId.includes('mes')) {
          return ascHistorial
            ? new Date(valA as string).getTime() -
                new Date(valB as string).getTime()
            : new Date(valB as string).getTime() -
                new Date(valA as string).getTime()
        }

        // strings
        return ascHistorial
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA))
      })

      ascHistorial = !ascHistorial

      renderTablaHistorial(datosHistorial, true)
    } else if (pantallaActual === elementosHtml.contenedorUsuarios) {
      th.classList.add(ascUsuarios ? 'desc' : 'asc')
      thUsuarios = th
      const campoId: keyof Login = th.getAttribute('data-campo') as keyof Login

      if (!campoId) return

      datosUsuarios.sort((a, b): number => {
        const valA: string | number | boolean | Date = a[campoId]
        const valB: string | number | boolean | Date = b[campoId]

        // números
        if (typeof valA === 'number' && typeof valB === 'number') {
          return ascUsuarios ? valA - valB : valB - valA
        }

        // fechas
        if (campoId.includes('fecha') || campoId.includes('mes')) {
          return ascUsuarios
            ? new Date(valA as string).getTime() -
                new Date(valB as string).getTime()
            : new Date(valB as string).getTime() -
                new Date(valA as string).getTime()
        }

        // strings
        return ascUsuarios
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA))
      })

      ascUsuarios = !ascUsuarios

      renderTablaUsuarios(datosUsuarios, true)
    }
  })
})

elementosHtml.buscadorBingo.addEventListener('input', (): void => {
  clearTimeout(timeoutBingo)
  timeoutBingo = setTimeout((): void => {
    const texto: string = elementosHtml.buscadorBingo.value.toLowerCase()

    const filtrados: Bingo[] = datosBingo.filter((item): boolean =>
      Object.values(item).some((valor): boolean =>
        String(valor).toLowerCase().includes(texto),
      ),
    )

    renderTablaBingo(filtrados)
  }, 300)
})

elementosHtml.buscadorHistorial.addEventListener('input', (): void => {
  clearTimeout(timeoutHistorial)
  timeoutHistorial = setTimeout((): void => {
    const texto: string = elementosHtml.buscadorHistorial.value.toLowerCase()

    const filtrados: Historial[] = datosHistorial.filter((item): boolean =>
      Object.values(item).some((valor): boolean =>
        String(valor).toLowerCase().includes(texto),
      ),
    )

    renderTablaHistorial(filtrados)
  }, 300)
})

elementosHtml.buscadorUsuarios.addEventListener('input', (): void => {
  clearTimeout(timeoutUsuarios)
  timeoutUsuarios = setTimeout((): void => {
    const texto: string = elementosHtml.buscadorUsuarios.value.toLowerCase()

    const filtrados: Login[] = datosUsuarios.filter((item): boolean =>
      Object.values(item).some((valor): boolean =>
        String(valor).toLowerCase().includes(texto),
      ),
    )

    renderTablaUsuarios(filtrados)
  }, 300)
})

function inputsFormRequired(required: boolean): void {
  elementosHtml.numeroBingoInput.required = required
  elementosHtml.nombreInput.required = required
  elementosHtml.apellidoInput.required = required
  elementosHtml.domicilioInput.required = required
  elementosHtml.barrioInput.required = required
  elementosHtml.lugarDeCobroInput.required = required
  elementosHtml.mesInicioInput.required = required
  elementosHtml.fechaDeCobroInput.required = required
  elementosHtml.localidadInput.required = required
  elementosHtml.telefonoInput.required = required
}

function inputsFormUsuariosRequired(required: boolean): void {
  elementosHtml.inputAddName.required = required
  if (!elementoOculto(elementosHtml.contenedorPasswordUsuario))
    elementosHtml.inputAddPassword.required = required
  elementosHtml.inputAddUser.required = required
}

elementosHtml.btnMostrarPassword.addEventListener('click', (e): void => {
  e.preventDefault()
  if (elementosHtml.inputPassword.type === 'password') {
    elementosHtml.inputPassword.type = 'text'
    elementosHtml.contenedorInputPasswordLogin.classList.add('mostrar')
  } else {
    elementosHtml.inputPassword.type = 'password'
    elementosHtml.contenedorInputPasswordLogin.classList.remove('mostrar')
  }
})

elementosHtml.btnMostrarPasswordAddUser.addEventListener('click', (e): void => {
  e.preventDefault()
  if (elementosHtml.inputAddPassword.type === 'password') {
    elementosHtml.inputAddPassword.type = 'text'
    elementosHtml.contenedorPasswordUsuario.classList.add('mostrar')
  } else {
    elementosHtml.inputAddPassword.type = 'password'
    elementosHtml.contenedorPasswordUsuario.classList.remove('mostrar')
  }
})

elementosHtml.btnConfigurarAvisos.addEventListener('click', (e): void => {
  e.preventDefault()
  mostrarContenedorFormConfigAvisos()
})

elementosHtml.btnConfigurarAvisosAceptar.addEventListener(
  'click',
  (e): void => {
    e.preventDefault()
    const arrValAnt: number[] = [arrConfigAvisos[0], arrConfigAvisos[1]]
    switch (elementosHtml.selectAvisosMeses.value) {
      case '0':
        arrConfigAvisos[0] = 1
        break
      case '1':
        arrConfigAvisos[0] = parseInt(
          elementosHtml.inputSelectConfigAvisosPersonalizadoXMes.value,
        )
        break
      case '2':
        arrConfigAvisos[0] = 0
        arrConfigAvisos[1] = 0
        break
    }
    if (arrConfigAvisos[0] !== 0) {
      switch (elementosHtml.selectAvisosDia.value) {
        case '0':
          arrConfigAvisos[1] = 1
          break
        case '1':
        case '2':
        case '3':
          arrConfigAvisos[1] =
            parseInt(elementosHtml.selectAvisosDia.value) + 30
          break
        case '4':
          arrConfigAvisos[1] = parseInt(
            elementosHtml.inputSelectConfigAvisosPersonalizadoDia.value,
          )
          break
      }
    }
    if (
      arrConfigAvisos[0] < 0 ||
      arrConfigAvisos[0] > 12 ||
      arrConfigAvisos[1] < 0 ||
      arrConfigAvisos[1] > 33
    ) {
      mostrarAvisoError('Ingrese valores validos')
      arrConfigAvisos[0] = arrValAnt[0]
      arrConfigAvisos[1] = arrValAnt[1]
      return
    }
    esconderContenedorFormConfigAvisos()
  },
)

elementosHtml.btnConfigurarAvisosCancelar.addEventListener(
  'click',
  (e): void => {
    e.preventDefault()
    esconderContenedorFormConfigAvisos()
  },
)

elementosHtml.selectAvisosMeses.addEventListener('change', (e): void => {
  e.preventDefault()
  switch (elementosHtml.selectAvisosMeses.value) {
    case '0':
      mostrarElemento(
        elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoXMes,
        false,
      )
      mostrarElemento(elementosHtml.contenedorSelectAvisosDia)
      mostrarElemento(
        elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoDia,
        elementosHtml.selectAvisosDia.value === '4',
      )
      break
    case '1':
      mostrarElemento(
        elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoXMes,
      )
      mostrarElemento(elementosHtml.contenedorSelectAvisosDia)
      mostrarElemento(
        elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoDia,
        elementosHtml.selectAvisosDia.value === '4',
      )
      break
    case '2':
      mostrarElemento(
        elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoXMes,
        false,
      )
      mostrarElemento(elementosHtml.contenedorSelectAvisosDia, false)
      mostrarElemento(
        elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoDia,
        false,
      )
      break
  }
})

elementosHtml.selectAvisosDia.addEventListener('change', (e): void => {
  e.preventDefault()
  mostrarElemento(
    elementosHtml.contenedorInputSelectConfigAvisosPersonalizadoDia,
    elementosHtml.selectAvisosDia.value === '4',
  )
})

export { mostrarContenedorForm, mostrarContenedorFormUsuario }
