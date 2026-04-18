import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Libro, Genero } from '../api/types';

const GENEROS: Genero[] = [
  'NOVELA', 'CUENTO', 'POESIA', 'ENSAYO', 'INFANTIL',
  'HISTORIA', 'CIENCIA', 'TECNOLOGIA', 'AUTOAYUDA', 'OTRO',
];

export default function LibrosPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [form, setForm] = useState({
    titulo: '', autor: '', genero: 'NOVELA' as Genero, isbn: '', totalEjemplares: 1,
  });
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    try {
      const data = await api.get<Libro[]>('/libros');
      setLibros(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/libros', { ...form, totalEjemplares: Number(form.totalEjemplares) });
      setForm({ titulo: '', autor: '', genero: 'NOVELA', isbn: '', totalEjemplares: 1 });
      await cargar();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function eliminar(id: number) {
    if (!confirm('¿Eliminar este libro?')) return;
    await api.delete(`/libros/${id}`);
    await cargar();
  }

  return (
    <section>
      <h2>Libros del catálogo</h2>

      <form onSubmit={crear} className="card">
        <h3>Registrar nuevo libro (CU-01)</h3>
        <div className="grid">
          <label>Título
            <input required value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </label>
          <label>Autor
            <input required value={form.autor}
              onChange={(e) => setForm({ ...form, autor: e.target.value })} />
          </label>
          <label>Género
            <select value={form.genero}
              onChange={(e) => setForm({ ...form, genero: e.target.value as Genero })}>
              {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
          <label>ISBN
            <input required value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
          </label>
          <label>Ejemplares
            <input type="number" min={1} required value={form.totalEjemplares}
              onChange={(e) => setForm({ ...form, totalEjemplares: Number(e.target.value) })} />
          </label>
        </div>
        <button type="submit" className="btn-primary">Guardar libro</button>
        {error && <p className="error">{error}</p>}
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>Título</th><th>Autor</th><th>Género</th><th>ISBN</th>
            <th>Disponibles</th><th>Total</th><th></th>
          </tr>
        </thead>
        <tbody>
          {libros.map((l) => (
            <tr key={l.id}>
              <td>{l.titulo}</td>
              <td>{l.autor}</td>
              <td>{l.genero}</td>
              <td>{l.isbn}</td>
              <td>
                <span className={l.estaDisponible ? 'badge-ok' : 'badge-no'}>
                  {l.disponibles}
                </span>
              </td>
              <td>{l.totalEjemplares}</td>
              <td><button className="btn-ghost" onClick={() => eliminar(l.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
