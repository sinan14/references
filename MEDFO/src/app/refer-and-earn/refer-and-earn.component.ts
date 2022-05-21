import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UserDashboardService } from '../services/user-dashboard.service';

@Component({
  selector: 'app-refer-and-earn',
  templateUrl: './refer-and-earn.component.html',
  styleUrls: ['./refer-and-earn.component.css'],
})
export class ReferAndEarnComponent implements OnInit, AfterViewInit {
  constructor(private _res: UserDashboardService) {}
  public referalData: any = '';
  show1: boolean = false;
  show2: boolean = false;
  show3: boolean = false;
  show4: boolean = false;
  show5: boolean = false;
  show6: boolean = false;
  show7: boolean = false;
  show8: boolean = false;
  show9: boolean = false;
  ngOnInit(): void {
    this.fetchReferAndEarn();
    document.getElementById('open-modal').click();
  }
  ngAfterViewInit() {
    // const items = document.querySelectorAll('.accordion a');
    // function toggleAccordion() {
    //   this.classList.toggle('active');
    //   this.nextElementSibling.classList.toggle('active');
    // }
    // items.forEach((item) => item.addEventListener('click', toggleAccordion));
  }

  fetchReferAndEarn() {
    this._res.fetchReferraldetails().subscribe(
      (res: any) => {
        console.log(res);
        if (res.error === false) {
          this.referalData = JSON.parse(JSON.stringify(res.data));
          document.getElementById('generalTerms').innerHTML =
            this.referalData.termsConditions.description;
        } else {
          //
        }
      },
      (err: any) => {
        console.log('server refused to connect');
      }
    );
  }

  exitFromReferAndEarn() {
    this._res.exitFromReferAndEarn();
  }

  openWhatsapp() {
    window.open(
      `whatsapp://send?text= Download MediMall app from PlayStore https://medfolio.page.link/Yp9BqdjcfPwuoWjPA use referral code ${this.referalData.referralCode}`
    );
  }
  openEmail() {
    var aTag = document.createElement('a');
    var subject = `Download MediMall app from PlayStore https://medfolio.page.link/Yp9BqdjcfPwuoWjPA use referral code ${this.referalData.referralCode}`;
    var subjectEncoded = encodeURIComponent(subject);
    // console.log(subjectEncoded);
    aTag.setAttribute(
      'href',
      `mailto:?subject=Refer%20a%20friend&body=${subjectEncoded}`
    );
    // this.copySomething(this.referalData.referralCode);
    aTag.click();
  }
  // async copySomething(text) {
  //   try {
  //     console.log(`${text}Text or Page URL copied`);

  //     await navigator.clipboard.writeText('sinan');
  //   } catch (err) {
  //     console.error('Failed to copy: ', err);
  //   }
  // }
  copySomething(text) {
    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    textField.focus(); //SET FOCUS on the TEXTFIELD
    document.execCommand('copy');
    textField.remove();
    console.log('should have copied ' + text);
  }
  copyAlert() {
    Swal.fire({
      text: 'Referral code copied ',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3085d6',
      imageHeight: 1000,
    });
  }
  share() {
    this.copySomething(
      `Download MediMall app from PlayStore https://medfolio.page.link/Yp9BqdjcfPwuoWjPA use referral code ${this.referalData.referralCode}`
    );
    this.copyAlert();
  }
  tapToCopy() {
    this.copySomething(this.referalData.referralCode);
    this.copyAlert();
  }
}
