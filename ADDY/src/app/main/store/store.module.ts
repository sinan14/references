import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment.prod';
import { StoreRoutingModule } from './store-routing.module';
import { ConvenienceComponent } from './convenience/convenience.component';
import { ReviewOrderComponent } from './review-order/review-order.component';
import { SuccessComponent } from './success/success.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { LoginComponent } from './shared/login/login.component';
import { ShoppingWebViewComponent } from './shopping-web-view/shopping-web-view.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { DeliveryMapComponent } from './delivery-map/delivery-map.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AddressComponent } from './address/address.component';
import { DriveraddressCnfirmComponent } from './driveraddress-cnfirm/driveraddress-cnfirm.component';
import { HttpClientModule } from '@angular/common/http';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { IntlNoComponent } from './shared/intl-no/intl-no.component';
import { DeliveryAddressCnfirmComponent } from './delivery-address/delivery-address-cnfirm.component';
@NgModule({
  declarations: [
    ConvenienceComponent,
    ReviewOrderComponent,
    SuccessComponent,
    FooterComponent,
    NavbarComponent,
    LoginComponent,
    ShoppingWebViewComponent,
    HomeComponent,
    ProductComponent,
    DeliveryMapComponent,
    AddressComponent,
    DriveraddressCnfirmComponent,
    IntlNoComponent,
    DeliveryAddressCnfirmComponent
  ],
  imports: [
    CommonModule,
    NgxIntlTelInputModule,
    StoreRoutingModule,
    HttpClientModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    NgxTrimDirectiveModule,
    Ng2TelInputModule,
    AgmCoreModule.forRoot({
      apiKey: environment.agmCoreApiKey,
      libraries: ['places'],
    }),
  ],
})
export class StoreModule {}
