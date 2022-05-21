import { Component ,OnInit} from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserAuthService } from './services/user-auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: UserAuthService) {}
  
  public whatsappNumber = environment.whatsappNumber;
  public User_Token = environment.userDataKey;
  //whatsappNumber: any = 8281025213;
  title = 'medfolio-web';
  ngOnInit() {
    this.authService.autoLogin();
    localStorage.setItem('guestToken',this.User_Token)
    window.scrollTo(0, 0);
   // document.getElementById("loading").style.display = "none";
    $(document).ready(function(){
      $( document ).on( 'focus', ':input', function(){
        $( this ).attr( 'autocomplete', 'off' );
      });
    });


    $(window).ready(function () {
      setInterval(function () {
        $('.loader-container').addClass("active")
      }, 1500);
  
    });

    
  }

  openWhatsApp() {
    window.open(`whatsapp://send?phone=+91${this.whatsappNumber}`);
  }

  openWhatsappWeb() {
    window.open(`https://api.whatsapp.com/send?phone=+91${this.whatsappNumber}`);
  }

  callNow() {
    const num = `tel:+91${this.whatsappNumber}`;
    var aTag = document.createElement('a');
    aTag.setAttribute('href', num);
    aTag.click()
  }
}
