import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface ComplementData {
  nombreComplemento: string;
  descripcionComplemento: string;
  tipoComplemento: string;
  fabricante?: string;
  lote?: string;
  dosis?: string;
  frecuencia?: string;
}

@Component({
  selector: 'app-complement-modal',
  templateUrl: './complement-modal.component.html',
  styleUrls: ['./complement-modal.component.css']
})
export class ComplementModalComponent {
  complementForm: FormGroup;
  tiposComplemento = ['VACUNA', 'MEDICAMENTO'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ComplementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ComplementData
  ) {
    this.complementForm = this.fb.group({
      nombreComplemento: ['', Validators.required],
      descripcionComplemento: ['', Validators.required],
      tipoComplemento: ['', Validators.required],
      fabricante: [''],
      lote: [''],
      dosis: [''],
      frecuencia: ['']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.complementForm.valid) {
      this.dialogRef.close(this.complementForm.value);
    }
  }
}
