import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setMenuOpen(false)

  const links = [
    { to: '/',             label: 'Inicio' },
    { to: '/licitaciones', label: 'Licitaciones' },
    { to: '/proveedores',  label: 'Proveedores' },
  ]

  return (
    <header className="navbar" role="banner">
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="LicitaSeguro — Inicio" onClick={closeMenu}>
          <span className="navbar__logo-icon" aria-hidden="true">⚖</span>
          <span className="navbar__logo-text">
            Licita<strong>Seguro</strong>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navegación principal" className="navbar__nav">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' navbar__link--active' : '')
              }
            >
              {label}
            </NavLink>
          ))}
          <Link to="/licitaciones" className="btn btn-primary navbar__cta">
            Buscar licitaciones
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(v => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}
        aria-label="Menú móvil"
        aria-hidden={!menuOpen}
      >
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              'navbar__mobile-link' + (isActive ? ' navbar__mobile-link--active' : '')
            }
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            {label}
          </NavLink>
        ))}
        <Link
          to="/licitaciones"
          className="btn btn-primary"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
          style={{ marginTop: '8px', justifyContent: 'center' }}
        >
          Buscar licitaciones
        </Link>
      </nav>
    </header>
  )
}
