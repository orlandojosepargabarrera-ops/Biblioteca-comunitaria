import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import LibrosPage from './pages/LibrosPage';
import SociosPage from './pages/SociosPage';
import PrestamosPage from './pages/PrestamosPage';
import AlertasPage from './pages/AlertasPage';

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <h1>📚 Biblioteca Comunitaria</h1>
        <nav>
          <NavLink to="/libros">Libros</NavLink>
          <NavLink to="/socios">Socios</NavLink>
          <NavLink to="/prestamos">Préstamos</NavLink>
          <NavLink to="/alertas">Alertas</NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/libros" replace />} />
          <Route path="/libros" element={<LibrosPage />} />
          <Route path="/socios" element={<SociosPage />} />
          <Route path="/prestamos" element={<PrestamosPage />} />
          <Route path="/alertas" element={<AlertasPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <small>Sistema de gestión para biblioteca comunitaria</small>
      </footer>
    </div>
  );
}
