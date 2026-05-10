import type { Bingo } from '../types/Bingo'

import { io } from '../app'
import { pool } from '../db'
import { Router } from 'express'
import { schemaBingo } from '../types/schema.bingo'
import { addHistorial } from './historial'
import auth, { AuthRequest } from '../middleware/auth'
import { Cuotas } from '../types/Cuotas'

const router = Router()

router.post('/bingo', auth, async (req: AuthRequest, res) => {
  const parsed = schemaBingo.safeParse(req.body)

  console.log(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: parsed.error.message,
    })
  }

  const {
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
  } = req.body

  let strQueryCuotas: string = ''

  arrOptionsCuotas.forEach((_: number, index: number) => {
    if (index > 0) strQueryCuotas += ','
    strQueryCuotas += `(${index + 1},$${index + 14}::integer)`
  })

  console.log(strQueryCuotas)
  console.log(typeof arrOptionsCuotas[0])

  const fechaMesInicio = new Date(mesInicio)
  fechaMesInicio.setDate(1)

  const stringFechaMesInicio = `${fechaMesInicio.getFullYear()}-${String(fechaMesInicio.getMonth() + 2).padStart(2, '0')}-${String(fechaMesInicio.getDate()).padStart(2, '0')}`

  console.log([
    numeroBingo,
    nombre,
    apellido,
    domicilio,
    barrio,
    localidad,
    telefono,
    lugarDeCobro,
    stringFechaMesInicio,
    fechaDeCobro,
    deshabilitado,
    arrConfigAvisos,
    ...arrOptionsCuotas,
  ])
  try {
    const result = await pool.query(
      `
      WITH nuevo_bingo AS (
        INSERT INTO bingo (numero_bingo, nombre, apellido, domicilio, barrio, localidad, telefono, lugar_cobro, mes_inicio, fecha_cobro, deshabilitado)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING id
      ),
      insert_cuotas AS (
      INSERT INTO cuotas (bingo_id, num_cuota, medio_pago)
      SELECT 
        nb.id,
        c.num_cuota,
        c.medio_pago
      FROM nuevo_bingo nb
      JOIN (
        VALUES 
          ${strQueryCuotas}
      ) AS c(num_cuota, medio_pago)
      ON true),
      insert_avisos AS (
      INSERT INTO avisos (bingo_id, config_meses, config_dia)
      SELECT
        nb.id,
        av.config_meses,
        av.config_dia
      FROM nuevo_bingo nb
      CROSS JOIN (
        VALUES
          ($12::integer, $13::integer)
      ) AS av(config_meses, config_dia)
      RETURNING id
      )
      SELECT id FROM nuevo_bingo;
      `,
      [
        numeroBingo,
        nombre,
        apellido,
        domicilio,
        barrio,
        localidad,
        telefono,
        lugarDeCobro,
        stringFechaMesInicio,
        fechaDeCobro,
        deshabilitado,
        arrConfigAvisos[0],
        arrConfigAvisos[1],
        ...arrOptionsCuotas,
      ],
    )

    io.emit('actualizar-tabla')
    res.json({ ok: true, id: result.rows[0].id })
    const id = result.rows[0].id
    const usuarioId = req.user!.id
    await addHistorial(
      'bingo',
      id,
      'INSERT',
      null,
      {
        numeroBingo,
        nombre,
        apellido,
        domicilio,
        barrio,
        localidad,
        telefono,
        lugarDeCobro,
        mesInicio: stringFechaMesInicio,
        fechaDeCobro,
        deshabilitado,
      },
      usuarioId,
    )
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/bingo/cambio', auth, async (req: AuthRequest, res) => {
  const parsed = schemaBingo.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: parsed.error.message,
    })
  }

  const {
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
    deshabilitado,
    arrConfigAvisos,
    arrOptionsCuotas,
  } = req.body

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const currentResult = await client.query(
      `
      SELECT * FROM bingo WHERE numero_bingo = $1
      `,
      [numeroBingoCambiando],
    )

    if (currentResult.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Registro no encontrado' })
    }

    const actual: Bingo = currentResult.rows[0]
    const bingoId = actual.id

    console.log(actual)

    const fecha = new Date(mesInicio)
    fecha.setDate(1)

    const stringFechaMesInicioActual = `${actual.mes_inicio.getFullYear()}-${String(actual.mes_inicio.getMonth() + 1).padStart(2, '0')}-${String(actual.mes_inicio.getDate()).padStart(2, '0')}`

    const mesInicioNuevoStr = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1,
    ).padStart(2, '0')}-01`

    const nuevo: Partial<Bingo> = {
      numero_bingo: numeroBingo,
      nombre,
      apellido,
      domicilio,
      barrio,
      localidad,
      telefono,
      lugar_cobro: lugarDeCobro,
      fecha_cobro: fechaDeCobro,
      deshabilitado,
    }

    const cambios: Partial<Bingo> = {}
    const anteriores: Partial<Bingo> = {}

    for (const key in nuevo) {
      const k = key as keyof typeof nuevo

      if (k === 'mes_inicio') {
        if (mesInicioNuevoStr !== stringFechaMesInicioActual) {
          ;(cambios as any)[k] = nuevo[k]
          ;(anteriores as any)[k] = actual[k]
        }
        continue
      }

      if (nuevo[k] !== actual[k]) {
        ;(cambios as any)[k] = nuevo[k]
        ;(anteriores as any)[k] = actual[k]
      }
    }

    if (Object.keys(cambios).length > 0) {
      const setQuery = Object.keys(cambios)
        .map((k, i) => `${k} = $${i + 1}`)
        .join(', ')

      const values = Object.values(cambios)
      values.push(numeroBingoCambiando)

      const update = await client.query(
        `
        UPDATE bingo
        SET ${setQuery}
        WHERE numero_bingo = $${values.length}
        RETURNING id
        `,
        values,
      )

      console.log('Bingo actualizado:', update.rows[0].id)
    }

    const cuotasNumericas: number[] = arrOptionsCuotas.map((v: any) =>
      Number(v),
    )

    const resCuotas = await client.query(
      `
      SELECT * FROM cuotas WHERE bingo_id = $1
      `,
      [bingoId],
    )

    const cuotasNumericasActuales: number[] = resCuotas.rows.map(
      (cuota: Cuotas) => Number(cuota.medio_pago),
    )

    const lengthArrs =
      cuotasNumericas.length >= cuotasNumericasActuales.length
        ? cuotasNumericas.length
        : cuotasNumericasActuales.length

    if (cuotasNumericas.length !== cuotasNumericasActuales.length) {
      cambios.cuotas_arr = cuotasNumericas
      anteriores.cuotas_arr = cuotasNumericasActuales
    }

    let strQueryCuotasCambio: string = ''
    let strQueryCuotasAgregar: string = ''

    for (let i = 0; i < lengthArrs; i++) {
      if (i >= cuotasNumericas.length) {
        await client.query(
          `
          DELETE FROM cuotas
          WHERE bingo_id = $1
          AND num_cuota > $2`,
          [bingoId, i],
        )
        break
      }

      if (i >= cuotasNumericasActuales.length) {
        strQueryCuotasAgregar += `($1,${i + 1},${cuotasNumericas[i]}),`
        continue
      }

      if (cuotasNumericas[i] !== cuotasNumericasActuales[i]) {
        if (!cambios.cuotas_arr) {
          cambios.cuotas_arr = cuotasNumericas
          anteriores.cuotas_arr = cuotasNumericasActuales
        }
        strQueryCuotasCambio += `(${i + 1},${cuotasNumericas[i]}),`
      }
    }

    if (strQueryCuotasAgregar.length > 0) {
      strQueryCuotasAgregar = strQueryCuotasAgregar.slice(0, -1)
      await client.query(
        `
        INSERT INTO cuotas (bingo_id, num_cuota, medio_pago)
        VALUES ${strQueryCuotasAgregar}
          `,
        [bingoId],
      )
    }

    if (strQueryCuotasCambio.length > 0) {
      strQueryCuotasCambio = strQueryCuotasCambio.slice(0, -1)
      await client.query(
        `
        UPDATE cuotas c
        SET medio_pago = v.medio_pago
        FROM (
          VALUES
          ${strQueryCuotasCambio}
          ) AS v(num_cuota, medio_pago)
          WHERE c.bingo_id = $1
          AND c.num_cuota = v.num_cuota
          `,
        [bingoId],
      )
    }

    const resAvisos = await client.query(
      `SELECT * FROM avisos WHERE bingo_id = $1`,
      [bingoId],
    )

    const arrConfigAvisoAnterior: number[] = [
      resAvisos.rows[0].config_meses,
      resAvisos.rows[0].config_dia,
    ]
    const arrConfigAvisoCambios: number[] = []

    let strQueryAvisos: string = ''

    for (let i = 0; i < arrConfigAvisos.length; i++) {
      if (arrConfigAvisoAnterior[i] !== arrConfigAvisos[i]) {
        arrConfigAvisoCambios.push(arrConfigAvisos[i])
        if (strQueryAvisos.length > 0) strQueryAvisos.concat(',')
        if (i === 0) {
          anteriores.config_meses = arrConfigAvisoAnterior[i]
          cambios.config_meses = arrConfigAvisos[i]
          strQueryAvisos.concat('config_meses = $2')
        } else {
          anteriores.config_dia = arrConfigAvisoAnterior[i]
          cambios.config_dia = arrConfigAvisos[i]
          strQueryAvisos.concat(
            `config_dia = $${strQueryAvisos.length === 0 ? '2' : '3'}`,
          )
        }
      }
    }

    if (arrConfigAvisoCambios.length > 0) {
      await client.query(
        `
        UPDATE avisos 
        SET ${strQueryAvisos}
        WHERE bingo_id = $1
        `,
        [bingoId, ...arrConfigAvisoCambios],
      )
    }

    await client.query('COMMIT')

    if (Object.keys(cambios).length === 0) {
      res.json({ ok: true, message: 'Sin cambios' })
    } else {
      io.emit('actualizar-tabla')

      res.json({ ok: true, id: bingoId })

      const usuarioId = req.user!.id

      console.log(anteriores)
      console.log(cambios)

      await addHistorial(
        'bingo',
        bingoId,
        'UPDATE',
        anteriores,
        cambios,
        usuarioId,
      )
    }
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: (err as Error).message })
  } finally {
    client.release()
  }
})

router.post('/bingo/num-bingo', auth, async (req, res) => {
  try {
    const { numBingo } = req.body

    const result = await pool.query(
      `SELECT * FROM bingo WHERE numero_bingo = $1`,
      [numBingo],
    )

    const data = result.rows
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo datos' })
  }
})

export default router
