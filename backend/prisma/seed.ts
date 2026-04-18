import { PrismaClient, Genero, TipoSocio } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Sembrando datos iniciales...');

  // Libros de ejemplo
  const libros = [
    { titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', genero: Genero.NOVELA, isbn: '9780307474728', totalEjemplares: 3, disponibles: 3 },
    { titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', genero: Genero.INFANTIL, isbn: '9780156012195', totalEjemplares: 5, disponibles: 5 },
    { titulo: 'Sapiens: De animales a dioses', autor: 'Yuval Noah Harari', genero: Genero.HISTORIA, isbn: '9788499926223', totalEjemplares: 2, disponibles: 2 },
    { titulo: 'Rayuela', autor: 'Julio Cortázar', genero: Genero.NOVELA, isbn: '9788437604572', totalEjemplares: 2, disponibles: 2 },
    { titulo: 'Veinte poemas de amor', autor: 'Pablo Neruda', genero: Genero.POESIA, isbn: '9788497595612', totalEjemplares: 4, disponibles: 4 },
  ];

  for (const libro of libros) {
    await prisma.libro.upsert({
      where: { isbn: libro.isbn },
      update: {},
      create: libro,
    });
  }

  // Socios de ejemplo
  const socios = [
    { nombre: 'María', apellido: 'López', documento: '12345678', telefono: '3001112233', email: 'maria@mail.com', direccion: 'Cra 10 #20-30', tipo: TipoSocio.ADULTO },
    { nombre: 'Carlos', apellido: 'Pérez', documento: '87654321', telefono: '3002223344', email: 'carlos@mail.com', direccion: 'Cll 50 #40-10', tipo: TipoSocio.ADULTO },
    { nombre: 'Sofía', apellido: 'Ramírez', documento: '55667788', telefono: '3003334455', email: 'sofia@mail.com', direccion: 'Cra 7 #15-20', tipo: TipoSocio.JOVEN },
    { nombre: 'Andrés', apellido: 'Gómez', documento: '99887766', telefono: '3004445566', email: 'andres@mail.com', direccion: 'Cll 80 #30-12', tipo: TipoSocio.INFANTIL },
  ];

  for (const socio of socios) {
    await prisma.socio.upsert({
      where: { documento: socio.documento },
      update: {},
      create: socio,
    });
  }

  console.log('Datos sembrados correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
