import { Raza } from "./raza";

export interface Mascota {
    id: number;
    nombreMascota: string;
    fechaNacimiento: Date;
    peso: number;
    alimentacion: string;
    color: string;
    detalles: string;
    raza: Raza;
    fotoMascota?: string;
  }
