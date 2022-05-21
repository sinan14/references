import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsMainComponent } from './ads-main/ads-main.component';




import { AdsRoutingModule } from './ads-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CKEditorModule } from 'ngx-ckeditor';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';




import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdsHomeComponent } from './ads-home/ads-home.component';
import { AdsMedimallComponent } from './ads-medimall/ads-medimall.component';
import { AdsFoliofitComponent } from './ads-foliofit/ads-foliofit.component';
import { AdsMedfeedComponent } from './ads-medfeed/ads-medfeed.component';
import { AdsSeasonalOffersComponent } from './ads-seasonal-offers/ads-seasonal-offers.component';
import { AdsMedcoinComponent } from './ads-medcoin/ads-medcoin.component';
import { AdsProfileComponent } from './ads-profile/ads-profile.component';
import { AdsCartComponent } from './ads-cart/ads-cart.component';
import { AdsSetdealComponent } from './ads-setdeal/ads-setdeal.component';
import { AdsSetnewofferComponent } from './ads-setnewoffer/ads-setnewoffer.component';
import { AdsPromotionsComponent } from './ads-promotions/ads-promotions.component';
import { AdsWebComponent } from './ads-web/ads-web.component';

@NgModule({
  declarations: [AdsMainComponent, AdsHomeComponent, AdsMedimallComponent, AdsFoliofitComponent, AdsMedfeedComponent, AdsSeasonalOffersComponent, AdsMedcoinComponent, AdsProfileComponent, AdsCartComponent, AdsSetdealComponent, AdsSetnewofferComponent, AdsPromotionsComponent, AdsWebComponent,],
  imports: [
    CommonModule,
    AdsRoutingModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    NgbModule,
    CKEditorModule,
    DropDownsModule,
    InputsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdsModule { }
