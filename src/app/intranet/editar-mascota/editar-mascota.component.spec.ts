import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMascotaComponent } from './editar-mascota.component';

describe('EditarMascotaComponent', () => {
  let component: EditarMascotaComponent;
  let fixture: ComponentFixture<EditarMascotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarMascotaComponent]
    });
    fixture = TestBed.createComponent(EditarMascotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
