import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDoctorPageComponent } from './header-doctor-page.component';

describe('HeaderDoctorPageComponent', () => {
  let component: HeaderDoctorPageComponent;
  let fixture: ComponentFixture<HeaderDoctorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderDoctorPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDoctorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
