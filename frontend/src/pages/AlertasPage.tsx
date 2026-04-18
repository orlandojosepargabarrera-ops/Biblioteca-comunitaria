import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Prestamo, Socio } from '../api/types';

interface SocioPendiente {
  socio: Socio;
  pendientes: number;
}

export default function AlertasPage() {
  const [vencidos, setVencidos] = useState<Prestamo[]>([]);
  const [pendientes, setPendientes] = useState<SocioPendiente[]>([]);

  async function cargar() {
    const [v, p] = await Promise.all([
      api.get<Prestamo[]>('/prestamos/vencidos'),
      api.get<SocioPendiente[]>('/prestamos/pendientes-por-socio'),
    ]);
    setVencidos(v);
    setPendientes(p);
  }
  useEffect(() => { cargar(); }, []);

  return (
    <section>
      <h2>🚨 Alertas de devolución (CU-05)</h2>

      <div className="card">
        <h3>Préstamos vencidos ({vencidos.length})</h3>
        {vencidos.length === 0 ? (
          <p>No hay préstamos vencidos. ¡Todo al día!</p>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>Libro</th><th>Socio</th><th>Documento</th>
                <th>Vencido desde</th><th>Días de atraso</th>
              </tr>
            </thead>
            <tbody>
              {vencidos.map((v) => (
                <tr key={v.id}>
                  <td>{v.libro?.titulo}</td>
                  <td>{v.socio?.nombre} {v.socio?.apellido}</td>
                  <td>{v.socio?.documento}</td>
                  <td>{new Date(v.fechaDevolucion).toLocaleDateString()}</td>
                  <td><strong className="texto-alerta">{v.diasDeAtraso}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3>Socios con devoluciones pendientes ({pendientes.length})</h3>
        {pendientes.length === 0 ? (
          <p>Ningún socio tiene devoluciones pendientes.</p>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>Socio</th><th>Documento</th><th>Tipo</th>
                <th># Préstamos pendientes</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((p) => (
                <tr key={p.socio.id}>
                  <td>{p.socio.nombreCompleto}</td>
                  <td>{p.socio.documento}</td>
                  <td>{p.socio.tipo}</td>
                  <td>{p.pendientes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
