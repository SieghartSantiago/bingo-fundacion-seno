export const inputAddName: HTMLInputElement = document.getElementById(
  'input-submit-name',
) as HTMLInputElement
export const inputAddUser: HTMLInputElement = document.getElementById(
  'input-submit-user',
) as HTMLInputElement
export const inputAddPassword: HTMLInputElement = document.getElementById(
  'input-submit-password',
) as HTMLInputElement
export const inputUsername: HTMLInputElement = document.getElementById(
  'user',
) as HTMLInputElement
export const inputPassword: HTMLInputElement = document.getElementById(
  'pass',
) as HTMLInputElement
export const numeroBingoInput: HTMLInputElement = document.getElementById(
  'numero-bingo-input',
) as HTMLInputElement
export const lugarDeCobroInput: HTMLInputElement = document.getElementById(
  'lugar-de-cobro',
) as HTMLInputElement
export const fechaDeCobroInput: HTMLInputElement = document.getElementById(
  'fecha-de-cobro',
) as HTMLInputElement
export const checkDeshabilitado: HTMLInputElement = document.getElementById(
  'check-deshabilitado',
) as HTMLInputElement
export const checkDeshabilitadoUsuario: HTMLInputElement =
  document.getElementById('check-deshabilitado-usuario') as HTMLInputElement
export const nombreInput: HTMLInputElement = document.getElementById(
  'nombre',
) as HTMLInputElement
export const barrioInput: HTMLInputElement = document.getElementById(
  'barrio',
) as HTMLInputElement
export const apellidoInput: HTMLInputElement = document.getElementById(
  'apellido',
) as HTMLInputElement
export const localidadInput: HTMLInputElement = document.getElementById(
  'localidad',
) as HTMLInputElement
export const domicilioInput: HTMLInputElement = document.getElementById(
  'domicilio',
) as HTMLInputElement
export const mesInicioInput: HTMLInputElement = document.getElementById(
  'mes-inicio',
) as HTMLInputElement
export const telefonoInput: HTMLInputElement = document.getElementById(
  'telefono',
) as HTMLInputElement
export const buscadorHistorial: HTMLInputElement = document.getElementById(
  'buscador-historial',
) as HTMLInputElement
export const checkOcultarCancelados: HTMLInputElement = document.getElementById(
  'ocultar-cancelados',
) as HTMLInputElement
export const buscadorUsuarios: HTMLInputElement = document.getElementById(
  'buscador-usuarios',
) as HTMLInputElement
export const inputAdmin: HTMLInputElement = document.getElementById(
  'checkbox-admin',
) as HTMLInputElement

export const btnHistorial: HTMLButtonElement = document.getElementById(
  'btn-historial',
) as HTMLButtonElement
export const btnSubmitUser: HTMLButtonElement = document.getElementById(
  'btn-submit-user',
) as HTMLButtonElement
export const btnSubmitBingo: HTMLInputElement = document.getElementById(
  'btn-submit-bingo',
) as HTMLInputElement
export const btnLimpiarForm: HTMLButtonElement = document.getElementById(
  'btn-limpiar-form',
) as HTMLButtonElement
export const btnLimpiarFormUsuario: HTMLButtonElement = document.getElementById(
  'btn-limpiar-form-usuarios',
) as HTMLButtonElement
export const btnAvisoBorradoNo: HTMLButtonElement = document.getElementById(
  'btn-aviso-borrado-no',
) as HTMLButtonElement
export const btnAvisoBorradoUsuarioNo: HTMLButtonElement =
  document.getElementById('btn-aviso-borrado-usuario-no') as HTMLButtonElement
export const btnAvisoBorradoSi: HTMLButtonElement = document.getElementById(
  'btn-aviso-borrado-si',
) as HTMLButtonElement
export const btnAvisoBorradoUsuarioSi: HTMLButtonElement =
  document.getElementById('btn-aviso-borrado-usuario-si') as HTMLButtonElement
export const btnUsuarios: HTMLButtonElement = document.getElementById(
  'btn-usuarios',
) as HTMLButtonElement
export const btnLogin: HTMLInputElement = document.getElementById(
  'btn-login',
) as HTMLInputElement
export const btnCerrarForm: HTMLButtonElement = document.getElementById(
  'btn-cerrar-form',
) as HTMLButtonElement
export const btnCerrarAddLogin: HTMLButtonElement = document.getElementById(
  'btn-cerrar-login',
) as HTMLButtonElement
export const btnAdd: HTMLButtonElement = document.getElementById(
  'btn-add',
) as HTMLButtonElement
export const btnHome: HTMLButtonElement = document.getElementById(
  'btn-home',
) as HTMLButtonElement
export const btnAddUsuario = document.getElementById(
  'btn-add-usuario',
) as HTMLButtonElement
export const btnCerrarSesion: HTMLButtonElement = document.getElementById(
  'btn-cerrar-sesion',
) as HTMLButtonElement
export const btnMostrarPassword: HTMLButtonElement = document.getElementById(
  'btn-mostrar-password',
) as HTMLButtonElement
export const btnMostrarPasswordAddUser: HTMLButtonElement =
  document.getElementById('btn-mostrar-password-add-user') as HTMLButtonElement

export const arrBtnHeader: HTMLButtonElement[] = [btnHome, btnHistorial]

export const contenedorBingo: HTMLDivElement = document.getElementById(
  'container-bingo',
) as HTMLDivElement
export const contenedorHistorial: HTMLDivElement = document.getElementById(
  'container-historial',
) as HTMLDivElement
export const contenedorUsuarios: HTMLDivElement = document.getElementById(
  'container-usuarios',
) as HTMLDivElement

export const arrPantallas: HTMLDivElement[] = [
  contenedorBingo,
  contenedorHistorial,
]

export const tbodyHistorial: HTMLElement = document.getElementById(
  'tabla-body-historial',
) as HTMLElement
export const tbodyBingo: HTMLElement = document.getElementById(
  'tabla-body-bingo',
) as HTMLElement
export const tbodyUsuarios: HTMLElement = document.getElementById(
  'tabla-body-usuarios',
) as HTMLElement

export const cantNumBingo: HTMLSpanElement = document.getElementById(
  'cant-num-bingo',
) as HTMLSpanElement
export const cantNumHistorial: HTMLSpanElement = document.getElementById(
  'cant-num-historial',
) as HTMLSpanElement
export const cantNumUsuarios: HTMLSpanElement = document.getElementById(
  'cant-num-usuarios',
) as HTMLSpanElement

export const modalFormLogin: HTMLElement = document.getElementById(
  'modal-form-login',
) as HTMLElement
export const modalFormBingo: HTMLElement = document.getElementById(
  'modal-form-bingo',
) as HTMLElement
export const modalFormAgregarUsuario: HTMLDivElement = document.getElementById(
  'modal-form-agregar-usuario',
) as HTMLDivElement

export const tablaBingo: HTMLTableElement = document.getElementById(
  'tabla-bingo',
) as HTMLTableElement
export const tablaHistorial: HTMLTableElement = document.getElementById(
  'tabla-historial',
) as HTMLTableElement
export const tablaUsuarios: HTMLTableElement = document.getElementById(
  'tabla-usuarios',
) as HTMLTableElement

export const arrTablasHtml: HTMLTableElement[] = [
  tablaBingo,
  tablaHistorial,
  tablaUsuarios,
]

export const formBingo: HTMLFormElement = document.getElementById(
  'form-bingo',
) as HTMLFormElement
export const formUsuarios: HTMLFormElement = document.getElementById(
  'form-usuarios',
) as HTMLFormElement

export const pantallaCargaForm: HTMLDivElement = document.getElementById(
  'pantalla-carga-form',
) as HTMLDivElement
export const pantallaCargaFormUsuarios: HTMLDivElement =
  document.getElementById('pantalla-carga-form-usuarios') as HTMLDivElement
export const pantallaCargaFormLogin: HTMLDivElement = document.getElementById(
  'pantalla-carga-form-login',
) as HTMLDivElement
export const actualizarDatosTxt: HTMLElement = document.getElementById(
  'actualizar-datos-txt',
) as HTMLElement
export const actualizarDatosUsuarioTxt: HTMLElement = document.getElementById(
  'actualizar-datos-usuario-txt',
) as HTMLElement
export const indicadorNumeroBorrandose: HTMLSpanElement =
  document.getElementById('indicador-numero-eliminando') as HTMLSpanElement
export const indicadorUsuarioBorrandose: HTMLSpanElement =
  document.getElementById('indicador-usuario-eliminando') as HTMLSpanElement
export const loginForm: HTMLFormElement = document.getElementById(
  'login',
) as HTMLFormElement
export const buscadorBingo: HTMLInputElement = document.getElementById(
  'buscador-bingo',
) as HTMLInputElement
export const avisoBorrado: HTMLElement = document.getElementById(
  'aviso-borrado',
) as HTMLElement
export const avisoBorradoUsuario: HTMLElement = document.getElementById(
  'aviso-borrado-usuario',
) as HTMLElement
export const avisoCambiosExito: HTMLElement = document.getElementById(
  'aviso-cambios-exito',
) as HTMLElement
export const avisoError: HTMLElement = document.getElementById(
  'aviso-error',
) as HTMLElement
export const txtAvisoError: HTMLElement = document.getElementById(
  'txt-aviso-error',
) as HTMLElement
export const contenedorInputAdmin: HTMLLabelElement = document.getElementById(
  'contenedor-checkbox-admin',
) as HTMLLabelElement

export const arrModals: HTMLElement[] = [
  modalFormAgregarUsuario,
  modalFormBingo,
]

export const contenedorLeyenda: HTMLTableElement = document.getElementById(
  'leyenda',
) as HTMLTableElement

export const cargaDiscreta: HTMLDivElement = document.getElementById(
  'aviso-carga-discreta',
) as HTMLDivElement
export const avisoNingunCambio: HTMLDivElement = document.getElementById(
  'aviso-ningun-cambio',
) as HTMLDivElement

export const pantallaCarga: HTMLElement = document.getElementById(
  'pantalla-carga',
) as HTMLElement

export const numeroBingoColumna: HTMLTableCellElement = document.getElementById(
  'numero-bingo',
) as HTMLTableCellElement
export const idHistorialColumna: HTMLTableCellElement = document.getElementById(
  'id-historial-columna',
) as HTMLTableCellElement
export const idUsuarioColumna: HTMLTableCellElement = document.getElementById(
  'id-usuario-columna',
) as HTMLTableCellElement

export const arrChecksCuotas: HTMLInputElement[] = Array(
  ...document.querySelectorAll<HTMLInputElement>('.check-cuotas'),
)

export const contenedorInputPasswordLogin: HTMLDivElement =
  document.getElementById('contenedor-input-password-login') as HTMLDivElement

export const selectCuota1: HTMLSelectElement = document.getElementById(
  'cuota-1',
) as HTMLSelectElement
export const selectCuota2: HTMLSelectElement = document.getElementById(
  'cuota-2',
) as HTMLSelectElement
export const selectCuota3: HTMLSelectElement = document.getElementById(
  'cuota-3',
) as HTMLSelectElement
export const selectCuota4: HTMLSelectElement = document.getElementById(
  'cuota-4',
) as HTMLSelectElement
export const selectCuota5: HTMLSelectElement = document.getElementById(
  'cuota-5',
) as HTMLSelectElement
export const selectCuota6: HTMLSelectElement = document.getElementById(
  'cuota-6',
) as HTMLSelectElement
export const selectCuota7: HTMLSelectElement = document.getElementById(
  'cuota-7',
) as HTMLSelectElement
export const selectCuota8: HTMLSelectElement = document.getElementById(
  'cuota-8',
) as HTMLSelectElement

export const arrSelectCuotas: HTMLSelectElement[] = [
  selectCuota1,
  selectCuota2,
  selectCuota3,
  selectCuota4,
  selectCuota5,
  selectCuota6,
  selectCuota7,
  selectCuota8,
]

export const contenedorAvisos: HTMLElement = document.getElementById(
  'contenedor-avisos',
) as HTMLElement
export const contenedorHeader: HTMLElement = document.getElementById(
  'contenedor-header',
) as HTMLElement

export const contenedorPasswordUsuario: HTMLDivElement =
  document.getElementById('contenedor-password-usuario') as HTMLDivElement

export const pantallaErrorConexion: HTMLElement = document.getElementById(
  'pantalla-error-conexion',
) as HTMLElement
export const pantallaErrorPermisos: HTMLElement = document.getElementById(
  'pantalla-error-permisos',
) as HTMLElement

export const btnConfigurarAvisos: HTMLButtonElement = document.getElementById(
  'btn-configurar-avisos',
) as HTMLButtonElement

export const modalFormBingoConfigAvisos: HTMLElement = document.getElementById(
  'modal-form-bingo-config-avisos',
) as HTMLElement
export const selectAvisosMeses: HTMLSelectElement = document.getElementById(
  'select-config-avisos-mes',
) as HTMLSelectElement
export const contenedorInputSelectConfigAvisosPersonalizadoXMes: HTMLLabelElement =
  document.getElementById(
    'contenedor-input-select-config-avisos-personalizado-x-meses',
  ) as HTMLLabelElement
export const inputSelectConfigAvisosPersonalizadoXMes: HTMLInputElement =
  document.getElementById(
    'input-select-config-avisos-personalizado-x-meses',
  ) as HTMLInputElement
export const selectAvisosDia: HTMLSelectElement = document.getElementById(
  'select-config-avisos-dia',
) as HTMLSelectElement
export const contenedorInputSelectConfigAvisosPersonalizadoDia: HTMLLabelElement =
  document.getElementById(
    'contenedor-input-select-config-avisos-personalizado-dia',
  ) as HTMLLabelElement
export const inputSelectConfigAvisosPersonalizadoDia: HTMLInputElement =
  document.getElementById(
    'input-select-config-avisos-personalizado-dia',
  ) as HTMLInputElement
export const btnConfigurarAvisosAceptar: HTMLButtonElement =
  document.getElementById('btn-configurar-avisos-aceptar') as HTMLButtonElement
export const btnConfigurarAvisosCancelar: HTMLButtonElement =
  document.getElementById('btn-configurar-avisos-cancelar') as HTMLButtonElement
export const contenedorSelectAvisosMes: HTMLDivElement =
  document.getElementById(
    'contenedor-select-config-avisos-mes',
  ) as HTMLDivElement
export const contenedorSelectAvisosDia: HTMLDivElement =
  document.getElementById(
    'contenedor-select-config-avisos-dia',
  ) as HTMLDivElement
