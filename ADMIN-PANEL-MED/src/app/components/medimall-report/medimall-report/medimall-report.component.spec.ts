import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedimallReportComponent } from './medimall-report.component';

describe('MedimallReportComponent', () => {
  let component: MedimallReportComponent;
  let fixture: ComponentFixture<MedimallReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedimallReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedimallReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
