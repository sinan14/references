import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPageTabComponent } from './master-page-tab.component';

describe('MasterPageTabComponent', () => {
  let component: MasterPageTabComponent;
  let fixture: ComponentFixture<MasterPageTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterPageTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
