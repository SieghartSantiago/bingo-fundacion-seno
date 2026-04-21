const btnCerrarForm = document.getElementById(
    'btn-cerrar-form',
) as HTMLButtonElement
const contenedorForm = document.getElementById(
    'contenedor-form',
) as HTMLDivElement
const btnCerrarAddLogin = document.getElementById(
    'btn-cerrar-login',
) as HTMLButtonElement
const contenedorSubmitUser = document.getElementById(
    'contenedor-login-fondo',
) as HTMLDivElement
const btnAdd = document.getElementById('btn-add') as HTMLButtonElement
const btnAddUser = document.getElementById('btn-add-user') as HTMLButtonElement

let menuAddShow = false
let menuSubmitUserShow = false

btnAdd.addEventListener('click', (e) => {
  e.preventDefault()
  menuAddShow = true
  contenedorForm.classList.remove('escondido')
})

btnCerrarForm.addEventListener('click', (e) => {
  e.preventDefault()
  esconderForm()
})

export function esconderForm() {
  if (menuAddShow) {
    menuAddShow = false
    contenedorForm.classList.add('escondido')
  }
}

btnAddUser.addEventListener('click', (e) => {
  e.preventDefault()
  contenedorSubmitUser.classList.remove('oculto')
})

btnCerrarAddLogin.addEventListener('click', (e) => {
  e.preventDefault()
  contenedorSubmitUser.classList.add('oculto')
})

export function esconderSubmitUser() {
  if (menuSubmitUserShow) {
    menuSubmitUserShow = false
    contenedorSubmitUser.classList.add('oculto')
  }
}
