import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../service/mascota.service';
import { Mascota } from '../../modelos/mascota';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-mascota',
  templateUrl: './editar-mascota.component.html',
  styleUrls: ['./editar-mascota.component.css']
})
export class EditarMascotaComponent implements OnInit {
  mascotaId!: number;
  mascota!: Mascota;
  mascotaForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private mascotaService: MascotaService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.mascotaForm = this.fb.group({
      nombreMascota: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      peso: ['', Validators.required],
      alimentacion: ['', Validators.required],
      color: ['', Validators.required],
      detalles: [''],
      fotoMascota: [null]
    });
  }

  ngOnInit(): void {
    this.mascotaId = +this.route.snapshot.paramMap.get('id')!;
    if (!isNaN(this.mascotaId)) {
      this.mascotaService.listarMascotas().subscribe(mascotas => {
        this.mascota = mascotas.find(m => m.id === this.mascotaId)!;
        if (this.mascota) {
          this.mascotaForm.patchValue(this.mascota);
        }
      });
    } else {
      console.error('ID de mascota no válido');
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.mascotaForm.patchValue({
        fotoMascota: file
      });
    }
  }

  guardarCambios(): void {
    if (this.mascotaForm.valid) {
      const formData = new FormData();
      Object.keys(this.mascotaForm.controls).forEach(key => {
        formData.append(key, this.mascotaForm.get(key)?.value);
      });

      this.mascotaService.modificarMascota(this.mascotaId, formData).subscribe(() => {
        this.router.navigate(['/intranet/user/lista-mascotas']);
      }, error => {
        console.error('Error al guardar los cambios:', error);
      });
    }
  }
}
