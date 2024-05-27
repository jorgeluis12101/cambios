import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baserUrl from './helper';

export interface DatosRegistroEvento {
  veterinaria: string;
  descripcion: string;
  costo: string;
  tipoEvento: string;
  archivo: string | null; // Base64 string
  mascotaId: number;
  fecha: string;
}

export interface Evento {
  id: number;
  veterinaria: string;
  descripcion: string;
  costo: string;
  tipoEvento: string;
  archivo: string;
  fecha: string; // La fecha debe estar en formato ISO
  mascotaId: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = `${baserUrl}/api/v1/evento`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  registrarEvento(evento: DatosRegistroEvento): Observable<any> {
    console.log('Registrar Evento - Datos enviados:', evento); // Mensaje de depuración
    return this.http.post(`${this.apiUrl}/registrar`, evento, { headers: this.getAuthHeaders() });
  }

  obtenerEventos(): Observable<Evento[]> {
    console.log('Obtener Eventos - Solicitando eventos del usuario...'); // Mensaje de depuración
    return this.http.get<Evento[]>(`${this.apiUrl}/listar`, { headers: this.getAuthHeaders() });
  }

  eliminarEvento(eventoId: number): Observable<any> {
    console.log('Eliminar Evento - ID:', eventoId);
    return this.http.delete(`${this.apiUrl}/eliminar/${eventoId}`, { headers: this.getAuthHeaders() });
  }


  actualizarFechaEvento(eventoId: number, nuevaFecha: string): Observable<any> {
    const datos = { fecha: nuevaFecha }; // Enviar un objeto con la clave "fecha"
    return this.http.put(`${this.apiUrl}/actualizar-fecha/${eventoId}`, datos, { headers: this.getAuthHeaders() });
  }
}
