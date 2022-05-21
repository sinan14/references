import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenienceComponent } from './convenience.component';

describe('ConvenienceComponent', () => {
  let component: ConvenienceComponent;
  let fixture: ComponentFixture<ConvenienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvenienceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvenienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
