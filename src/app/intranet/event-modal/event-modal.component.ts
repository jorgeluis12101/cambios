import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface EventData {
  veterinaria: string;
  descripcion: string;
  costo: string;
  tipoEvento: string;
  archivo: string | null;
  nombreMascota: string;
  tipoMascota: string;
  fecha: string;
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
    @Inject(MAT_DIALOG_DATA) public data: EventData
  ) {
    this.eventForm = this.fb.group({
      veterinaria: ['', Validators.required],
      descripcion: ['', Validators.required],
      costo: ['', Validators.required],
      tipoEvento: ['', Validators.required],
      archivo: [null],
      nombreMascota: ['', Validators.required],
      tipoMascota: ['', Validators.required],
      fecha: [data.fecha, Validators.required]
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

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.value);
    }
  }
}
