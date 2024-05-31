import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementModalComponent } from './complement-modal.component';

describe('ComplementModalComponent', () => {
  let component: ComplementModalComponent;
  let fixture: ComponentFixture<ComplementModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplementModalComponent]
    });
    fixture = TestBed.createComponent(ComplementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
