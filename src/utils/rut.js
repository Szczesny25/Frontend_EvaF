/* ============================================================
   rut.js — Validación de RUT chileno
   Formato esperado: 12.345.678-9  o  12345678-9
   ============================================================ */

/**
 * Formatea un RUT limpio (solo dígitos + k) al formato con puntos y guión
 * Ejemplo: "123456789" → "12.345.678-9"
 */
export function formatRut(raw) {
  // Elimina todo lo que no sea dígito o k/K
  const clean = raw.replace(/[^0-9kK]/g, '').toUpperCase()
  if (clean.length < 2) return clean

  const dv   = clean.slice(-1)
  const body = clean.slice(0, -1)

  // Agrega puntos cada 3 dígitos (de derecha a izquierda)
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formatted}-${dv}`
}

/**
 * Calcula el dígito verificador de un RUT
 */
function calcDV(rut) {
  let sum    = 0
  let factor = 2
  for (let i = rut.length - 1; i >= 0; i--) {
    sum += parseInt(rut[i]) * factor
    factor = factor === 7 ? 2 : factor + 1
  }
  const rest = 11 - (sum % 11)
  if (rest === 11) return '0'
  if (rest === 10) return 'K'
  return String(rest)
}

/**
 * Valida el formato Y el dígito verificador de un RUT
 * Retorna { valid: bool, error: string | null }
 */
export function validateRut(value) {
  if (!value || value.trim() === '') {
    return { valid: false, error: 'El RUT es obligatorio.' }
  }

  // Acepta con o sin puntos, con guión
  const clean = value.replace(/\./g, '').trim()

  // Debe tener guión
  if (!clean.includes('-')) {
    return { valid: false, error: 'El RUT debe tener guión (ej: 12.345.678-9).' }
  }

  const parts = clean.split('-')
  if (parts.length !== 2) {
    return { valid: false, error: 'Formato de RUT incorrecto.' }
  }

  const [body, dv] = parts

  // Cuerpo debe ser numérico
  if (!/^\d+$/.test(body)) {
    return { valid: false, error: 'El cuerpo del RUT debe contener solo números.' }
  }

  // Longitud razonable
  if (body.length < 7 || body.length > 8) {
    return { valid: false, error: 'El RUT debe tener entre 7 y 8 dígitos antes del guión.' }
  }

  // DV debe ser dígito o K
  if (!/^[0-9K]$/i.test(dv)) {
    return { valid: false, error: 'El dígito verificador debe ser un número o la letra K.' }
  }

  // Verificar dígito
  const expected = calcDV(body)
  if (dv.toUpperCase() !== expected) {
    return { valid: false, error: `RUT inválido: el dígito verificador no es correcto (esperado: ${expected}).` }
  }

  return { valid: true, error: null }
}
