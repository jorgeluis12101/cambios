import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class RazaService {
  private apiUrl = `${baserUrl}/api/v1/razas`;

  constructor(private http: HttpClient) { }

  buscarRazas(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar?nombre=${nombre}`);
  }
}
