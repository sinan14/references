import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { HashLocationStrategy, LocationStrategy} from '@angular/common';
import { UrlExpiredComponent } from './main/url-expired/url-expired.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [AppComponent, UrlExpiredComponent, ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxIntlTelInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    HttpClientModule,
    CarouselModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDkittXkcO5UmfM_n8ScpYC6uyCG-tmQz4',
      libraries: ['places']
    }),
    AgmDirectionModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {provide:LocationStrategy, useClass: HashLocationStrategy},

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

