// types/servicio.ts

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
}

export type ServicioInput = Omit<Servicio, "id">;
