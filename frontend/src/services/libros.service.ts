import { api } from "@/lib/api";

export type Genero =
  | "NOVELA" | "CUENTO" | "POESIA" | "ENSAYO"
  | "INFANTIL" | "HISTORIA" | "CIENCIA"
  | "TECNOLOGIA" | "AUTOAYUDA" | "OTRO";

export const GENEROS: Genero[] = [
  "NOVELA","CUENTO","POESIA","ENSAYO",
  "INFANTIL","HISTORIA","CIENCIA",
  "TECNOLOGIA","AUTOAYUDA","OTRO",
];

export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: Genero;
  isbn: string;
  totalEjemplares: number;
  disponibles: number;
  creadoEn: string;
}

export type CreateLibroDto = Omit<Libro, "id" | "disponibles" | "creadoEn">;
export type UpdateLibroDto = Partial<CreateLibroDto>;

export const librosService = {
  findAll:  ()                              => api.get<Libro[]>("/libros"),
  findOne:  (id: number)                   => api.get<Libro>(`/libros/${id}`),
  create:   (data: CreateLibroDto)          => api.post<Libro>("/libros", data),
  update:   (id: number, data: UpdateLibroDto) => api.patch<Libro>(`/libros/${id}`, data),
  remove:   (id: number)                   => api.delete<void>(`/libros/${id}`),
};
