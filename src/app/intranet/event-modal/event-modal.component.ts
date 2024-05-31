import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplementModalComponent, ComplementData } from './complement-modal/complement-modal.component';

export interface EventData {
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
  fechaComplemento?: string;
}

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent {
  eventForm: FormGroup;
  selectedFile: File | null = null;
  tiposEvento = ['DESPARASITACION', 'CITA', 'BAÑO', 'CORTE_DE_PELO', 'PENSION', 'ADOPCION'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventData,
    private dialog: MatDialog
  ) {
    this.eventForm = this.fb.group({
      veterinaria: ['', Validators.required],
      descripcion: ['', Validators.required],
      costo: ['', Validators.required],
      tipoEvento: ['', Validators.required],
      archivo: [null],
      nombreMascota: ['', Validators.required],
      tipoMascota: ['', Validators.required],
      fecha: [data.fecha, Validators.required],
      nombreComplemento: [''],
      descripcionComplemento: [''],
      tipoComplemento: [''],
      fabricante: [''],
      lote: [''],
      dosis: [''],
      frecuencia: [''],
      fechaComplemento: [new Date().toISOString()] // Capturar la fecha y hora actual
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.eventForm.patchValue({ archivo: base64.split(',')[1] });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddComplement(): void {
    const dialogRef = this.dialog.open(ComplementModalComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: ComplementData | undefined) => {
      if (result) {
        this.eventForm.patchValue(result);
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.value);
    }
  }
}
