import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllenatiComponent } from './allenati.component';

describe('AllenatiComponent', () => {
  let component: AllenatiComponent;
  let fixture: ComponentFixture<AllenatiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllenatiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllenatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
