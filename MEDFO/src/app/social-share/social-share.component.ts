import { Component, OnInit } from '@angular/core';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.css'],
})
export class SocialShareComponent implements OnInit {
  currentURL: string;
  constructor() {
    this.currentURL = window.location.href;
  }

  ngOnInit(): void {}
  openWhatsApp() {
    window.open(`whatsapp://send?text=${this.currentURL}`);
  }
  openWhatsappWeb() {
    window.open(`https://api.whatsapp.com/send?text=${this.currentURL}`);
  }
}
