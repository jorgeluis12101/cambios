import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DatosRegistroEvento {
  veterinaria: string;
  descripcion: string;
  costo: string;
  tipoEvento: string;
  archivo: string | null;
  nombreMascota: string;
  tipoMascota: string;
  fecha: string;
  nombreComplemento?: string;
  descripcionComplemento?: string;
  tipoComplemento?: string;
  fabricante?: string;
  lote?: string;
  dosis?: string;
  frecuencia?: string;
  fechaComplemento?: string; // Nuevo campo
}

export interface Evento {
  id: number;
  veterinaria: string;
  descripcion: string;
  costo: string;
  tipoEvento: string;
  archivo: string | null;
  nombreMascota: string;
  tipoMascota: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = 'http://localhost:8080/api/v1/evento';

  constructor(private http: HttpClient) {}

  registrarEvento(eventData: DatosRegistroEvento): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, eventData);
  }

  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/listar`);
  }

  eliminarEvento(eventoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar/${eventoId}`);
  }

  actualizarFechaEvento(eventoId: number, nuevaFecha: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar-fecha/${eventoId}`, { fecha: nuevaFecha });
  }
}
