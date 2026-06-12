import { Link } from 'react-router-dom'
import './HomePage.css'

/* ---- Datos estáticos para el homepage ---- */
const FEATURES = [
  {
    icon: '📋',
    title: 'Listado de Licitaciones',
    desc:  'Consulta todas las licitaciones disponibles en Mercado Público con información actualizada en tiempo real.',
    to:    '/licitaciones',
    cta:   'Ver licitaciones',
  },
  {
    icon: '🔍',
    title: 'Filtros Avanzados',
    desc:  'Filtra por fecha y estado — activa, adjudicada, revocada y más — para encontrar exactamente lo que necesitas.',
    to:    '/licitaciones',
    cta:   'Filtrar ahora',
  },
  {
    icon: '🏢',
    title: 'Búsqueda de Proveedores',
    desc:  'Ingresa el RUT de un proveedor y obtén toda su información registrada en el sistema de ChileCompra.',
    to:    '/proveedores',
    cta:   'Buscar proveedor',
  },
  {
    icon: '📄',
    title: 'Detalle Completo',
    desc:  'Accede al detalle de cada licitación: comprador, ítems, montos, fechas y estado del proceso.',
    to:    '/licitaciones',
    cta:   'Explorar',
  },
]

const STATS = [
  { value: '+372',  label: 'Licitaciones disponibles hoy' },
  { value: '100%',  label: 'Datos desde Mercado Público' },
  { value: '3',     label: 'Módulos de consulta' },
  { value: 'Libre', label: 'Acceso sin registro' },
]

export default function HomePage() {
  return (
    <>
      {/* ---- HERO ---- */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__bg-pattern" aria-hidden="true" />

        <div className="container hero__content">
          <div className="hero__badge" aria-label="Datos en tiempo real">
            <span className="hero__badge-dot" aria-hidden="true" />
            Datos en tiempo real · API Mercado Público
          </div>

          <h1 id="hero-heading" className="hero__title">
            Licitaciones públicas<br />
            <span className="hero__title-accent">sin complicaciones</span>
          </h1>

          <p className="hero__subtitle">
            LicitaSeguro te da acceso directo y transparente a todas las
            licitaciones de Chile. Consulta, filtra y encuentra proveedores
            desde un solo lugar.
          </p>

          <div className="hero__actions">
            <Link to="/licitaciones" className="btn btn-primary hero__cta-main">
              🔍 Explorar licitaciones
            </Link>
            <Link to="/proveedores" className="btn btn-secondary">
              Buscar proveedor
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="hero__stats" role="list" aria-label="Estadísticas del portal">
          {STATS.map(({ value, label }) => (
            <div key={label} className="hero__stat" role="listitem">
              <span className="hero__stat-value" aria-label={`${value} ${label}`}>
                {value}
              </span>
              <span className="hero__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- FEATURES ---- */}
      <section className="features" aria-labelledby="features-heading">
        <div className="container">
          <header className="section-header">
            <h2 id="features-heading" className="section-title">
              Todo lo que necesitas en un portal
            </h2>
            <p className="section-subtitle">
              Cuatro módulos diseñados para que accedas a la información pública
              de compras del Estado de forma rápida y confiable.
            </p>
          </header>

          <ul className="features__grid" aria-label="Módulos del portal">
            {FEATURES.map(({ icon, title, desc, to, cta }) => (
              <li key={title} className="feature-card card">
                <span className="feature-card__icon" aria-hidden="true">{icon}</span>
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__desc">{desc}</p>
                <Link
                  to={to}
                  className="btn btn-outline feature-card__link"
                  aria-label={`${cta} — ${title}`}
                >
                  {cta} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section className="how-it-works" aria-labelledby="how-heading">
        <div className="container">
          <header className="section-header">
            <h2 id="how-heading" className="section-title">
              ¿Cómo funciona?
            </h2>
            <p className="section-subtitle">
              Tres pasos para encontrar lo que buscas.
            </p>
          </header>

          <ol className="steps" aria-label="Pasos para usar LicitaSeguro">
            {[
              { n: '01', title: 'Elige fecha y estado', desc: 'Selecciona el rango de fecha y el estado de las licitaciones que te interesan.' },
              { n: '02', title: 'Navega el listado',   desc: 'Revisa el listado paginado con los datos principales de cada proceso.' },
              { n: '03', title: 'Accede al detalle',   desc: 'Haz clic en cualquier licitación para ver toda su información completa.' },
            ].map(({ n, title, desc }) => (
              <li key={n} className="step">
                <span className="step__number" aria-hidden="true">{n}</span>
                <div>
                  <h3 className="step__title">{title}</h3>
                  <p className="step__desc">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- CTA FINAL ---- */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="container cta-section__inner">
          <h2 id="cta-heading" className="cta-section__title">
            ¿Listo para explorar?
          </h2>
          <p className="cta-section__text">
            Accede ahora al listado completo de licitaciones públicas de Chile
            sin necesidad de registrarte.
          </p>
          <Link to="/licitaciones" className="btn btn-primary cta-section__btn">
            🚀 Comenzar ahora
          </Link>
        </div>
      </section>
    </>
  )
}
