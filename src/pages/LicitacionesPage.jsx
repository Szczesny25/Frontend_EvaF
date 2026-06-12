import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchLicitaciones, getEstadoInfo, formatFecha } from '../utils/api'
import './LicitacionesPage.css'

const ESTADOS = [
  { value: '',           label: 'Todos los estados' },
  { value: 'activa',     label: 'Activa' },
  { value: 'adjudicada', label: 'Adjudicada' },
  { value: 'revocada',   label: 'Revocada' },
  { value: 'desierta',   label: 'Desierta' },
  { value: 'suspendida', label: 'Suspendida' },
  { value: 'publicada',  label: 'Publicada' },
]

const PAGE_SIZE = 10

// Fecha de hoy en formato YYYY-MM-DD (para el input date)
function today() {
  return new Date().toISOString().split('T')[0]
}

export default function LicitacionesPage() {
  const [fecha,    setFecha]    = useState(today())
  const [estado,   setEstado]   = useState('')
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [results,  setResults]  = useState(null)   // null = sin búsqueda aún
  const [apiError, setApiError] = useState(null)
  const [page,     setPage]     = useState(1)

  // ---- Validación ----
  function validate() {
    const errs = {}
    if (!fecha) errs.fecha = 'La fecha es obligatoria.'
    return errs
  }

  // ---- Submit ----
  const handleSearch = useCallback(async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    setApiError(null)
    setResults(null)
    setPage(1)

    try {
      const data = await fetchLicitaciones({ fecha, estado })
      setResults(data?.Listado ?? [])
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }, [fecha, estado])

  // ---- Paginación ----
  const totalPages = results ? Math.ceil(results.length / PAGE_SIZE) : 0
  const pageItems  = results ? results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : []

  function goPage(n) {
    setPage(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="lic-page">
      {/* ---- Page Header ---- */}
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Licitaciones Públicas</h1>
          <p className="page-hero__sub">
            Consulta y filtra todas las licitaciones disponibles en Mercado Público de Chile.
          </p>
        </div>
      </div>

      <div className="container lic-page__body">

        {/* ---- Search Form ---- */}
        <section className="search-box card" aria-labelledby="filtros-heading">
          <h2 id="filtros-heading" className="search-box__title">Filtrar licitaciones</h2>

          <form
            onSubmit={handleSearch}
            noValidate
            aria-label="Formulario de búsqueda de licitaciones"
          >
            <div className="search-box__fields">

              {/* Fecha */}
              <div className="form-group">
                <label htmlFor="fecha-input">
                  Fecha <span aria-hidden="true" style={{color:'var(--error)'}}>*</span>
                </label>
                <input
                  id="fecha-input"
                  type="date"
                  value={fecha}
                  onChange={e => { setFecha(e.target.value); setErrors(v => ({...v, fecha: null})) }}
                  className={errors.fecha ? 'error' : ''}
                  aria-required="true"
                  aria-invalid={!!errors.fecha}
                  aria-describedby={errors.fecha ? 'fecha-error' : undefined}
                  max={today()}
                />
                {errors.fecha && (
                  <span id="fecha-error" className="form-error" role="alert" aria-live="polite">
                    ⚠ {errors.fecha}
                  </span>
                )}
              </div>

              {/* Estado */}
              <div className="form-group">
                <label htmlFor="estado-select">Estado</label>
                <select
                  id="estado-select"
                  value={estado}
                  onChange={e => setEstado(e.target.value)}
                  aria-label="Filtrar por estado de licitación"
                >
                  {ESTADOS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary search-box__submit"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Buscando…' : '🔍 Buscar'}
              </button>
            </div>
          </form>
        </section>

        {/* ---- Loader ---- */}
        {loading && (
          <div className="loader-overlay" role="status" aria-live="polite" aria-label="Cargando licitaciones">
            <div className="spinner" aria-hidden="true" />
            <p>Consultando Mercado Público…</p>
          </div>
        )}

        {/* ---- Error de API ---- */}
        {apiError && !loading && (
          <div className="state-box" role="alert" aria-live="assertive">
            <div className="state-icon" aria-hidden="true">⚠️</div>
            <h3>No se pudo obtener la información</h3>
            <p>{apiError}</p>
            <button className="btn btn-outline" style={{marginTop:16}} onClick={() => setApiError(null)}>
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* ---- Sin resultados ---- */}
        {results?.length === 0 && !loading && (
          <div className="state-box" role="status">
            <div className="state-icon" aria-hidden="true">📭</div>
            <h3>Sin resultados</h3>
            <p>No hay licitaciones para los filtros seleccionados. Prueba con otra fecha o estado.</p>
          </div>
        )}

        {/* ---- Resultados ---- */}
        {results?.length > 0 && !loading && (
          <section aria-labelledby="resultados-heading">
            <header className="lic-results__header">
              <h2 id="resultados-heading" className="lic-results__count">
                {results.length} licitación{results.length !== 1 ? 'es' : ''} encontrada{results.length !== 1 ? 's' : ''}
              </h2>
              <p className="lic-results__info">Mostrando {pageItems.length} por página</p>
            </header>

            <ul className="lic-list" aria-label="Listado de licitaciones">
              {pageItems.map((lic) => {
                const { label, cls } = getEstadoInfo(lic.CodigoEstado)
                return (
                  <li key={lic.CodigoExterno} className="lic-card card">
                    <div className="lic-card__top">
                      <span className={`badge ${cls}`} aria-label={`Estado: ${label}`}>
                        {label}
                      </span>
                      <span className="lic-card__code" aria-label={`Código: ${lic.CodigoExterno}`}>
                        {lic.CodigoExterno}
                      </span>
                    </div>

                    <h3 className="lic-card__title">{lic.Nombre || 'Sin nombre'}</h3>

                    <div className="lic-card__meta">
                      <span aria-label={`Fecha de cierre: ${formatFecha(lic.FechaCierre)}`}>
                        📅 Cierre: {formatFecha(lic.FechaCierre)}
                      </span>
                    </div>

                    <Link
                      to={`/licitaciones/${encodeURIComponent(lic.CodigoExterno)}`}
                      className="btn btn-outline lic-card__btn"
                      aria-label={`Ver detalle de licitación ${lic.CodigoExterno}`}
                    >
                      Ver detalle →
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Paginación */}
            {totalPages > 1 && (
              <nav className="pagination" aria-label="Paginación de resultados" role="navigation">
                <button
                  onClick={() => goPage(page - 1)}
                  disabled={page === 1}
                  aria-label="Página anterior"
                  tabIndex={0}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                  .reduce((acc, n, idx, arr) => {
                    if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…')
                    acc.push(n)
                    return acc
                  }, [])
                  .map((n, idx) =>
                    n === '…' ? (
                      <span key={`ellipsis-${idx}`} style={{padding:'0 4px',color:'var(--gray-400)'}}>…</span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => goPage(n)}
                        className={page === n ? 'active' : ''}
                        aria-label={`Ir a página ${n}`}
                        aria-current={page === n ? 'page' : undefined}
                        tabIndex={0}
                      >
                        {n}
                      </button>
                    )
                  )
                }

                <button
                  onClick={() => goPage(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Página siguiente"
                  tabIndex={0}
                >
                  ›
                </button>
              </nav>
            )}
          </section>
        )}

        {/* ---- Estado inicial (sin búsqueda) ---- */}
        {results === null && !loading && !apiError && (
          <div className="state-box">
            <div className="state-icon" aria-hidden="true">🔍</div>
            <h3>Realiza tu primera búsqueda</h3>
            <p>Selecciona una fecha y opcionalmente un estado para consultar las licitaciones.</p>
          </div>
        )}

      </div>
    </div>
  )
}
