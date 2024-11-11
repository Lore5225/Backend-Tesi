import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiepilogoEsitiDialogComponent } from './riepilogo-esiti-dialog.component';

describe('RiepilogoEsitiDialogComponent', () => {
  let component: RiepilogoEsitiDialogComponent;
  let fixture: ComponentFixture<RiepilogoEsitiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiepilogoEsitiDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RiepilogoEsitiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
