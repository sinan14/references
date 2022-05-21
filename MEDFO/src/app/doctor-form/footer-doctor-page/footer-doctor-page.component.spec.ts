import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterDoctorPageComponent } from './footer-doctor-page.component';

describe('FooterDoctorPageComponent', () => {
  let component: FooterDoctorPageComponent;
  let fixture: ComponentFixture<FooterDoctorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterDoctorPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterDoctorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
