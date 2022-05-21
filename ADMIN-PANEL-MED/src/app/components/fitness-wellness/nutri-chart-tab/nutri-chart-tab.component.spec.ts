import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutriChartTabComponent } from './nutri-chart-tab.component';

describe('NutriChartTabComponent', () => {
  let component: NutriChartTabComponent;
  let fixture: ComponentFixture<NutriChartTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutriChartTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NutriChartTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
