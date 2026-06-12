import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__inner">

        <div className="footer__brand">
          <Link to="/" className="footer__logo" aria-label="LicitaSeguro inicio">
            <span aria-hidden="true">⚖</span> Licita<strong>Seguro</strong>
          </Link>
          <p className="footer__tagline">
            Información pública, acceso transparente.<br />
            Datos provistos por la API de Mercado Público de Chile.
          </p>
        </div>

        <nav className="footer__links" aria-label="Navegación del pie de página">
          <h3 className="footer__heading">Módulos</h3>
          <ul>
            <li><Link to="/licitaciones" className="footer__link">Licitaciones</Link></li>
            <li><Link to="/proveedores"  className="footer__link">Proveedores</Link></li>
          </ul>
        </nav>

        <div className="footer__links">
          <h3 className="footer__heading">Fuente de datos</h3>
          <ul>
            <li>
              <a
                href="https://api.mercadopublico.cl/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
                aria-label="API de Mercado Público (abre en nueva pestaña)"
              >
                API Mercado Público ↗
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} LicitaSeguro — Proyecto académico Instituto Profesional San Sebastián</p>
      </div>
    </footer>
  )
}
