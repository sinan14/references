import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlExpiredComponent } from './url-expired.component';

describe('UrlExpiredComponent', () => {
  let component: UrlExpiredComponent;
  let fixture: ComponentFixture<UrlExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrlExpiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
