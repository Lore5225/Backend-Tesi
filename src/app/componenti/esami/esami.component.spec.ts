import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsamiComponent } from './esami.component';

describe('EsamiComponent', () => {
  let component: EsamiComponent;
  let fixture: ComponentFixture<EsamiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsamiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EsamiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
