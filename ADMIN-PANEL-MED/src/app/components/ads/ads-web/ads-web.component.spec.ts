import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsWebComponent } from './ads-web.component';

describe('AdsWebComponent', () => {
  let component: AdsWebComponent;
  let fixture: ComponentFixture<AdsWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdsWebComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
