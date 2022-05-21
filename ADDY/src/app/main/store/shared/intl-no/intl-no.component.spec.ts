import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntlNoComponent } from './intl-no.component';

describe('IntlNoComponent', () => {
  let component: IntlNoComponent;
  let fixture: ComponentFixture<IntlNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntlNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntlNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
