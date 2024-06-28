import { Component, OnInit } from '@angular/core';
import { MascotaService } from '../../service/mascota.service';
import { Mascota } from '../../modelos/mascota';
import { Router } from '@angular/router';
import { EventoService } from '../../service/evento.service';

@Component({
  selector: 'app-lista-mascota',
  templateUrl: './lista-mascota.component.html',
  styleUrls: ['./lista-mascota.component.css']
})
export class ListaMascotaComponent implements OnInit {
  mascotas: Mascota[] = [];
  cantidadMascotas: number = 0;
  estadosMascotas: { [nombreMascota: string]: string } = {};
  eventosMascotas: { [nombreMascota: string]: number } = {}; // Nuevo campo para almacenar la cantidad de eventos
  estadoGeneral: string = 'Neutral';
  estadoGeneralImg: string = 'assets/perroNeutral.jpg'; 

  constructor(
    private mascotaService: MascotaService,
    private eventoService: EventoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.mascotaService.listarMascotas().subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
        this.cantidadMascotas = mascotas.length;
        this.establecerEstadosMascotas();
      },
      error: (error) => console.error('Error al obtener las mascotas:', error.message)
    });
  }

  establecerEstadosMascotas() {
    const totalMascotas = this.mascotas.length;
    let processedMascotas = 0;

    this.mascotas.forEach((mascota) => {
      this.eventoService.obtenerEventos(mascota.nombreMascota).subscribe({
        next: (eventos) => {
          const numeroEventos = eventos.length;
          this.eventosMascotas[mascota.nombreMascota] = numeroEventos; // Almacenar la cantidad de eventos
          this.estadosMascotas[mascota.nombreMascota] = this.obtenerEstadoMascota(numeroEventos);
          processedMascotas++;

          if (processedMascotas === totalMascotas) {
            this.calcularEstadoGeneral();
          }
        },
        error: (error) => console.error(`Error al obtener los eventos de la mascota ${mascota.nombreMascota}:`, error.message)
      });
    });
  }

  obtenerEstadoMascota(numeroEventos: number): string {
    if (numeroEventos >= 10) {
      return 'Feliz';
    } else if (numeroEventos >= 1) {
      return 'Neutral';
    } else {
      return 'Triste';
    }
  }

  calcularEstadoGeneral() {
    const estados = Object.values(this.estadosMascotas);
    const conteo = { Feliz: 0, Neutral: 0, Triste: 0 };

    estados.forEach(estado => {
      if (estado === 'Feliz') conteo.Feliz++;
      if (estado === 'Neutral') conteo.Neutral++;
      if (estado === 'Triste') conteo.Triste++;
    });

    const totalMascotas = estados.length;
    const media = (conteo.Feliz * 3 + conteo.Neutral * 1) / totalMascotas;

    if (media >= 2.5) {
      this.estadoGeneral = 'Feliz';
      this.estadoGeneralImg = 'assets/perroFeliz.jpg'; 
    } else if (media >= 0.5) {
      this.estadoGeneral = 'Neutral';
      this.estadoGeneralImg = 'assets/perroNeutral.jpg';
    } else {
      this.estadoGeneral = 'Triste';
      this.estadoGeneralImg = 'assets/perroTriste.jpg';
    }
  }

  agregarMascota() {
    this.router.navigate(['/intranet/user']);
  }

  editarMascota(mascotaId: number) {
    if (mascotaId !== undefined) {
      this.router.navigate(['/intranet/user/editar-mascota', mascotaId]);
    } else {
      console.error('ID de mascota no definido');
    }
  }
}
