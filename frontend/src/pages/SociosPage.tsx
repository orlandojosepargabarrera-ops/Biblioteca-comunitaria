import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Socio, TipoSocio } from '../api/types';

const TIPOS: TipoSocio[] = ['ADULTO', 'JOVEN', 'INFANTIL'];

export default function SociosPage() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [form, setForm] = useState({
    nombre: '', apellido: '', documento: '', telefono: '', email: '',
    direccion: '', tipo: 'ADULTO' as TipoSocio,
  });
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    try {
      setSocios(await api.get<Socio[]>('/socios'));
    } catch (e: any) { setError(e.message); }
  }
  useEffect(() => { cargar(); }, []);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const payload: any = { ...form };
      if (!payload.telefono) delete payload.telefono;
      if (!payload.email) delete payload.email;
      if (!payload.direccion) delete payload.direccion;
      await api.post('/socios', payload);
      setForm({ nombre: '', apellido: '', documento: '', telefono: '', email: '', direccion: '', tipo: 'ADULTO' });
      await cargar();
    } catch (e: any) { setError(e.message); }
  }

  return (
    <section>
      <h2>Socios registrados</h2>

      <form onSubmit={crear} className="card">
        <h3>Registrar nuevo socio (CU-02)</h3>
        <div className="grid">
          <label>Nombre
            <input required value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </label>
          <label>Apellido
            <input required value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
          </label>
          <label>Documento
            <input required value={form.documento}
              onChange={(e) => setForm({ ...form, documento: e.target.value })} />
          </label>
          <label>Teléfono
            <input value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          </label>
          <label>Email
            <input type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>Dirección
            <input value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          </label>
          <label>Tipo
            <select value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoSocio })}>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <button type="submit" className="btn-primary">Guardar socio</button>
        {error && <p className="error">{error}</p>}
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th><th>Documento</th><th>Tipo</th>
            <th>Contacto</th><th>Días préstamo</th><th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {socios.map((s) => (
            <tr key={s.id}>
              <td>{s.nombreCompleto}</td>
              <td>{s.documento}</td>
              <td>{s.tipo}</td>
              <td>{s.email ?? '—'}<br /><small>{s.telefono ?? ''}</small></td>
              <td>{s.diasPrestamoPermitidos}</td>
              <td>{s.activo ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
