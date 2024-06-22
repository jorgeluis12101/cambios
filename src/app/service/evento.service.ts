import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DatosRegistroEvento {
  veterinaria: string;
  descripcion: string;
  costo: string;
  tipoEvento: string;
  archivo: string;
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
  fechaComplemento?: string;
}

export interface DatosDetallesEvento {
  eventoId: string; // Asegúrate de que eventoId está presente
  fecha: string;
  veterinaria: string;
  descripcion: string;
  costo: string;
  tipoEvento: string;
  archivo: string;
  nombreMascota: string;
  complemento?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = 'http://localhost:8080/api/v1/evento';

  constructor(private http: HttpClient) {}

  obtenerEventos(nombreMascota: string): Observable<DatosDetallesEvento[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('nombreMascota', nombreMascota);
    return this.http.get<DatosDetallesEvento[]>(`${this.apiUrl}/listar`, { headers, params });
  }

  registrarEvento(evento: DatosRegistroEvento): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.apiUrl}/registrar`, evento, { headers });
  }

  eliminarEvento(eventoId: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/eliminar`, { headers, body: { eventoId } });
  }

  actualizarFechaEvento(eventoId: string, nuevaFecha: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<void>(`${this.apiUrl}/actualizar-fecha`, { eventoId, nuevaFecha }, { headers });
  }
}
