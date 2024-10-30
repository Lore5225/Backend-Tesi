import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValutazioneComponent } from './valutazione.component';

describe('ValutazioneComponent', () => {
  let component: ValutazioneComponent;
  let fixture: ComponentFixture<ValutazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValutazioneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValutazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
