-- CreateEnum
CREATE TYPE "Genero" AS ENUM (
  'NOVELA', 'CUENTO', 'POESIA', 'ENSAYO', 'INFANTIL',
  'HISTORIA', 'CIENCIA', 'TECNOLOGIA', 'AUTOAYUDA', 'OTRO'
);

-- CreateEnum
CREATE TYPE "TipoSocio" AS ENUM ('ADULTO', 'JOVEN', 'INFANTIL');

-- CreateEnum
CREATE TYPE "EstadoPrestamo" AS ENUM ('ACTIVO', 'DEVUELTO');

-- CreateTable
CREATE TABLE "Libro" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "genero" "Genero" NOT NULL,
    "isbn" TEXT NOT NULL,
    "totalEjemplares" INTEGER NOT NULL DEFAULT 1,
    "disponibles" INTEGER NOT NULL DEFAULT 1,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Libro_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Libro_isbn_key" ON "Libro"("isbn");

-- CreateTable
CREATE TABLE "Socio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "tipo" "TipoSocio" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Socio_documento_key" ON "Socio"("documento");
CREATE UNIQUE INDEX "Socio_email_key" ON "Socio"("email");

-- CreateTable
CREATE TABLE "Prestamo" (
    "id" SERIAL NOT NULL,
    "libroId" INTEGER NOT NULL,
    "socioId" INTEGER NOT NULL,
    "fechaPrestamo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaDevolucion" TIMESTAMP(3) NOT NULL,
    "fechaDevuelto" TIMESTAMP(3),
    "estado" "EstadoPrestamo" NOT NULL DEFAULT 'ACTIVO',
    "observaciones" TEXT,
    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Prestamo_estado_idx" ON "Prestamo"("estado");
CREATE INDEX "Prestamo_libroId_idx" ON "Prestamo"("libroId");
CREATE INDEX "Prestamo_socioId_idx" ON "Prestamo"("socioId");

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_libroId_fkey"
  FOREIGN KEY ("libroId") REFERENCES "Libro"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_socioId_fkey"
  FOREIGN KEY ("socioId") REFERENCES "Socio"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
