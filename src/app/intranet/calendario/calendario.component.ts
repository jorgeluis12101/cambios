import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput, EventDropArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { MatDialog } from '@angular/material/dialog';
import { DatosRegistroEvento, EventoService, DatosDetallesEvento } from 'src/app/service/evento.service';
import { EventModalComponent, EventData } from '../event-modal/event-modal.component';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  calendarVisible = true;
  isExpanded = false;
  mascotas: string[] = [];
  currentEvents: EventInput[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    locales: [esLocale],
    locale: 'es',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: this.currentEvents,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    eventMouseLeave: this.handleEventMouseLeave.bind(this),
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private eventoService: EventoService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getMascotasFromToken();
  }

  getMascotasFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token encontrado:', token);
      const decoded: any = jwtDecode(token);
      console.log('Token decodificado:', decoded);
      this.mascotas = decoded.mascotas || [];
      console.log('Lista de mascotas obtenida del token:', this.mascotas);
      this.cargarEventos();
    } else {
      console.error('No se encontró ningún token en localStorage');
    }
  }

  cargarEventos() {
    if (this.mascotas.length === 0) {
      console.error('No hay mascotas disponibles');
      return;
    }

    this.currentEvents = [];

    this.mascotas.forEach((nombreMascota) => {
      this.eventoService.obtenerEventos(nombreMascota).subscribe(
        (eventos: DatosDetallesEvento[]) => {
          const calendarEvents: EventInput[] = eventos.map(evento => ({
            id: evento.eventoId, // Asegúrate de usar eventoId
            title: `${evento.tipoEvento} - ${evento.veterinaria} - ${evento.nombreMascota}`,
            start: evento.fecha,
            end: evento.fecha,
            allDay: true,
            extendedProps: {
              descripcion: evento.descripcion,
              costo: evento.costo,
              archivo: evento.archivo,
              complemento: evento.complemento
            }
          }));
          this.currentEvents = [...this.currentEvents, ...calendarEvents];
          this.calendarOptions.events = this.currentEvents;
          this.changeDetector.detectChanges();
        },
        (error) => {
          console.error('Error al cargar los eventos', error);
        }
      );
    });
  }

  handleEventDrop(eventDropInfo: EventDropArg) {
    const eventoId = eventDropInfo.event.id;
    const nuevaFecha = eventDropInfo.event.startStr;

    if (!eventoId) {
      console.error('El evento no tiene ID:', eventDropInfo.event);
      return;
    }

    console.log(`Actualizando evento con ID ${eventoId} a la nueva fecha ${nuevaFecha}`);
    this.eventoService.actualizarFechaEvento(eventoId, nuevaFecha).subscribe(
      () => {
        console.log('Evento actualizado con éxito');
        Swal.fire(
          'Actualizado',
          'La fecha del evento ha sido actualizada.',
          'success'
        );
        this.cargarEventos();
      },
      (error) => {
        console.error('Error al actualizar la fecha del evento', error);
      }
    );
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
    console.log('Visibilidad del calendario cambiada:', this.calendarVisible);
  }

  handleWeekendsToggle() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
    console.log('Visibilidad de los fines de semana cambiada:', this.calendarOptions.weekends);
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log('Fecha seleccionada:', selectInfo.startStr);
    const dialogRef = this.dialog.open(EventModalComponent, {
      width: '500px',
      data: {
        veterinaria: '',
        descripcion: '',
        costo: '',
        tipoEvento: '',
        archivo: null,
        nombreMascota: '', // Ajustar según sea necesario
        tipoMascota: '',
        fecha: selectInfo.startStr
      } as EventData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos del nuevo evento:', result);
        const newEvent: DatosRegistroEvento = {
          veterinaria: result.veterinaria,
          descripcion: result.descripcion,
          costo: result.costo,
          tipoEvento: result.tipoEvento,
          archivo: result.archivo,
          nombreMascota: result.nombreMascota,
          tipoMascota: result.tipoMascota,
          fecha: result.fecha,
          nombreComplemento: result.nombreComplemento,
          descripcionComplemento: result.descripcionComplemento,
          tipoComplemento: result.tipoComplemento,
          fabricante: result.fabricante,
          lote: result.lote,
          dosis: result.dosis,
          frecuencia: result.frecuencia,
          fechaComplemento: result.fechaComplemento
        };

        this.eventoService.registrarEvento(newEvent).subscribe(
          () => {
            console.log('Evento registrado con éxito');
            Swal.fire(
              'Registrado',
              'El evento ha sido registrado con éxito.',
              'success'
            );
            this.cargarEventos();
          },
          (error) => {
            console.error('Error al registrar el evento', error);
          }
        );
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const evento = clickInfo.event.extendedProps as DatosDetallesEvento;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Estás seguro de que quieres eliminar el evento '${clickInfo.event.title}'?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Eliminando evento con ID ${clickInfo.event.id}`);
        this.eventoService.eliminarEvento(clickInfo.event.id as string).subscribe(
          () => {
            console.log('Evento eliminado con éxito');
            clickInfo.event.remove();
            Swal.fire(
              'Eliminado',
              'El evento ha sido eliminado.',
              'success'
            );
          },
          (error) => {
            console.error('Error al eliminar el evento', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el evento.',
              'error'
            );
          }
        );
      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events as EventInput[];
    console.log('Eventos actuales:', this.currentEvents);
    this.changeDetector.detectChanges();
  }

  handleEventMouseEnter(mouseEnterInfo: any) {
    mouseEnterInfo.el.style.cursor = 'pointer';
  }

  handleEventMouseLeave(mouseLeaveInfo: any) {
    mouseLeaveInfo.el.style.cursor = '';
  }

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
    console.log('Estado del sidenav cambiado:', this.isExpanded);
  }
}
