import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerErrorHandleService } from './server-error-handle.service';
import { AuthInterceptorService } from '../app/components/auth/auth-interceptor.service';

import { DashboardModule } from './components/dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { ProductsModule } from './components/products/products.module';
import { SalesModule } from './components/sales/sales.module';
import { CouponsModule } from './components/coupons/coupons.module';
import { PagesModule } from './components/pages/pages.module';
import { MenusModule } from './components/menus/menus.module';
import { VendorsModule } from './components/vendors/vendors.module';
import { UsersModule } from './components/users/users.module';
import { LocalizationModule } from './components/localization/localization.module';
import { InvoiceModule } from './components/invoice/invoice.module';
import { SettingModule } from './components/setting/setting.module';;
import { ReportsModule } from './components/reports/reports.module';
import { AuthModule } from './components/auth/auth.module';
import { TeamManagementModule } from './components/team-management/team-management.module';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { HashLocationStrategy, LocationStrategy} from '@angular/common';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { GridModule } from '@progress/kendo-angular-grid';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ListViewModule } from '@progress/kendo-angular-listview';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HyphenatePipe } from './hyphenate.pipe';






@NgModule({
  declarations: [
    AppComponent,
    HyphenatePipe,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    DashboardModule,
    InvoiceModule,
    SettingModule,
    ReportsModule,
    AuthModule,
    SharedModule,
    LocalizationModule,
    ProductsModule,
    SalesModule,
    VendorsModule,
    CouponsModule,
    PagesModule,
    MenusModule,
    UsersModule,
    TeamManagementModule,
    DateInputsModule,
    DropDownsModule,
    EditorModule,
    GridModule,
    UploadModule,
    HttpClientModule,
    ListViewModule,
    TooltipModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [{provide:LocationStrategy, useClass: HashLocationStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorHandleService,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
