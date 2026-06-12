/* ============================================================
   api.js — Consumo de endpoints de Mercado Público
   Ticket de acceso: AC3A098B-4CD0-41AF-81A5-41284248419B
   ============================================================ */

const TICKET  = 'AC3A098B-4CD0-41AF-81A5-41284248419B'
const BASE_LIC = 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json'
const BASE_PROV = 'https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor'

// -----------------------------------------------------------
// Helper: decodifica caracteres especiales y tildes
// -----------------------------------------------------------
export function fixEncoding(str) {
  if (!str || typeof str !== 'string') return str
  try {
    return decodeURIComponent(escape(str))
  } catch {
    return str
  }
}

// -----------------------------------------------------------
// Helper: normaliza texto de objetos JSON recursivamente
// -----------------------------------------------------------
export function normalizeJson(obj) {
  if (typeof obj === 'string') return fixEncoding(obj)
  if (Array.isArray(obj))     return obj.map(normalizeJson)
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, normalizeJson(v)])
    )
  }
  return obj
}

// -----------------------------------------------------------
// Helper: formatea fecha a ddmmyyyy para la API
// -----------------------------------------------------------
export function formatFechaAPI(dateStr) {
  // dateStr viene del input date: "YYYY-MM-DD"
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}${m}${y}`
}

// -----------------------------------------------------------
// 1. Listado de licitaciones
//    GET /licitaciones.json?fecha=ddmmaaaa&estado=name&ticket=...
// -----------------------------------------------------------
export async function fetchLicitaciones({ fecha, estado }) {
  const params = new URLSearchParams({ ticket: TICKET })
  if (fecha)  params.set('fecha',  formatFechaAPI(fecha))
  if (estado) params.set('estado', estado)

  const res = await fetch(`${BASE_LIC}?${params}`)

  if (!res.ok) {
    if (res.status === 404) throw new Error('No se encontraron licitaciones para los filtros ingresados.')
    if (res.status === 401) throw new Error('Sin permisos para acceder a la API. Verifica el ticket.')
    if (res.status >= 500)  throw new Error('El servidor de Mercado Público no está disponible. Intenta más tarde.')
    throw new Error(`Error del servidor (${res.status}). Intenta más tarde.`)
  }

  const data = await res.json()
  return normalizeJson(data)
}

// -----------------------------------------------------------
// 2. Detalle de licitación
//    GET /licitaciones.json?codigo=xxxx&ticket=...
// -----------------------------------------------------------
export async function fetchDetalleLicitacion(codigo) {
  if (!codigo) throw new Error('Código de licitación no proporcionado.')

  const params = new URLSearchParams({ codigo, ticket: TICKET })
  const res = await fetch(`${BASE_LIC}?${params}`)

  if (!res.ok) {
    if (res.status === 404) throw new Error('Licitación no encontrada.')
    if (res.status >= 500)  throw new Error('El servidor de Mercado Público no está disponible. Intenta más tarde.')
    throw new Error(`Error del servidor (${res.status}). Intenta más tarde.`)
  }

  const data = await res.json()
  const normalized = normalizeJson(data)

  // La API retorna Listado[0] para el detalle
  if (!normalized?.Listado?.length) {
    throw new Error('No se encontró información para esta licitación.')
  }

  return normalized.Listado[0]
}

// -----------------------------------------------------------
// 3. Búsqueda de proveedor por RUT
//    GET /BuscarProveedor?rutempresaproveedor=xx.xxx.xxx-x&ticket=...
// -----------------------------------------------------------
export async function fetchProveedor(rut) {
  if (!rut) throw new Error('RUT no proporcionado.')

  const params = new URLSearchParams({ rutempresaproveedor: rut, ticket: TICKET })
  const res = await fetch(`${BASE_PROV}?${params}`)

  if (!res.ok) {
    if (res.status === 404) throw new Error('Proveedor no encontrado.')
    if (res.status >= 500)  throw new Error('El servidor de Mercado Público no está disponible. Intenta más tarde.')
    throw new Error(`Error del servidor (${res.status}). Intenta más tarde.`)
  }

  const data = await res.json()
  const normalized = normalizeJson(data)

  if (!normalized?.listaEmpresas?.length) {
    return null // Proveedor no encontrado (respuesta vacía válida)
  }

  return normalized.listaEmpresas[0]
}

// -----------------------------------------------------------
// Helpers de UI
// -----------------------------------------------------------

// Mapea CodigoEstado (número) a texto y clase de badge
export function getEstadoInfo(estado) {
  const map = {
    5:  { label: 'Activa',      cls: 'badge-active'  },
    6:  { label: 'Adjudicada', cls: 'badge-awarded' },
    7:  { label: 'Desierta',   cls: 'badge-default' },
    8:  { label: 'Revocada',   cls: 'badge-revoked' },
    9:  { label: 'Suspendida', cls: 'badge-revoked' },
    18: { label: 'Publicada',  cls: 'badge-active'  },
  }
  return map[estado] || { label: 'Otro', cls: 'badge-default' }
}

// Formatea fecha ISO a legible en español
export function formatFecha(isoStr) {
  if (!isoStr) return '--'
  try {
    return new Intl.DateTimeFormat('es-CL', {
      day:   '2-digit',
      month: 'long',
      year:  'numeric',
    }).format(new Date(isoStr))
  } catch {
    return isoStr
  }
}
