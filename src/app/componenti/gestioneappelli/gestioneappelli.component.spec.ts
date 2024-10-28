import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneappelliComponent } from './gestioneappelli.component';

describe('GestioneappelliComponent', () => {
  let component: GestioneappelliComponent;
  let fixture: ComponentFixture<GestioneappelliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneappelliComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestioneappelliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
