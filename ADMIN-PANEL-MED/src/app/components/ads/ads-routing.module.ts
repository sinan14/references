import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdsMainComponent } from './ads-main/ads-main.component';
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


const routes: Routes = [
  {
    path: '',
    component: AdsMainComponent,
  },
  {
    path: 'ads-home',
    component: AdsHomeComponent,
  },
  {
    path: 'ads-medimall',
    component: AdsMedimallComponent,
  },
  {
    path: 'ads-foliofit',
    component: AdsFoliofitComponent,
  }, 
  {
    path: 'ads-medfeed',
    component: AdsMedfeedComponent,
  },
  {
    path: 'ads-seasonaloffers',
    component: AdsSeasonalOffersComponent,
  },
  {
    path: 'ads-medcoin',
    component: AdsMedcoinComponent,
  },
  {
    path: 'ads-profile',
    component: AdsProfileComponent,
  },
  {
    path: 'ads-cart',
    component: AdsCartComponent,
  },
  {
    path: 'ads-setyourdeal/:dealID',
    component: AdsSetdealComponent,
  },
  {
    path: 'ads-setnewoffer/:offerID',
    component: AdsSetnewofferComponent,
  },
  {
    path: 'ads-promotions',
    component: AdsPromotionsComponent,
  },
  {
    path: 'ads-web',
    component: AdsWebComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdsRoutingModule { }
