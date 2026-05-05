import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biblioteca Comunitaria",
  description: "Sistema de Gestión — Biblioteca Comunitaria CORHUILA",
};

const navLinks = [
  { href: "/",          label: "🏠 Inicio" },
  { href: "/libros",    label: "📚 Libros" },
  { href: "/socios",    label: "👥 Socios" },
  { href: "/prestamos", label: "🔖 Préstamos" },
  { href: "/alertas",   label: "🚨 Alertas" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-zinc-900 text-white flex flex-col shrink-0">
          <div className="p-4 border-b border-zinc-700">
            <h1 className="text-sm font-bold text-zinc-100 leading-tight">
              📖 Biblioteca Comunitaria
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Programación Avanzada — CORHUILA
            </p>
          </div>

          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center px-3 py-2 rounded-md text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Diagrama arquitectura resumido */}
          <div className="mx-3 mb-3 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <p className="text-xs text-zinc-400 font-semibold mb-2">Arquitectura</p>
            <div className="text-xs text-zinc-500 space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">👤</span>
                <span>Usuario</span>
              </div>
              <div className="pl-2 text-zinc-600">↓ evento</div>
              <div className="flex items-center gap-1">
                <span className="text-blue-400">▲</span>
                <span className="text-zinc-400">Frontend :3000</span>
              </div>
              <div className="pl-2 text-zinc-600">↓ fetch() JSON</div>
              <div className="flex items-center gap-1">
                <span className="text-red-400">🔴</span>
                <span className="text-zinc-400">Backend :3001</span>
              </div>
              <div className="pl-2 text-zinc-600">↓ SQL</div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">🐘</span>
                <span className="text-zinc-400">PostgreSQL :5432</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-zinc-700">
            <p className="text-xs text-zinc-500">CORHUILA 2026A ✅</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-zinc-50">{children}</main>
      </body>
    </html>
  );
}
