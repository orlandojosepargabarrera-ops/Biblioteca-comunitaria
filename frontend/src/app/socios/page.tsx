"use client";

import { useEffect, useState } from "react";
import {
  sociosService,
  Socio,
  CreateSocioDto,
  TIPOS_SOCIO,
} from "@/services/socios.service";

const emptyForm: CreateSocioDto = {
  nombre: "",
  apellido: "",
  documento: "",
  telefono: "",
  email: "",
  direccion: "",
  tipo: "ADULTO",
};

const tipoBadge: Record<string, string> = {
  ADULTO:   "bg-blue-100 text-blue-700",
  JOVEN:    "bg-green-100 text-green-700",
  INFANTIL: "bg-purple-100 text-purple-700",
};

export default function SociosPage() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Socio | null>(null);
  const [form, setForm] = useState<CreateSocioDto>(emptyForm);

  const load = async () => {
    try {
      setSocios(await sociosService.findAll());
    } catch {
      setError("Error al cargar socios");
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
      const payload: CreateSocioDto = {
        ...form,
        telefono: form.telefono || undefined,
        email: form.email || undefined,
        direccion: form.direccion || undefined,
      };
      if (editing) {
        await sociosService.update(editing.id, payload);
        notify("Socio actualizado correctamente");
      } else {
        await sociosService.create(payload);
        notify("Socio registrado correctamente");
      }
      setForm(emptyForm);
      setEditing(null);
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      const e = err as { messages?: string[] };
      setError(e.messages?.join(", ") ?? "Error al guardar");
    }
  };

  const handleEdit = (s: Socio) => {
    setEditing(s);
    setForm({
      nombre: s.nombre, apellido: s.apellido, documento: s.documento,
      telefono: s.telefono ?? "", email: s.email ?? "",
      direccion: s.direccion ?? "", tipo: s.tipo,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este socio?")) return;
    setError(null);
    try {
      await sociosService.remove(id);
      notify("Socio eliminado");
      await load();
    } catch (err: unknown) {
      const e = err as { messages?: string[] };
      setError(e.messages?.join(", ") ?? "Error al eliminar");
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    setError(null);
  };

  const f = (field: keyof CreateSocioDto) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [field]: e.target.value });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">👥 Socios</h1>
          <p className="text-sm text-zinc-500 mt-1">CU-02 · Registro de miembros</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">
            + Nuevo Socio
          </button>
        )}
      </div>

      {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>}
      {error   && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border border-zinc-200 rounded-xl">
          <h2 className="font-semibold text-zinc-800 mb-4">{editing ? "Editar Socio" : "Nuevo Socio"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Nombre",    field: "nombre"    as const },
              { label: "Apellido",  field: "apellido"  as const },
              { label: "Documento", field: "documento" as const },
              { label: "Teléfono", field: "telefono"  as const, required: false },
              { label: "Email",     field: "email"     as const, type: "email", required: false },
              { label: "Dirección", field: "direccion" as const, required: false },
            ].map(({ label, field, type, required = true }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  {label}{!required && <span className="text-zinc-400 ml-1">(opcional)</span>}
                </label>
                <input type={type ?? "text"}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  value={String(form[field] ?? "")} onChange={f(field)} required={required} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Tipo de Socio</label>
              <select className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.tipo} onChange={f("tipo")} required>
                {TIPOS_SOCIO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors">
              {editing ? "Actualizar" : "Registrar"}
            </button>
            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>{["Nombre", "Documento", "Tipo", "Contacto", "Estado", "Acciones"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-zinc-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 6 }).map((__, j) => (
                  <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-200 rounded animate-pulse" /></td>
                ))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : socios.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-xl border border-zinc-200">
          <p className="text-zinc-400 text-sm">No hay socios registrados.</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-xs px-3 py-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors">
            + Registrar primer socio
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Documento</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Contacto</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {socios.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-800">{s.nombre} {s.apellido}</td>
                  <td className="px-4 py-3 text-zinc-600 font-mono text-xs">{s.documento}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipoBadge[s.tipo]}`}>{s.tipo}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{s.email ?? s.telefono ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.activo ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                      {s.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(s)} className="text-xs px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(s.id)} className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
