import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInnerPageComponent } from './product-inner-page.component';

describe('ProductInnerPageComponent', () => {
  let component: ProductInnerPageComponent;
  let fixture: ComponentFixture<ProductInnerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductInnerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInnerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
