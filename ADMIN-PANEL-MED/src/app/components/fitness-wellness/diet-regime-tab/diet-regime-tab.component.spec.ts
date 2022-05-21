import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietRegimeTabComponent } from './diet-regime-tab.component';

describe('DietRegimeTabComponent', () => {
  let component: DietRegimeTabComponent;
  let fixture: ComponentFixture<DietRegimeTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DietRegimeTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DietRegimeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
