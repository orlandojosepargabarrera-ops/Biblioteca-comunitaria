export type Genero =
  | 'NOVELA'
  | 'CUENTO'
  | 'POESIA'
  | 'ENSAYO'
  | 'INFANTIL'
  | 'HISTORIA'
  | 'CIENCIA'
  | 'TECNOLOGIA'
  | 'AUTOAYUDA'
  | 'OTRO';

export type TipoSocio = 'ADULTO' | 'JOVEN' | 'INFANTIL';

export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: Genero;
  isbn: string;
  totalEjemplares: number;
  disponibles: number;
  estaDisponible: boolean;
}

export interface Socio {
  id: number;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  documento: string;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  tipo: TipoSocio;
  activo: boolean;
  diasPrestamoPermitidos: number;
}

export interface Prestamo {
  id: number;
  libroId: number;
  socioId: number;
  fechaPrestamo: string;
  fechaDevolucion: string;
  fechaDevuelto: string | null;
  estado: 'ACTIVO' | 'DEVUELTO';
  observaciones: string | null;
  estaVencido: boolean;
  diasDeAtraso: number;
  libro?: { id: number; titulo: string; autor: string; isbn: string };
  socio?: { id: number; nombre: string; apellido: string; documento: string };
}
