"use client";

import { useEffect, useState } from "react";
import { prestamosService, Prestamo, CreatePrestamoDto } from "@/services/prestamos.service";
import { librosService, Libro } from "@/services/libros.service";
import { sociosService, Socio } from "@/services/socios.service";

const emptyForm: CreatePrestamoDto = {
  libroId: 0,
  socioId: 0,
  diasPrestamo: undefined,
  observaciones: "",
};

const estadoBadge: Record<string, string> = {
  ACTIVO:    "bg-blue-100 text-blue-700",
  DEVUELTO:  "bg-green-100 text-green-700",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PrestamosPage() {
  const [prestamos, setPrestamos]   = useState<Prestamo[]>([]);
  const [libros, setLibros]         = useState<Libro[]>([]);
  const [socios, setSocios]         = useState<Socio[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState<CreatePrestamoDto>(emptyForm);
  const [devolviendo, setDevolviendo] = useState<Prestamo | null>(null);
  const [obsDevolucion, setObsDevolucion] = useState("");

  const load = async () => {
    try {
      const [p, l, s] = await Promise.all([
        prestamosService.findAll(),
        librosService.findAll(),
        sociosService.findAll(),
      ]);
      setPrestamos(p);
      setLibros(l);
      setSocios(s);
    } catch {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const notify = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload: CreatePrestamoDto = {
        libroId: Number(form.libroId),
        socioId: Number(form.socioId),
        diasPrestamo: form.diasPrestamo ? Number(form.diasPrestamo) : undefined,
        observaciones: form.observaciones || undefined,
      };
      await prestamosService.create(payload);
      notify("Préstamo registrado correctamente");
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      const e = err as { messages?: string[] };
      setError(e.messages?.join(", ") ?? "Error al registrar préstamo");
    }
  };

  const handleDevolver = async () => {
    if (!devolviendo) return;
    setError(null);
    try {
      await prestamosService.devolver(devolviendo.id, { observaciones: obsDevolucion || undefined });
      notify("Devolución registrada correctamente");
      setDevolviendo(null);
      setObsDevolucion("");
      await load();
    } catch (err: unknown) {
      const e = err as { messages?: string[] };
      setError(e.messages?.join(", ") ?? "Error al registrar devolución");
    }
  };

  const activos = prestamos.filter((p) => p.estado === "ACTIVO");
  const devueltos = prestamos.filter((p) => p.estado === "DEVUELTO");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">🔖 Préstamos</h1>
          <p className="text-sm text-zinc-500 mt-1">CU-03/04 · Préstamos y devoluciones</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">
            + Nuevo Préstamo
          </button>
        )}
      </div>

      {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>}
      {error   && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {error}</div>}

      {/* Modal devolución */}
      {devolviendo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-semibold text-zinc-800 mb-1">Registrar Devolución</h2>
            <p className="text-sm text-zinc-500 mb-4">
              Libro: <span className="font-medium text-zinc-700">{devolviendo.libro?.titulo ?? `#${devolviendo.libroId}`}</span>
            </p>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Observaciones (opcional)</label>
            <textarea
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none"
              rows={3}
              value={obsDevolucion}
              onChange={(e) => setObsDevolucion(e.target.value)}
              placeholder="Estado del libro, notas..."
            />
            <div className="flex gap-2 mt-4">
              <button onClick={handleDevolver}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                Confirmar Devolución
              </button>
              <button onClick={() => { setDevolviendo(null); setObsDevolucion(""); }}
                className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario nuevo préstamo */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border border-zinc-200 rounded-xl">
          <h2 className="font-semibold text-zinc-800 mb-4">Nuevo Préstamo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Libro</label>
              <select className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.libroId}
                onChange={(e) => setForm({ ...form, libroId: Number(e.target.value) })} required>
                <option value={0} disabled>Seleccionar libro...</option>
                {libros.filter((l) => l.disponibles > 0).map((l) => (
                  <option key={l.id} value={l.id}>{l.titulo} ({l.disponibles} disp.)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Socio</label>
              <select className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.socioId}
                onChange={(e) => setForm({ ...form, socioId: Number(e.target.value) })} required>
                <option value={0} disabled>Seleccionar socio...</option>
                {socios.filter((s) => s.activo).map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre} {s.apellido} — {s.tipo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Días de préstamo <span className="text-zinc-400">(opcional — se calcula por tipo de socio)</span>
              </label>
              <input type="number" min={1}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.diasPrestamo ?? ""}
                onChange={(e) => setForm({ ...form, diasPrestamo: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Automático según tipo de socio" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Observaciones <span className="text-zinc-400">(opcional)</span></label>
              <input className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.observaciones ?? ""}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                placeholder="Notas adicionales..." />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">
              Registrar Préstamo
            </button>
            <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); setError(null); }}
              className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
          <div className="animate-pulse text-zinc-400">Cargando préstamos...</div>
        </div>
      ) : (
        <>
          {/* Préstamos activos */}
          <div className="mb-6">
            <h2 className="font-semibold text-zinc-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
              Préstamos Activos ({activos.length})
            </h2>
            {activos.length === 0 ? (
              <div className="py-8 text-center bg-white rounded-xl border border-zinc-200">
                <p className="text-zinc-400 text-sm">No hay préstamos activos.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600">Libro</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600">Socio</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600">Fecha Préstamo</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600">Fecha Devolución</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600">Estado</th>
                      <th className="text-right px-4 py-3 font-medium text-zinc-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {activos.map((p) => {
                      const vencido = new Date(p.fechaDevolucion) < new Date();
                      return (
                        <tr key={p.id} className={`hover:bg-zinc-50 transition-colors ${vencido ? "bg-red-50" : ""}`}>
                          <td className="px-4 py-3 font-medium text-zinc-800">{p.libro?.titulo ?? `Libro #${p.libroId}`}</td>
                          <td className="px-4 py-3 text-zinc-600">{p.socio ? `${p.socio.nombre} ${p.socio.apellido}` : `Socio #${p.socioId}`}</td>
                          <td className="px-4 py-3 text-zinc-500">{formatFecha(p.fechaPrestamo)}</td>
                          <td className="px-4 py-3">
                            <span className={vencido ? "text-red-600 font-medium" : "text-zinc-500"}>
                              {formatFecha(p.fechaDevolucion)}
                              {vencido && " ⚠️"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoBadge[p.estado]}`}>{p.estado}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => setDevolviendo(p)}
                              className="text-xs px-2 py-1 rounded bg-green-50 hover:bg-green-100 text-green-700 transition-colors">
                              Devolver
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Historial devueltos */}
          {devueltos.length > 0 && (
            <div>
              <h2 className="font-semibold text-zinc-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                Historial de Devoluciones ({devueltos.length})
              </h2>
              <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600">Libro</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600">Socio</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600">Prestado</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600">Devuelto</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 opacity-75">
                    {devueltos.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3 text-zinc-700">{p.libro?.titulo ?? `Libro #${p.libroId}`}</td>
                        <td className="px-4 py-3 text-zinc-600">{p.socio ? `${p.socio.nombre} ${p.socio.apellido}` : `Socio #${p.socioId}`}</td>
                        <td className="px-4 py-3 text-zinc-500">{formatFecha(p.fechaPrestamo)}</td>
                        <td className="px-4 py-3 text-zinc-500">{p.fechaDevuelto ? formatFecha(p.fechaDevuelto) : "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoBadge[p.estado]}`}>{p.estado}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
