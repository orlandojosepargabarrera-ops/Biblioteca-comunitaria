[README.md](https://github.com/user-attachments/files/27409896/README.md)
# 📚 Biblioteca Comunitaria — Sistema Full-Stack

Aplicación web full-stack para que una biblioteca comunitaria catalogue sus libros, gestione sus socios, registre préstamos y devoluciones, y emita alertas de devoluciones vencidas.

Arquitectura en capas con **desacople de responsabilidades**, orquestada por **Docker Compose**:

```
Controller  →  Service  →  Repository  →  Prisma (PostgreSQL)
             (DTO · Entity · Mapper)
```

- **Controller**: recibe las peticiones HTTP.
- **Service**: contiene la lógica de negocio.
- **Repository**: única capa que conoce a Prisma.
- **DTO**: valida la entrada.
- **Entity**: representa el dominio.
- **Mapper**: transforma datos entre capas.

---

## 🧱 Stack tecnológico

| Capa        | Tecnología                                |
|-------------|-------------------------------------------|
| Backend     | Node.js 20 · NestJS 10 · TypeScript       |
| ORM         | Prisma 5                                  |
| Base datos  | PostgreSQL 16                             |
| Frontend    | React 18 · Vite · TypeScript              |
| Orquestador | Docker Compose                            |

---

## 📁 Estructura del proyecto

```
biblioteca-comunitaria/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── prisma/           ← PrismaService
│       ├── libros/           ← CU-01
│       │   ├── dto/          ← validación de entrada
│       │   ├── entities/     ← dominio
│       │   ├── mappers/      ← transformaciones
│       │   ├── libros.controller.ts
│       │   ├── libros.service.ts
│       │   └── libros.repository.ts
│       ├── socios/           ← CU-02
│       └── prestamos/        ← CU-03, CU-04, CU-05
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── api/              ← cliente HTTP y tipos
        ├── pages/            ← pantallas (Libros, Socios, Préstamos, Alertas)
        └── styles/
```

---

## 🚀 Cómo ejecutar el proyecto

### Requisitos

- Docker Desktop (Mac / Windows) o Docker Engine + Compose (Linux)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-de-tu-repo>
cd biblioteca-comunitaria

# 2. Levantar todo con Docker Compose
docker compose up --build
```

Al terminar, estarán disponibles:

| Servicio  | URL                      |
|-----------|--------------------------|
| Frontend  | http://localhost:5173    |
| Backend   | http://localhost:3000/api |
| Postgres  | localhost:5432 (usuario / pass `biblioteca`) |

El backend **ejecuta automáticamente** `prisma migrate deploy` y `prisma db seed` al arrancar, por lo que la base de datos queda lista con libros y socios de ejemplo.

Para detener:

```bash
docker compose down
```

Para borrar también los datos:

```bash
docker compose down -v
```

---

## 🧪 Casos de Uso implementados

| Caso de uso | Endpoint                             | Método |
|-------------|--------------------------------------|--------|
| **CU-01** Registrar libro              | `/api/libros`                         | POST   |
| Listar libros                          | `/api/libros`                         | GET    |
| Editar libro                           | `/api/libros/:id`                     | PATCH  |
| Eliminar libro                         | `/api/libros/:id`                     | DELETE |
| **CU-02** Registrar socio              | `/api/socios`                         | POST   |
| Listar socios                          | `/api/socios`                         | GET    |
| **CU-03** Realizar préstamo            | `/api/prestamos`                      | POST   |
| **CU-04** Registrar devolución         | `/api/prestamos/:id/devolver`         | PATCH  |
| **CU-05** Libros con préstamos vencidos| `/api/prestamos/vencidos`             | GET    |
| **CU-05** Socios con pendientes        | `/api/prestamos/pendientes-por-socio` | GET    |

### Ejemplos con `curl`

Registrar un libro (CU-01):

```bash
curl -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Don Quijote","autor":"Cervantes","genero":"NOVELA","isbn":"9788491050292","totalEjemplares":2}'
```

Registrar un socio (CU-02):

```bash
curl -X POST http://localhost:3000/api/socios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","apellido":"Torres","documento":"11112222","tipo":"ADULTO"}'
```

Realizar un préstamo (CU-03):

```bash
curl -X POST http://localhost:3000/api/prestamos \
  -H "Content-Type: application/json" \
  -d '{"libroId":1,"socioId":1}'
```

Registrar devolución (CU-04):

```bash
curl -X PATCH http://localhost:3000/api/prestamos/1/devolver \
  -H "Content-Type: application/json" \
  -d '{}'
```

Consultar préstamos vencidos (CU-05):

```bash
curl http://localhost:3000/api/prestamos/vencidos
```

---

## 🧠 Reglas de negocio

- **Disponibilidad automática**: al crear un préstamo se descuenta `disponibles`; al devolver, se incrementa. Todo dentro de una **transacción** Prisma para evitar inconsistencias.
- **Fecha de devolución calculada automáticamente** según el tipo de socio:
  - Adulto: 15 días.
  - Joven: 10 días.
  - Infantil: 7 días.
- **Validación de entrada** vía `class-validator` sobre los DTOs (ISBN obligatorio, tipos de socio restringidos, etc.).
- **ISBN y documento únicos**: se rechaza duplicación con `409 Conflict`.

---

## 🐳 Desarrollo local sin Docker

### Backend

```bash
cd backend
npm install
# Levanta solo la base de datos
docker compose up -d db
# Crea un .env apuntando a localhost
echo 'DATABASE_URL="postgresql://biblioteca:biblioteca@localhost:5432/biblioteca?schema=public"' > .env
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌿 Control de versiones (Git)

Flujo sugerido:

```bash
git init
git add .
git commit -m "chore: estructura inicial del proyecto"
git branch -M main
git remote add origin https://github.com/<usuario>/biblioteca-comunitaria.git
git push -u origin main
```

Convención de commits recomendada: **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).

---

## ✅ Check-list del enunciado

- [x] Backend API REST
- [x] Frontend de interfaz de usuario
- [x] Base de datos relacional
- [x] Docker Compose orquestando backend + frontend + DB
- [x] Arquitectura en capas (Controller → Service → Repository)
- [x] DTO / Entity / Mapper presentes en cada módulo
- [x] CU-01 a CU-05 implementados de extremo a extremo
