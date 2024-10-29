import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenotazioniDialogComponent } from './prenotazioni-dialog.component';

describe('PrenotazioniDialogComponent', () => {
  let component: PrenotazioniDialogComponent;
  let fixture: ComponentFixture<PrenotazioniDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrenotazioniDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrenotazioniDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
