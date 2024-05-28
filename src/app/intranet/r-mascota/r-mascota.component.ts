import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MascotaService } from '../../service/mascota.service';
import { RazaService } from '../../service/raza.service';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-r-mascota',
  templateUrl: './r-mascota.component.html',
  styleUrls: ['./r-mascota.component.css']
})
export class RMascotaComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  mascotaForm: FormGroup;
  imageURL?: string;
  filteredRazas!: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private mascotaService: MascotaService,
    private razaService: RazaService
  ) {
    this.mascotaForm = this.fb.group({
      nombreMascota: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      peso: ['', [Validators.required, Validators.min(1)]],
      alimentacion: ['', Validators.required],
      color: ['', Validators.required],
      detalles: [''],
      razaId: ['', Validators.required],
      fotoMascota: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.filteredRazas = this.mascotaForm.get('razaId')!.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        if (typeof value === 'string' && value.trim().length > 0) {
          return this.razaService.buscarRazas(value).pipe(
            catchError(() => of([]))
          );
        } else {
          return of([]);
        }
      })
    );
  }

  displayRaza(raza: any): string {
    return raza ? raza.nombre : '';
  }

  onFileSelect(event: Event): void {
    const element = event.target as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.mascotaForm.get('fotoMascota')!.setValue(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  registrarMascota(): void {
    if (this.mascotaForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor completa todos los campos requeridos.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('nombreMascota', this.mascotaForm.get('nombreMascota')!.value);
    formData.append('fechaNacimiento', this.formatDate(this.mascotaForm.get('fechaNacimiento')!.value));
    formData.append('peso', this.mascotaForm.get('peso')!.value);
    formData.append('alimentacion', this.mascotaForm.get('alimentacion')!.value);
    formData.append('color', this.mascotaForm.get('color')!.value);
    formData.append('detalles', this.mascotaForm.get('detalles')!.value);
    formData.append('razaId', this.mascotaForm.get('razaId')!.value.id);
    if (this.fileInput.nativeElement.files[0]) {
      formData.append('fotoMascota', this.fileInput.nativeElement.files[0]);
    }

    this.mascotaService.agregarMascota(formData).subscribe({
      next: (res) => Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Mascota registrada correctamente.',
      }),
      error: (err) => Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar la mascota.',
      })
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Formato 'yyyy-MM-dd'
  }
}
