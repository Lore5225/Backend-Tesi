import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValutazioneDialogComponent } from './valutazione-dialog.component';

describe('ValutazioneDialogComponent', () => {
  let component: ValutazioneDialogComponent;
  let fixture: ComponentFixture<ValutazioneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValutazioneDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValutazioneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
