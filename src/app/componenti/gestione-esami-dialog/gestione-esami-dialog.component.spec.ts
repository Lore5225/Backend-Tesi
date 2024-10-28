import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneEsamiDialogComponent } from './gestione-esami-dialog.component';

describe('GestioneEsamiDialogComponent', () => {
  let component: GestioneEsamiDialogComponent;
  let fixture: ComponentFixture<GestioneEsamiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneEsamiDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestioneEsamiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
