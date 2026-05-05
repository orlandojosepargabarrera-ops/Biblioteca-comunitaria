# 📖 Biblioteca Comunitaria — Frontend

Frontend en **Next.js 16** + **Tailwind CSS v4** + **TypeScript** conectado al backend NestJS de Biblioteca Comunitaria.

## Arquitectura

```
Usuario → Frontend (:3000) → lib/api.ts → Backend (:3001) → PostgreSQL (:5432)
```

## Módulos

| Ruta          | Descripción                               | Caso de Uso |
|---------------|-------------------------------------------|-------------|
| `/libros`     | CRUD de libros (título, autor, género, ISBN, ejemplares) | CU-01 |
| `/socios`     | CRUD de socios (Adulto / Joven / Infantil) | CU-02 |
| `/prestamos`  | Crear préstamos y registrar devoluciones  | CU-03/04    |
| `/alertas`    | Préstamos vencidos y socios con pendientes | CU-05      |

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar NEXT_PUBLIC_API_URL si el backend no está en localhost:3001

# 3. Correr en desarrollo
npm run dev
# → http://localhost:3000
```

## Con Docker

```bash
docker build -t biblioteca-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:3001 biblioteca-frontend
```

## Variables de entorno

| Variable                | Default                    | Descripción              |
|-------------------------|----------------------------|--------------------------|
| `NEXT_PUBLIC_API_URL`   | `http://localhost:3001`    | URL base del backend     |

## Estructura

```
src/
├── app/
│   ├── layout.tsx          # Sidebar + layout principal
│   ├── page.tsx            # Dashboard / Inicio
│   ├── libros/page.tsx     # Gestión de libros
│   ├── socios/page.tsx     # Gestión de socios
│   ├── prestamos/page.tsx  # Préstamos y devoluciones
│   └── alertas/page.tsx    # Alertas y vencidos
├── lib/
│   └── api.ts              # Cliente HTTP centralizado (fetch wrapper)
└── services/
    ├── libros.service.ts
    ├── socios.service.ts
    ├── prestamos.service.ts
    └── index.ts
```
