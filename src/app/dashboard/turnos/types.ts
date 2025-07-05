export interface Profesional {
  id: string;
  nombre: string;
  apellido: string;
  servicio?: {
    nombre: string;
  };
}

export interface Turno {
  id: string;
  fecha: string;
  estado: string;
  motivoConsulta: string | null;
  cronogramaId: string;
  paciente: {
    nombre: string;
    apellido: string;
  };
}

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni:number;
}
