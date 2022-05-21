import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { TokenInterceptorService } from './services/token-interceptor.service';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ToastrModule } from 'ngx-toastr';
import { WebcamModule } from 'ngx-webcam';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ClipboardModule } from 'ngx-clipboard';
import { SearchfilterPipe } from './searchfilter.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { ProductInnerPageComponent } from './product-inner-page/product-inner-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';
import { CartSubscriptionComponent } from './cart-subscription/cart-subscription.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { SignupModelComponent } from './header/signup-model/signup-model.component';

import { FooterDoctorPageComponent } from './doctor-form/footer-doctor-page/footer-doctor-page.component';
import { LoadingSpinnerComponent } from './doctor-form/loading-spinner/loading-spinner.component';
import { HeaderDoctorPageComponent } from './doctor-form/header-doctor-page/header-doctor-page.component';

import { DashboardOrderDetailsComponent } from './dashboard-order-details/dashboard-order-details.component';
import { DashboardProfileComponent } from './dashboard-profile/dashboard-profile.component';
import { MedfillSubscriptionComponent } from './medfill-subscription/medfill-subscription.component';
import { HealthVaultComponent } from './health-vault/health-vault.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { NewCartComponent } from './new-cart/new-cart.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { ShortListComponent } from './short-list/short-list.component';

import { OrderReviewComponent } from './order-review/order-review.component';
import { SubscriptionReviewComponent } from './subscription-review/subscription-review.component';
import { ProfileAddFamilyComponent } from './profile-add-family/profile-add-family.component';
import { PaymentComponent } from './payment/payment.component';
import { SearchProductListComponent } from './search-product-list/search-product-list.component';
import { MedcoinReferComponent } from './medcoin-refer/medcoin-refer.component';
import { PrivacPolicyComponent } from './privac-policy/privac-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ShareModule } from 'ngx-sharebuttons';
import {
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { OrderListComponent } from './order-list/order-list.component';
import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';
import { MedPrimeMembershipComponent } from './med-prime-membership/med-prime-membership.component';
import { ReviewSubscriptionComponent } from './review-subscription/review-subscription.component';
import { OrderComponent } from './order/order.component';
import { NumberToWordsPipe } from './pipes/numberToWords.pipe';
import { UserSavingsComponent } from './user-savings/user-savings.component';
import { MedimallBoxComponent } from './vouchers/medimall-box.component';
import { RecentlyPurchasedComponent } from './recently-purchased/recently-purchased.component';
import { SocialShareComponent } from './social-share/social-share.component';
import { PaymentMessageComponent } from './payment-message/payment-message.component';
import { ReferAndEarnComponent } from './refer-and-earn/refer-and-earn.component';
import { ReturnDetailComponent } from './return-detail/return-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ProductListComponent,
    BrandListComponent,
    CategoryListComponent,
    ProductInnerPageComponent,
    HeaderComponent,
    FooterComponent,
    CartComponent,
    CartSubscriptionComponent,
    BlogComponent,
    BlogDetailComponent,
    DoctorFormComponent,
    SignupModelComponent,
    LoadingSpinnerComponent,
    FooterDoctorPageComponent,
    HeaderDoctorPageComponent,
    HealthVaultComponent,
    OrderDetailsComponent,
    DashboardOrderDetailsComponent,
    DashboardProfileComponent,
    MedfillSubscriptionComponent,
    NewCartComponent,
    ShortListComponent,
    OrderReviewComponent,
    SubscriptionReviewComponent,
    SearchfilterPipe,
    ProfileAddFamilyComponent,
    PaymentComponent,
    SearchProductListComponent,
    MedcoinReferComponent,
    PrivacPolicyComponent,
    TermsAndConditionsComponent,
    OrderListComponent,
    AddSubscriptionComponent,
    MedPrimeMembershipComponent,
    ReviewSubscriptionComponent,
    OrderComponent,
    MedimallBoxComponent,
    UserSavingsComponent,
    NumberToWordsPipe,
    RecentlyPurchasedComponent,
    SocialShareComponent,
    PaymentMessageComponent,
    ReferAndEarnComponent,
    ReturnDetailComponent,
  ],
  imports: [
    BrowserModule,
    CarouselModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxTrimDirectiveModule,
    NgxSliderModule,
    ClipboardModule,
    NgxImageZoomModule,
    SocialLoginModule,
    NgxIntlTelInputModule,
    ShareModule,
    ToastrModule.forRoot(),
    WebcamModule,
  ],

  providers: [
    // {provide:LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },

    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(`${environment.fb}`),
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(`${environment.google}`),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
