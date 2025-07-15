export interface SolicitudTurno {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  telefono: string;
  especialidad: string;
  profesional: string;
  franjaHoraria: string;
  obraSocial: string;
  fechaSolicitud: string;
  estado: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
  fechaHoraTurno?: string; // ← asegurate de tener esta propiedad
}
