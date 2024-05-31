import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput, EventDropArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { MatDialog } from '@angular/material/dialog';
import { DatosRegistroEvento, EventoService, Evento } from 'src/app/service/evento.service';
import { EventModalComponent, EventData } from '../event-modal/event-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  calendarVisible = true;
  isExpanded = false;

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
    events: [],
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.handleEventDrop.bind(this)
  };
  currentEvents: EventApi[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private eventoService: EventoService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventoService.obtenerEventos().subscribe(
      (eventos: Evento[]) => {
        const calendarEvents: EventInput[] = eventos.map(evento => ({
          id: String(evento.id),
          title: `${evento.tipoEvento} - ${evento.veterinaria}`,
          start: evento.fecha,
          end: evento.fecha,
          allDay: true
        }));
        console.log('Eventos configurados para el calendario:', calendarEvents);
        this.calendarOptions.events = calendarEvents;
        this.currentEvents = calendarEvents as EventApi[];
        this.changeDetector.detectChanges();
      },
      (error) => {
        console.error('Error al cargar los eventos', error);
      }
    );
  }

  handleEventDrop(eventDropInfo: EventDropArg) {
    const eventoId = Number(eventDropInfo.event.id);
    const nuevaFecha = eventDropInfo.event.startStr;

    this.eventoService.actualizarFechaEvento(eventoId, nuevaFecha).subscribe(
      () => {
        console.log('Evento actualizado con éxito');
        this.cargarEventos();
      },
      (error) => {
        console.error('Error al actualizar la fecha del evento', error);
      }
    );
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const dialogRef = this.dialog.open(EventModalComponent, {
      width: '500px',
      data: {
        veterinaria: '',
        descripcion: '',
        costo: '',
        tipoEvento: '',
        archivo: null,
        nombreMascota: '',
        tipoMascota: '',
        fecha: selectInfo.startStr
      } as EventData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
            console.log('Evento registrado con éxito:', newEvent);
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
        this.eventoService.eliminarEvento(Number(clickInfo.event.id)).subscribe(
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
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }
}
