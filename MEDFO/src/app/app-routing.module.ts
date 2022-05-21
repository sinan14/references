import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthenticatedUsersOnlyGuard } from './services/authenticatedUsersOnly.guard';
import { LandingComponent } from './landing/landing.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductInnerPageComponent } from './product-inner-page/product-inner-page.component';
import { CartComponent } from './cart/cart.component';
import { CartSubscriptionComponent } from './cart-subscription/cart-subscription.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { SignupModelComponent } from './header/signup-model/signup-model.component';
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
import { SearchProductListComponent } from './search-product-list/search-product-list.component';
import { MedcoinReferComponent } from './medcoin-refer/medcoin-refer.component';
import { PrivacPolicyComponent } from './privac-policy/privac-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { OrderListComponent } from './order-list/order-list.component';
import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';
import { MedPrimeMembershipComponent } from './med-prime-membership/med-prime-membership.component';
import { ReviewSubscriptionComponent } from './review-subscription/review-subscription.component';
import { OrderComponent } from './order/order.component';
import { MedimallBoxComponent } from './vouchers/medimall-box.component';
import { UserSavingsComponent } from './user-savings/user-savings.component';
import { RecentlyPurchasedService } from './services/recently_purchased.service';
import { RecentlyPurchasedComponent } from './recently-purchased/recently-purchased.component';
import { PaymentMessageComponent } from './payment-message/payment-message.component';
import { ReferAndEarnComponent } from './refer-and-earn/refer-and-earn.component';
import { ReturnDetailComponent } from './return-detail/return-detail.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'blog-detail/:id',
    component: BlogDetailComponent,
    data: { preload: true },
  },

  { path: 'blog', component: BlogComponent },
  {
    path: 'category-list',
    component: CategoryListComponent,
    data: { preload: true },
  },
  {
    path: 'product-list/:cat_id/:sub_id/:sub_sub_id',
    //path: 'product-list/:cat_id/:sub_id',
    component: ProductListComponent,
    data: { preload: true },
  },
  {
    path: 'search-product',
    component: SearchProductListComponent,
    data: { preload: true },
  },
  {
    path: 'order',
    data: { preload: true },
    component: OrderComponent,
  },
  {
    path: 'verify-payment',
    data: { preload: true },
    component: PaymentMessageComponent,
  },
  {
    path: 'product-detail/:prod_name/:prod_id/:prod_category/:prod_brand',
    component: ProductInnerPageComponent,
    data: { preload: true },
  },
  {
    path: 'brand/:brandId',
    component: BrandListComponent,
    data: { preload: true },
  },
  { path: 'cart', component: CartComponent, data: { preload: true } },
  { path: 'doctor', component: DoctorFormComponent, data: { preload: true } },

  {
    path: 'cart-subscription',
    component: CartSubscriptionComponent,
    data: { preload: true },
  },

  {
    path: 'dashboard-order-details',
    canActivate: [AuthenticatedUsersOnlyGuard],
    data: { preload: true },
    component: DashboardOrderDetailsComponent,
    children: [
      {
        path: 'profile',
        data: { preload: true },
        component: DashboardProfileComponent,
      },

      {
        path: 'order-details/:order_id',
        data: { preload: true },
        component: OrderDetailsComponent,
      },
      {
        path: 'order-list',
        data: { preload: true },
        component: OrderListComponent,
      },
      {
        path: 'medfill-subscription',
        data: { preload: true },
        component: MedfillSubscriptionComponent,
      },
      {
        path: 'health-vault',
        data: { preload: true },
        component: HealthVaultComponent,
      },
      {
        path: 'add-family',
        data: { preload: true },
        component: ProfileAddFamilyComponent,
      },
      {
        path: 'medcoin-refer',
        data: { preload: true },
        component: MedcoinReferComponent,
      },
      {
        path: 'refer-and-earn',
        data: { preload: true },
        component: ReferAndEarnComponent,
      },
    ],
  },

  { path: 'cart-pop', component: NewCartComponent },
  { path: 'privacy-policy', component: PrivacPolicyComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },

  { path: 'short-list', component: ShortListComponent },
  { path: 'order-review', component: OrderReviewComponent },
  { path: 'add-subscription', component: AddSubscriptionComponent },
  {
    path: 'medpride-membership',
    component: MedPrimeMembershipComponent,
    canActivate: [AuthenticatedUsersOnlyGuard],
  },
  { path: 'review-subscription', component: ReviewSubscriptionComponent },
  { path: 'offers', component: MedimallBoxComponent },
  { path: 'savings', component: UserSavingsComponent },
  {
    path: 'recently-purchased',
    canActivate: [AuthenticatedUsersOnlyGuard],
    component: RecentlyPurchasedComponent,
  },
  { path: 'return-detail/:return_id', component: ReturnDetailComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [AppComponent, LandingComponent];
