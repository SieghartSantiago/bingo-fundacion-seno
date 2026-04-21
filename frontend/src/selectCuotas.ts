const arrChecksCuotas = Array(
  ...document.querySelectorAll<HTMLInputElement>('.check-cuotas'),
)

function changeCheck(indexCheck: number, check: boolean): void {
  arrChecksCuotas[indexCheck].checked = check
  if (check) {
    if (indexCheck === 0) return

    changeCheck(indexCheck - 1, true)
  } else {
    if (indexCheck === arrChecksCuotas.length - 1) return

    changeCheck(indexCheck + 1, false)
  }
}

arrChecksCuotas.forEach((check, index) => {
  check.addEventListener('input', (e) => {
    e.preventDefault()
    changeCheck(index, check.checked)
  })
})

export function cantCuotasPagas(): number {
  return arrChecksCuotas.filter((cb) => cb.checked).length
}
