import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { StoreHomeService } from './services/store-home.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'addy';
  constructor(
    private authService: AuthService,
    private storeService: StoreHomeService
  ) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.storeService.getCurrencyCode();
    this.storeService.getCurrencyRates();
  }
}
