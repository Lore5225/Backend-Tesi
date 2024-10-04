import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenotatiComponent } from './prenotati.component';

describe('PrenotatiComponent', () => {
  let component: PrenotatiComponent;
  let fixture: ComponentFixture<PrenotatiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrenotatiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrenotatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
