import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingWebViewComponent } from './shopping-web-view.component';

describe('ShoppingWebViewComponent', () => {
  let component: ShoppingWebViewComponent;
  let fixture: ComponentFixture<ShoppingWebViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingWebViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingWebViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
