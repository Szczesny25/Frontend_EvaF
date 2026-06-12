import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LicitacionesPage from './pages/LicitacionesPage'
import DetallePage from './pages/DetallePage'
import ProveedoresPage from './pages/ProveedoresPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* Skip to content link — accesibilidad teclado */}
      <a href="#main-content" className="sr-only">
        Saltar al contenido principal
      </a>

      <Navbar />

      <main id="main-content" tabIndex="-1">
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/licitaciones"   element={<LicitacionesPage />} />
          <Route path="/licitaciones/:codigo" element={<DetallePage />} />
          <Route path="/proveedores"    element={<ProveedoresPage />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  )
}
