import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialTabComponent } from './testimonial-tab.component';

describe('TestimonialTabComponent', () => {
  let component: TestimonialTabComponent;
  let fixture: ComponentFixture<TestimonialTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestimonialTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
