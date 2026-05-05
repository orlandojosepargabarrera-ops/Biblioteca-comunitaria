"use client";

import { useEffect, useState } from "react";
import { prestamosService, Prestamo, SocioConPendientes } from "@/services/prestamos.service";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function diasVencido(fechaDevolucion: string) {
  const diff = new Date().getTime() - new Date(fechaDevolucion).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function AlertasPage() {
  const [vencidos, setVencidos]           = useState<Prestamo[]>([]);
  const [pendientes, setPendientes]       = useState<SocioConPendientes[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  const load = async () => {
    try {
      const [v, p] = await Promise.all([
        prestamosService.vencidos(),
        prestamosService.pendientesPorSocio(),
      ]);
      setVencidos(v);
      setPendientes(p);
    } catch {
      setError("Error al cargar alertas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">🚨 Alertas</h1>
          <p className="text-sm text-zinc-500 mt-1">CU-05 · Préstamos vencidos y pendientes</p>
        </div>
        <button onClick={load}
          className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors">
          🔄 Actualizar
        </button>
      </div>

      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-zinc-200 p-6">
              <div className="h-5 w-48 bg-zinc-200 rounded animate-pulse mb-4" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-12 bg-zinc-100 rounded animate-pulse mb-2" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Préstamos vencidos */}
          <div>
            <div className={`flex items-center gap-2 mb-3 px-4 py-3 rounded-xl ${vencidos.length > 0 ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
              <span className="text-lg">{vencidos.length > 0 ? "🔴" : "✅"}</span>
              <div>
                <p className={`font-semibold text-sm ${vencidos.length > 0 ? "text-red-700" : "text-green-700"}`}>
                  Préstamos Vencidos
                </p>
                <p className={`text-xs ${vencidos.length > 0 ? "text-red-500" : "text-green-500"}`}>
                  {vencidos.length > 0 ? `${vencidos.length} préstamo(s) sin devolver a tiempo` : "Sin vencidos — ¡todo al día!"}
                </p>
              </div>
            </div>

            {vencidos.length === 0 ? (
              <div className="py-8 text-center bg-white rounded-xl border border-zinc-200">
                <p className="text-zinc-400 text-sm">No hay préstamos vencidos.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vencidos.map((p) => {
                  const dias = diasVencido(p.fechaDevolucion);
                  return (
                    <div key={p.id} className="p-4 bg-white border border-red-200 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-zinc-800 text-sm">
                            {p.libro?.titulo ?? `Libro #${p.libroId}`}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            Socio: {p.socio ? `${p.socio.nombre} ${p.socio.apellido}` : `#${p.socioId}`}
                          </p>
                          <p className="text-xs text-zinc-500">
                            Debía devolver: {formatFecha(p.fechaDevolucion)}
                          </p>
                          {p.socio?.telefono && (
                            <p className="text-xs text-zinc-400 mt-1">📞 {p.socio.telefono}</p>
                          )}
                          {p.socio?.email && (
                            <p className="text-xs text-zinc-400">✉️ {p.socio.email}</p>
                          )}
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 shrink-0 ml-2">
                          {dias} día{dias !== 1 ? "s" : ""} vencido
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Socios con pendientes */}
          <div>
            <div className={`flex items-center gap-2 mb-3 px-4 py-3 rounded-xl ${pendientes.length > 0 ? "bg-yellow-50 border border-yellow-200" : "bg-green-50 border border-green-200"}`}>
              <span className="text-lg">{pendientes.length > 0 ? "🟡" : "✅"}</span>
              <div>
                <p className={`font-semibold text-sm ${pendientes.length > 0 ? "text-yellow-700" : "text-green-700"}`}>
                  Socios con Préstamos Pendientes
                </p>
                <p className={`text-xs ${pendientes.length > 0 ? "text-yellow-500" : "text-green-500"}`}>
                  {pendientes.length > 0 ? `${pendientes.length} socio(s) con libros por devolver` : "Todos los socios al día"}
                </p>
              </div>
            </div>

            {pendientes.length === 0 ? (
              <div className="py-8 text-center bg-white rounded-xl border border-zinc-200">
                <p className="text-zinc-400 text-sm">No hay socios con préstamos pendientes.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendientes.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white border border-yellow-200 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-zinc-800 text-sm">
                          {item.socio.nombre} {item.socio.apellido}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Doc: {item.socio.documento} · Tipo: {item.socio.tipo}
                        </p>
                        {item.socio.telefono && (
                          <p className="text-xs text-zinc-400 mt-1">📞 {item.socio.telefono}</p>
                        )}
                        {item.socio.email && (
                          <p className="text-xs text-zinc-400">✉️ {item.socio.email}</p>
                        )}
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 shrink-0 ml-2">
                        {item.prestamosActivos} préstamo{item.prestamosActivos !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Resumen */}
      {!loading && (
        <div className="mt-8 p-4 bg-zinc-100 rounded-xl">
          <p className="text-xs text-zinc-500 font-medium mb-2">📊 Resumen de alertas</p>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-bold text-red-600">{vencidos.length}</span>
              <span className="text-zinc-500 ml-1">préstamos vencidos</span>
            </div>
            <div>
              <span className="font-bold text-yellow-600">{pendientes.length}</span>
              <span className="text-zinc-500 ml-1">socios con pendientes</span>
            </div>
            <div>
              <span className="font-bold text-zinc-700">{pendientes.reduce((acc, p) => acc + p.prestamosActivos, 0)}</span>
              <span className="text-zinc-500 ml-1">libros por devolver</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
