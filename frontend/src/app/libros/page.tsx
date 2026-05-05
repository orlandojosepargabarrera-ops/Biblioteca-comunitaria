"use client";

import { useEffect, useState } from "react";
import {
  librosService,
  Libro,
  CreateLibroDto,
  GENEROS,
} from "@/services/libros.service";

const emptyForm: CreateLibroDto = {
  titulo: "",
  autor: "",
  genero: "NOVELA",
  isbn: "",
  totalEjemplares: 1,
};

export default function LibrosPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Libro | null>(null);
  const [form, setForm] = useState<CreateLibroDto>(emptyForm);

  const load = async () => {
    try {
      setLibros(await librosService.findAll());
    } catch {
      setError("Error al cargar libros");
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
      if (editing) {
        await librosService.update(editing.id, form);
        notify("Libro actualizado correctamente");
      } else {
        await librosService.create(form);
        notify("Libro registrado correctamente");
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

  const handleEdit = (l: Libro) => {
    setEditing(l);
    setForm({ titulo: l.titulo, autor: l.autor, genero: l.genero, isbn: l.isbn, totalEjemplares: l.totalEjemplares });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este libro?")) return;
    setError(null);
    try {
      await librosService.remove(id);
      notify("Libro eliminado");
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

  const f = (field: keyof CreateLibroDto) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [field]: field === "totalEjemplares" ? Number(e.target.value) : e.target.value });

  const disponibilidadColor = (libro: Libro) =>
    libro.disponibles === 0
      ? "bg-red-100 text-red-700"
      : libro.disponibles <= 2
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">📚 Libros</h1>
          <p className="text-sm text-zinc-500 mt-1">CU-01 · Gestión del catálogo</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-700 transition-colors"
          >
            + Nuevo Libro
          </button>
        )}
      </div>

      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">❌ {error}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border border-zinc-200 rounded-xl">
          <h2 className="font-semibold text-zinc-800 mb-4">
            {editing ? "Editar Libro" : "Nuevo Libro"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Título</label>
              <input className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.titulo} onChange={f("titulo")} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Autor</label>
              <input className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.autor} onChange={f("autor")} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Género</label>
              <select className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.genero} onChange={f("genero")} required>
                {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">ISBN</label>
              <input className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.isbn} onChange={f("isbn")} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Total Ejemplares</label>
              <input type="number" min={1}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.totalEjemplares} onChange={f("totalEjemplares")} required />
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
              <tr>{["Título", "Autor", "Género", "ISBN", "Disponibles", "Acciones"].map((h) => (
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
      ) : libros.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-xl border border-zinc-200">
          <p className="text-zinc-400 text-sm">No hay libros registrados.</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-xs px-3 py-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors">
            + Registrar primer libro
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Título</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Autor</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Género</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">ISBN</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Disponibles</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {libros.map((l) => (
                <tr key={l.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-800">{l.titulo}</td>
                  <td className="px-4 py-3 text-zinc-600">{l.autor}</td>
                  <td className="px-4 py-3 text-zinc-600">{l.genero}</td>
                  <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{l.isbn}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${disponibilidadColor(l)}`}>
                      {l.disponibles} / {l.totalEjemplares}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(l)} className="text-xs px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(l.id)} className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors">Eliminar</button>
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
