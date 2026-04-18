# 🚀 Guía paso a paso para probar el proyecto (sin saber programar)

Esta guía está pensada para alguien que **nunca ha programado**. Vas a poder ver el sistema funcionando en tu propio computador en menos de 30 minutos, y también subirlo a GitHub para compartirlo.

Solo tienes que seguir los pasos en orden. ✅

---

## 📋 Lo que vas a lograr

1. Instalar dos programas gratuitos: **Docker Desktop** y **Git**.
2. Descargar el proyecto.
3. Ejecutarlo con un solo comando.
4. Abrir la aplicación en tu navegador y probar los 5 casos de uso.
5. Subir el proyecto a **GitHub** para compartirlo.

---

## PARTE 1 — Instalar los programas necesarios

### 1.1 Instalar Docker Desktop (es el que hace toda la magia)

Docker va a montar la base de datos, el backend y el frontend por ti. Sin que tengas que instalar nada más.

1. Entra a 👉 https://www.docker.com/products/docker-desktop/
2. Descarga la versión para tu sistema operativo:
   - **Windows** → "Download for Windows"
   - **Mac** → elige "Apple Chip" si tu Mac es M1/M2/M3, o "Intel Chip" si es más antiguo
3. Abre el archivo descargado y sigue el instalador (Siguiente → Siguiente → Finalizar).
4. Abre **Docker Desktop** y espera a que diga "**Docker Desktop is running**" (una ballena 🐳 aparecerá en tu barra de tareas).

> ⚠️ En Windows puede pedirte activar **WSL 2**. El instalador te guía, solo acepta.

### 1.2 Instalar Git (sirve para subir el proyecto a GitHub)

1. Entra a 👉 https://git-scm.com/downloads
2. Descarga la versión para tu sistema operativo e instálala con las opciones por defecto.

### 1.3 (Opcional, pero recomendado) Instalar GitHub Desktop

Esta es la opción **más fácil** para subir tu proyecto a GitHub sin usar la terminal:

1. Entra a 👉 https://desktop.github.com
2. Descarga e instala.
3. La primera vez te pedirá iniciar sesión con tu cuenta de GitHub (si no tienes, la creas en el paso 4.1).

---

## PARTE 2 — Descargar el proyecto

Tienes el proyecto en una carpeta llamada `biblioteca-comunitaria`. Si lo tienes como ZIP, descomprímelo en un lugar fácil de encontrar, por ejemplo:

- **Windows:** `C:\Users\TuNombre\Documentos\biblioteca-comunitaria`
- **Mac:** `/Users/TuNombre/Documents/biblioteca-comunitaria`

---

## PARTE 3 — Ejecutar el proyecto

### 3.1 Abrir la terminal en la carpeta del proyecto

**En Windows:**
1. Abre la carpeta `biblioteca-comunitaria` en el Explorador de Archivos.
2. Haz clic en la barra de dirección arriba, borra el texto y escribe `cmd`, luego presiona **Enter**. Se abrirá una ventana negra (la terminal).

**En Mac:**
1. Abre **Terminal** (la buscas con Cmd + Espacio → escribe "Terminal" → Enter).
2. Escribe `cd ` (con un espacio al final), luego **arrastra la carpeta `biblioteca-comunitaria`** a la terminal y presiona **Enter**.

### 3.2 Levantar todo con un solo comando

En esa terminal, escribe y presiona Enter:

```bash
docker compose up --build
```

✨ La primera vez va a tardar **entre 5 y 10 minutos** porque descarga todo lo necesario. Verás mucho texto pasando por la pantalla. Eso es normal.

👉 Sabrás que terminó cuando veas un mensaje como:

```
biblioteca_backend   | 🚀 API Biblioteca corriendo en http://localhost:3000/api
```

### 3.3 Abrir la aplicación en el navegador

Abre Chrome, Edge o tu navegador favorito y entra a:

### 👉 http://localhost:5173

Deberías ver la aplicación **"📚 Biblioteca Comunitaria"** con 4 pestañas:

| Pestaña | Qué hace |
|---------|----------|
| **Libros** | Registrar y ver los libros del catálogo (CU-01) |
| **Socios** | Registrar y ver los socios (CU-02) |
| **Préstamos** | Crear préstamos y registrar devoluciones (CU-03 y CU-04) |
| **Alertas** | Ver préstamos vencidos y socios con pendientes (CU-05) |

### 3.4 Cómo probar cada caso de uso

**CU-01 · Registrar un libro**
1. Ve a la pestaña "Libros".
2. Llena el formulario (título, autor, género, ISBN, cantidad).
3. Clic en "Guardar libro".
4. Aparecerá en la tabla de abajo.

**CU-02 · Registrar un socio**
1. Ve a "Socios".
2. Llena el formulario. Elige tipo: **ADULTO**, **JOVEN** o **INFANTIL**.
3. Clic en "Guardar socio".

**CU-03 · Realizar un préstamo**
1. Ve a "Préstamos".
2. Elige un libro de la lista (solo verás los disponibles).
3. Elige un socio.
4. Clic en "Prestar". El sistema calcula automáticamente la fecha de devolución según el tipo de socio.

**CU-04 · Registrar una devolución**
1. Dentro de "Préstamos", busca el préstamo en la tabla.
2. Clic en el botón "Devolver (CU-04)".
3. La disponibilidad del libro se actualiza sola. ✅

**CU-05 · Ver alertas de vencidos**
1. Ve a "Alertas".
2. Verás dos tablas: préstamos vencidos y socios con devoluciones pendientes.

> 💡 Para probar un "vencido" rápido: al crear un préstamo, pon manualmente "Días: 0" en el campo opcional. Luego refresca "Alertas".

### 3.5 Apagar el sistema cuando termines

Vuelve a la terminal donde sale el texto verde y presiona **Ctrl + C** (en Mac: Control + C).
Luego, si quieres borrar todo (incluyendo los datos):

```bash
docker compose down -v
```

---

## PARTE 4 — Subir el proyecto a GitHub

### 4.1 Crear una cuenta de GitHub (si no tienes)

1. Entra a 👉 https://github.com/signup
2. Completa el formulario con tu correo, una contraseña y un nombre de usuario.
3. Confirma tu correo.

### 4.2 Crear un repositorio en GitHub

1. En la esquina superior derecha, clic en el **+** → **New repository**.
2. Dale un nombre, por ejemplo: `biblioteca-comunitaria`.
3. Déjalo en **Public** (así todos pueden verlo) o **Private** si prefieres.
4. ⚠️ **NO marques** "Add a README file" (ya tienes uno).
5. Clic en **Create repository**.

Verás una página con instrucciones. **No las cierres todavía.** Te muestro las dos formas de subir el código:

---

### ✅ Opción A (más fácil): con GitHub Desktop

1. Abre **GitHub Desktop**.
2. Arriba a la izquierda: **File → Add local repository**.
3. Selecciona la carpeta `biblioteca-comunitaria`.
4. Si te dice "This directory does not appear to be a Git repository", clic en **"create a repository"**.
5. Deja todo como está y clic en **Create repository**.
6. Abajo a la izquierda, escribe un mensaje como *"Primera versión"* y clic en **Commit to main**.
7. Arriba: clic en **Publish repository**. Elige el nombre (ya creado) y confirma.

🎉 ¡Listo! Tu proyecto está en GitHub. Ve a `https://github.com/tu-usuario/biblioteca-comunitaria` para verlo.

---

### 🧑‍💻 Opción B (con terminal / comandos)

En la terminal, estando **dentro** de la carpeta `biblioteca-comunitaria`:

```bash
# 1. Configura tu nombre y correo (solo la primera vez en tu vida)
git config --global user.name "Tu Nombre"
git config --global user.email "tu_correo@ejemplo.com"

# 2. Inicia git dentro de la carpeta
git init

# 3. Agrega todos los archivos
git add .

# 4. Guarda el primer commit
git commit -m "Primera versión de la biblioteca comunitaria"

# 5. Renombra la rama principal a main
git branch -M main

# 6. Conecta tu carpeta con el repositorio de GitHub
# ⚠️ Reemplaza TU_USUARIO por tu usuario real de GitHub
git remote add origin https://github.com/TU_USUARIO/biblioteca-comunitaria.git

# 7. Súbelo
git push -u origin main
```

Si es la primera vez, GitHub te pedirá autenticarte. Sigue las instrucciones (te puede pedir iniciar sesión con tu navegador o crear un **Personal Access Token** — te lo explica la misma página).

---

## 🆘 Problemas comunes y cómo resolverlos

| Problema | Solución |
|----------|----------|
| **Docker dice "port already in use"** | Otro programa está usando los puertos 3000, 5173 o 5432. Cierra Skype, otros contenedores, o reinicia el computador. |
| **El navegador no carga http://localhost:5173** | Espera 1–2 minutos, a veces el frontend tarda en arrancar. Revisa en la terminal que no haya errores en rojo. |
| **"Cannot connect to the Docker daemon"** | Abre Docker Desktop y espera a que diga "Docker Desktop is running". |
| **Comando `docker compose` no existe** | Instala Docker Desktop (paso 1.1). Si tienes una versión antigua, usa `docker-compose` (con guion). |
| **Todo se ve en blanco en el navegador** | Abre la consola del navegador (F12 → pestaña Console). Si hay un error de CORS, revisa que el backend esté corriendo en el puerto 3000. |

---

## 🎓 ¿Qué sigue?

Una vez que esté en GitHub:

- Puedes **compartir el enlace** con tu equipo o profesor.
- Puedes **editar el README** en GitHub directamente para personalizarlo.
- Puedes **clonarlo en otro computador** con `git clone https://github.com/TU_USUARIO/biblioteca-comunitaria.git`.
- Puedes **hacer cambios** y subirlos con estos comandos:

```bash
git add .
git commit -m "Describe qué cambiaste"
git push
```

---

¡Listo! Si llegaste hasta aquí, ya tienes una aplicación web full-stack profesional funcionando en tu máquina y publicada en GitHub. 🎉
