import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmiTabComponent } from './bmi-tab.component';

describe('BmiTabComponent', () => {
  let component: BmiTabComponent;
  let fixture: ComponentFixture<BmiTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BmiTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BmiTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
