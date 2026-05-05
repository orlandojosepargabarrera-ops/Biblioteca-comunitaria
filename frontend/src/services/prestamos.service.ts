import { api } from "@/lib/api";
import type { Libro } from "./libros.service";
import type { Socio } from "./socios.service";

export type EstadoPrestamo = "ACTIVO" | "DEVUELTO";

export interface Prestamo {
  id: number;
  libroId: number;
  socioId: number;
  fechaPrestamo: string;
  fechaDevolucion: string;
  fechaDevuelto?: string;
  estado: EstadoPrestamo;
  observaciones?: string;
  libro?: Libro;
  socio?: Socio;
}

export interface CreatePrestamoDto {
  libroId: number;
  socioId: number;
  diasPrestamo?: number;
  observaciones?: string;
}

export interface DevolverPrestamoDto {
  observaciones?: string;
}

export interface SocioConPendientes {
  socio: Socio;
  prestamosActivos: number;
}

export const prestamosService = {
  findAll:            ()                              => api.get<Prestamo[]>("/prestamos"),
  findOne:            (id: number)                   => api.get<Prestamo>(`/prestamos/${id}`),
  create:             (data: CreatePrestamoDto)       => api.post<Prestamo>("/prestamos", data),
  devolver:           (id: number, data: DevolverPrestamoDto) =>
                        api.patch<Prestamo>(`/prestamos/${id}/devolver`, data),
  vencidos:           ()                              => api.get<Prestamo[]>("/prestamos/vencidos"),
  pendientesPorSocio: ()                              => api.get<SocioConPendientes[]>("/prestamos/pendientes-por-socio"),
};
