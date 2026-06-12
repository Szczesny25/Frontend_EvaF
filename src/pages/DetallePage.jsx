import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchDetalleLicitacion, getEstadoInfo, formatFecha } from '../utils/api'
import './DetallePage.css'

function Field({ label, value, mono = false }) {
  const display = value ?? '--'
  return (
    <div className="detail-field">
      <dt className="detail-field__label">{label}</dt>
      <dd className={`detail-field__value ${mono ? 'mono' : ''}`}>{display}</dd>
    </div>
  )
}

export default function DetallePage() {
  const { codigo } = useParams()
  const [lic,      setLic]      = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchDetalleLicitacion(decodeURIComponent(codigo))
      .then(setLic)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [codigo])

  if (loading) return (
    <div className="loader-overlay" style={{minHeight:'60vh'}} role="status" aria-live="polite" aria-label="Cargando detalle de licitación">
      <div className="spinner" aria-hidden="true" />
      <p>Cargando detalle de la licitación…</p>
    </div>
  )

  if (error) return (
    <div className="container" style={{padding:'48px 24px'}}>
      <div className="state-box" role="alert">
        <div className="state-icon" aria-hidden="true">⚠️</div>
        <h2>No se pudo cargar el detalle</h2>
        <p>{error}</p>
        <Link to="/licitaciones" className="btn btn-outline" style={{marginTop:16}}>
          ← Volver al listado
        </Link>
      </div>
    </div>
  )

  if (!lic) return null

  const { label: estadoLabel, cls: estadoCls } = getEstadoInfo(lic.CodigoEstado)
  const comprador = lic.Comprador ?? {}
  const items     = lic.Items?.Listado ?? []

  return (
    <div className="detail-page">

      {/* ---- Breadcrumb ---- */}
      <nav aria-label="Migas de pan" className="breadcrumb">
        <div className="container">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true"> / </span>
          <Link to="/licitaciones">Licitaciones</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{codigo}</span>
        </div>
      </nav>

      {/* ---- Header ---- */}
      <div className="page-hero">
        <div className="container">
          <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:12, flexWrap:'wrap'}}>
            <span className={`badge ${estadoCls}`} aria-label={`Estado: ${estadoLabel}`}>
              {estadoLabel}
            </span>
            <code className="detail-code" aria-label={`Código de licitación: ${lic.CodigoExterno}`}>
              {lic.CodigoExterno}
            </code>
          </div>
          <h1 className="page-hero__title" style={{fontSize:'clamp(1.2rem,3vw,1.7rem)'}}>
            {lic.Nombre ?? 'Sin nombre'}
          </h1>
        </div>
      </div>

      {/* ---- Body ---- */}
      <div className="container detail-page__body">

        {/* Descripción */}
        {lic.Descripcion && (
          <section className="card detail-section" aria-labelledby="desc-heading">
            <h2 id="desc-heading" className="detail-section__title">📋 Descripción</h2>
            <p className="detail-desc">{lic.Descripcion}</p>
          </section>
        )}

        {/* Datos generales */}
        <section className="card detail-section" aria-labelledby="general-heading">
          <h2 id="general-heading" className="detail-section__title">📊 Datos generales</h2>
          <dl className="detail-grid">
            <Field label="Código"          value={lic.CodigoExterno} mono />
            <Field label="Estado"          value={estadoLabel} />
            <Field label="Fecha creación"  value={formatFecha(lic.FechaCreacion)} />
            <Field label="Fecha cierre"    value={formatFecha(lic.FechaCierre)} />
            <Field label="Fecha adjudicación" value={formatFecha(lic.FechaAdjudicacion)} />
            <Field label="Tipo"            value={lic.Tipo} />
          </dl>
        </section>

        {/* Comprador */}
        <section className="card detail-section" aria-labelledby="comprador-heading">
          <h2 id="comprador-heading" className="detail-section__title">🏛 Organismo Comprador</h2>
          <dl className="detail-grid">
            <Field label="Nombre"      value={comprador.NombreOrganismo} />
            <Field label="RUT"         value={comprador.RutUnidad} mono />
            <Field label="Unidad"      value={comprador.NombreUnidad} />
            <Field label="Dirección"   value={comprador.DireccionUnidad} />
            <Field label="Comuna"      value={comprador.ComunaUnidad} />
            <Field label="Región"      value={comprador.RegionUnidad} />
          </dl>
        </section>

        {/* Ítems */}
        {items.length > 0 && (
          <section className="card detail-section" aria-labelledby="items-heading">
            <h2 id="items-heading" className="detail-section__title">📦 Ítems licitados ({items.length})</h2>
            <div className="items-table-wrap">
              <table className="items-table" aria-label="Tabla de ítems licitados">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Unidad</th>
                    <th scope="col">Adjudicatario</th>
                    <th scope="col">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.Correlativo ?? i + 1}</td>
                      <td>{item.NombreProducto ?? '--'}</td>
                      <td>{item.Categoria ?? '--'}</td>
                      <td>{item.Cantidad ?? '--'}</td>
                      <td>{item.UnidadMedida ?? '--'}</td>
                      <td>{item.Adjudicacion?.NombreProveedor ?? '--'}</td>
                      <td>
                        {item.Adjudicacion?.MontoUnitario != null
                          ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })
                              .format(item.Adjudicacion.MontoUnitario)
                          : '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div style={{marginTop:8}}>
          <Link to="/licitaciones" className="btn btn-outline" tabIndex={0}>
            ← Volver al listado
          </Link>
        </div>

      </div>
    </div>
  )
}
