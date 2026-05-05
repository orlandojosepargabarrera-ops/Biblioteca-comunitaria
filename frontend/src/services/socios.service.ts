import { api } from "@/lib/api";

export type TipoSocio = "ADULTO" | "JOVEN" | "INFANTIL";
export const TIPOS_SOCIO: TipoSocio[] = ["ADULTO", "JOVEN", "INFANTIL"];

export interface Socio {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  tipo: TipoSocio;
  activo: boolean;
  creadoEn: string;
}

export type CreateSocioDto = Omit<Socio, "id" | "activo" | "creadoEn">;
export type UpdateSocioDto = Partial<CreateSocioDto>;

export const sociosService = {
  findAll:  ()                              => api.get<Socio[]>("/socios"),
  findOne:  (id: number)                   => api.get<Socio>(`/socios/${id}`),
  create:   (data: CreateSocioDto)          => api.post<Socio>("/socios", data),
  update:   (id: number, data: UpdateSocioDto) => api.patch<Socio>(`/socios/${id}`, data),
  remove:   (id: number)                   => api.delete<void>(`/socios/${id}`),
};
