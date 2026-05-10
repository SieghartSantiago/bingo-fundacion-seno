import * as elementosHtml from './elements.ts'

export function setSelectCuotas(arrOptions: number[], reset: boolean = false): void {
  if (reset) arrOptions = [0,0,0,0,0,0,0,0]

  arrOptions.forEach((option: number, index: number): void => {
    elementosHtml.arrSelectCuotas[index].selectedIndex = option
  })
}

export function checkChecks(
  indexCheck: number,
  check: boolean,
  reset: boolean = false,
): void {
  if (reset)
    elementosHtml.arrChecksCuotas.forEach((check): void => {
      check.checked = false
      setSelectCuotas([], true)
    })

  elementosHtml.arrChecksCuotas[indexCheck].checked = check
  if (check) {
    if (indexCheck === 0) return

    checkChecks(indexCheck - 1, true)
  } else {
    if (indexCheck === elementosHtml.arrChecksCuotas.length - 1) return

    checkChecks(indexCheck + 1, false)
  }
}

elementosHtml.arrChecksCuotas.forEach(
  (check: HTMLInputElement, index: number) => {
    check.addEventListener('input', (e) => {
      e.preventDefault()
      checkChecks(index, check.checked)
    })
  },
)

export function cantCuotasPagas(): number {
  return elementosHtml.arrChecksCuotas.filter((cb) => cb.checked).length
}
