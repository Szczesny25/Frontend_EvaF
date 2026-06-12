import { useState, useCallback } from 'react'
import { fetchProveedor } from '../utils/api'
import { validateRut, formatRut } from '../utils/rut'
import './ProveedoresPage.css'

export default function ProveedoresPage() {
  const [rut,       setRut]       = useState('')
  const [rutError,  setRutError]  = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [proveedor, setProveedor] = useState(undefined) // undefined=sin búsqueda, null=no encontrado
  const [apiError,  setApiError]  = useState(null)

  // Maneja cambio del input formateando el RUT automáticamente
  function handleRutChange(e) {
    const raw = e.target.value
    const formatted = formatRut(raw)
    setRut(formatted)
    setRutError(null)
  }

  const handleSearch = useCallback(async (e) => {
    e.preventDefault()

    // Validar RUT
    const { valid, error } = validateRut(rut)
    if (!valid) {
      setRutError(error)
      return
    }

    setLoading(true)
    setApiError(null)
    setProveedor(undefined)

    try {
      const result = await fetchProveedor(rut)
      setProveedor(result) // null si no fue encontrado
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }, [rut])

  return (
    <div className="prov-page">

      {/* ---- Header ---- */}
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Búsqueda de Proveedores</h1>
          <p className="page-hero__sub">
            Ingresa el RUT de un proveedor para consultar su información en el sistema ChileCompra.
          </p>
        </div>
      </div>

      <div className="container prov-page__body">

        {/* ---- Search Form ---- */}
        <section className="card prov-search" aria-labelledby="prov-form-heading">
          <h2 id="prov-form-heading" className="prov-search__title">
            Buscar por RUT
          </h2>
          <p className="prov-search__help">
            Formato aceptado: <strong>12.345.678-9</strong> o <strong>12345678-9</strong>
          </p>

          <form
            onSubmit={handleSearch}
            noValidate
            aria-label="Formulario de búsqueda de proveedor"
          >
            <div className="prov-search__row">
              <div className="form-group" style={{flex:1}}>
                <label htmlFor="rut-input">
                  RUT del proveedor <span aria-hidden="true" style={{color:'var(--error)'}}>*</span>
                </label>
                <input
                  id="rut-input"
                  type="text"
                  value={rut}
                  onChange={handleRutChange}
                  placeholder="Ej: 77.653.382-3"
                  className={rutError ? 'error' : ''}
                  aria-required="true"
                  aria-invalid={!!rutError}
                  aria-describedby={rutError ? 'rut-error' : 'rut-help'}
                  maxLength={12}
                  autoComplete="off"
                  inputMode="text"
                />
                {/* Ayuda base */}
                {!rutError && (
                  <span id="rut-help" className="prov-search__input-hint">
                    Ingresa el RUT con puntos y guión.
                  </span>
                )}
                {/* Error de validación */}
                {rutError && (
                  <span id="rut-error" className="form-error" role="alert" aria-live="polite">
                    ⚠ {rutError}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary prov-search__btn"
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
          <div className="loader-overlay" role="status" aria-live="polite" aria-label="Buscando proveedor">
            <div className="spinner" aria-hidden="true" />
            <p>Consultando registro de proveedores…</p>
          </div>
        )}

        {/* ---- Error de API ---- */}
        {apiError && !loading && (
          <div className="state-box" role="alert" aria-live="assertive">
            <div className="state-icon" aria-hidden="true">⚠️</div>
            <h3>Error al consultar</h3>
            <p>{apiError}</p>
          </div>
        )}

        {/* ---- Proveedor no encontrado ---- */}
        {proveedor === null && !loading && !apiError && (
          <div className="state-box" role="status" aria-live="polite">
            <div className="state-icon" aria-hidden="true">🔍</div>
            <h3>Proveedor no encontrado</h3>
            <p>No existe un proveedor registrado con el RUT <strong>{rut}</strong>. Verifica el número e intenta nuevamente.</p>
          </div>
        )}

        {/* ---- Resultado encontrado ---- */}
        {proveedor && !loading && (
          <section className="card prov-result" aria-labelledby="prov-result-heading" aria-live="polite">
            <div className="prov-result__header">
              <span className="prov-result__icon" aria-hidden="true">🏢</span>
              <div>
                <h2 id="prov-result-heading" className="prov-result__name">
                  {proveedor.NombreEmpresa ?? 'Nombre no disponible'}
                </h2>
                <p className="prov-result__sub">Proveedor registrado en ChileCompra</p>
              </div>
            </div>

            <dl className="prov-result__fields">
              <div className="prov-result__field">
                <dt>RUT</dt>
                <dd style={{fontFamily:'monospace'}}>{rut}</dd>
              </div>
              {proveedor.CodigoEmpresa && (
                <div className="prov-result__field">
                  <dt>Código empresa</dt>
                  <dd>{proveedor.CodigoEmpresa}</dd>
                </div>
              )}
              {proveedor.NombreEmpresa && (
                <div className="prov-result__field">
                  <dt>Razón social</dt>
                  <dd>{proveedor.NombreEmpresa}</dd>
                </div>
              )}
            </dl>
          </section>
        )}

        {/* ---- Estado inicial ---- */}
        {proveedor === undefined && !loading && !apiError && (
          <div className="state-box">
            <div className="state-icon" aria-hidden="true">🏢</div>
            <h3>Ingresa un RUT para comenzar</h3>
            <p>Busca a cualquier proveedor del sistema de compras públicas de Chile por su RUT.</p>
          </div>
        )}

      </div>
    </div>
  )
}
