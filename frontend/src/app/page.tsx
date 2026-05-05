import Link from "next/link";

const modules = [
  {
    href: "/libros",
    title: "Libros",
    description: "Registra, consulta y gestiona el catálogo de libros disponibles",
    icon: "📚",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    badge: "bg-blue-100 text-blue-700",
    tag: "CU-01",
  },
  {
    href: "/socios",
    title: "Socios",
    description: "Gestión de socios: registro, tipos (Adulto / Joven / Infantil) y estado",
    icon: "👥",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    badge: "bg-green-100 text-green-700",
    tag: "CU-02",
  },
  {
    href: "/prestamos",
    title: "Préstamos",
    description: "Realiza préstamos, registra devoluciones y consulta el historial completo",
    icon: "🔖",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    badge: "bg-purple-100 text-purple-700",
    tag: "CU-03/04",
  },
  {
    href: "/alertas",
    title: "Alertas",
    description: "Préstamos vencidos y socios con préstamos pendientes por devolver",
    icon: "🚨",
    color: "bg-red-50 border-red-200 hover:border-red-400",
    badge: "bg-red-100 text-red-700",
    tag: "CU-05",
  },
];

export default function HomePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          📖 Biblioteca Comunitaria
        </h1>
        <p className="text-zinc-500 mt-2">
          Sistema de Gestión — Programación Avanzada 2026A · CORHUILA
        </p>
      </div>

      {/* Diagrama de arquitectura */}
      <div className="mb-8 p-5 bg-white rounded-xl border border-zinc-200">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
          Arquitectura del Sistema
        </p>
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center text-2xl">👤</div>
            <span className="text-xs text-zinc-500 font-medium">Usuario</span>
            <span className="text-xs text-zinc-400">clic evento</span>
          </div>
          <div className="text-zinc-400 text-lg">→</div>
          <div className="flex flex-col items-center gap-1">
            <div className="px-4 py-3 bg-zinc-900 text-white rounded-lg text-xs font-mono text-center">
              <div className="font-bold">▲ Frontend</div>
              <div className="text-zinc-400 mt-1">page.tsx</div>
              <div className="text-zinc-400">useState/useEffect</div>
              <div className="text-blue-400 mt-1">:3000</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 text-xs text-zinc-400">
            <span>fetch()</span>
            <span>→</span>
            <span>JSON</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs font-mono text-center">
              <div className="font-bold text-yellow-700">lib/api.ts</div>
              <div className="text-zinc-400">HTTP Client</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 text-xs text-zinc-400">
            <span>POST /libros</span>
            <span>→</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="px-4 py-3 bg-red-50 border-2 border-red-300 rounded-lg text-xs font-mono text-center">
              <div className="font-bold text-red-700">🔴 Backend</div>
              <div className="text-zinc-500 mt-1">Controller</div>
              <div className="text-zinc-500">↓ Service</div>
              <div className="text-zinc-500">↓ Prisma</div>
              <div className="text-blue-500 mt-1">:3001</div>
            </div>
          </div>
          <div className="text-zinc-400 text-xs">SQL →</div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-300 flex items-center justify-center text-2xl">🐘</div>
            <span className="text-xs text-zinc-500 font-medium">PostgreSQL</span>
            <span className="text-xs text-zinc-400">:5432</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-green-600 font-mono">
          ← Respuesta JSON: {"{ id: 1, titulo: \"Don Quijote\"... }"}
        </div>
      </div>

      {/* Módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className={`block p-5 rounded-xl border-2 transition-all group ${mod.color}`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{mod.icon}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${mod.badge}`}>
                {mod.tag}
              </span>
            </div>
            <h2 className="font-semibold text-zinc-800 group-hover:text-zinc-900 mb-1">
              {mod.title}
            </h2>
            <p className="text-sm text-zinc-500">{mod.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
