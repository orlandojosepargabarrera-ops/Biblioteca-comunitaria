import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Libro, Prestamo, Socio } from '../api/types';

export default function PrestamosPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [libroId, setLibroId] = useState<number | ''>('');
  const [socioId, setSocioId] = useState<number | ''>('');
  const [diasPrestamo, setDias] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    const [l, s, p] = await Promise.all([
      api.get<Libro[]>('/libros'),
      api.get<Socio[]>('/socios'),
      api.get<Prestamo[]>('/prestamos'),
    ]);
    setLibros(l); setSocios(s); setPrestamos(p);
  }
  useEffect(() => { cargar(); }, []);

  async function prestar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const body: any = { libroId: Number(libroId), socioId: Number(socioId) };
      if (diasPrestamo !== '') body.diasPrestamo = Number(diasPrestamo);
      await api.post('/prestamos', body);
      setLibroId(''); setSocioId(''); setDias('');
      await cargar();
    } catch (e: any) { setError(e.message); }
  }

  async function devolver(id: number) {
    await api.patch(`/prestamos/${id}/devolver`, {});
    await cargar();
  }

  return (
    <section>
      <h2>Préstamos</h2>

      <form onSubmit={prestar} className="card">
        <h3>Registrar préstamo (CU-03)</h3>
        <div className="grid">
          <label>Libro
            <select required value={libroId}
              onChange={(e) => setLibroId(Number(e.target.value))}>
              <option value="">-- Selecciona --</option>
              {libros.filter((l) => l.estaDisponible).map((l) => (
                <option key={l.id} value={l.id}>{l.titulo} ({l.disponibles} disp.)</option>
              ))}
            </select>
          </label>
          <label>Socio
            <select required value={socioId}
              onChange={(e) => setSocioId(Number(e.target.value))}>
              <option value="">-- Selecciona --</option>
              {socios.filter((s) => s.activo).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombreCompleto} ({s.tipo})
                </option>
              ))}
            </select>
          </label>
          <label>Días (opcional)
            <input type="number" min={1} value={diasPrestamo}
              onChange={(e) => setDias(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Se usa el límite del socio" />
          </label>
        </div>
        <button type="submit" className="btn-primary">Prestar</button>
        {error && <p className="error">{error}</p>}
      </form>

      <h3>Historial</h3>
      <table className="tabla">
        <thead>
          <tr>
            <th>Libro</th><th>Socio</th><th>Prestado</th>
            <th>Vence</th><th>Estado</th><th></th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map((p) => (
            <tr key={p.id} className={p.estaVencido ? 'fila-vencida' : ''}>
              <td>{p.libro?.titulo}</td>
              <td>{p.socio?.nombre} {p.socio?.apellido}</td>
              <td>{new Date(p.fechaPrestamo).toLocaleDateString()}</td>
              <td>{new Date(p.fechaDevolucion).toLocaleDateString()}</td>
              <td>
                {p.estado === 'DEVUELTO' && '✅ Devuelto'}
                {p.estado === 'ACTIVO' && (p.estaVencido
                  ? `⚠️ Vencido (${p.diasDeAtraso}d)`
                  : '🔵 Activo')}
              </td>
              <td>
                {p.estado === 'ACTIVO' && (
                  <button className="btn-ghost" onClick={() => devolver(p.id)}>
                    Devolver (CU-04)
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
