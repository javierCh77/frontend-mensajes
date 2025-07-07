import { Servicio } from "./servicio";

export interface Profesional {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  matricula: string;
  servicio: Servicio;
}

export interface ProfesionalInput {
  nombre: string;
  apellido: string;
  dni: string;
  matricula: string;
  servicioId: string; // solo el id
}
