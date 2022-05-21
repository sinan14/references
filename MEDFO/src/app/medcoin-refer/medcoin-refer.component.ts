import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MedcoinService } from '../services/medcoin.service';
import { UserDashboardService } from '../services/user-dashboard.service';

@Component({
  selector: 'app-medcoin-refer',
  templateUrl: './medcoin-refer.component.html',
  styleUrls: ['./medcoin-refer.component.css'],
})
export class MedcoinReferComponent implements OnInit {
  public referralCode: any = '';
  public viewMore: boolean = true;
  public viewLess: boolean = false;

  // linkCopied: boolean;

  // timeLeft: number;
  // public interval;
  public pageNumber: number = 0;
  public hasNextPage: boolean = true;
  public totalPages: number = 0;
  public medCoinDatas: any;
  show1: boolean = false;
  show2: boolean = false;
  show3: boolean = false;
  show4: boolean = false;
  show5: boolean = false;
  show6: boolean = false;
  show7: boolean = false;
  constructor(
    private _coinService: MedcoinService,
    private _dashboardService: UserDashboardService
  ) {}
  originalData: any;

  ngOnInit(): void {
    this.pageNumber = 0;
    // this.linkCopied = false;
    // const items = document.querySelectorAll('.accordion a');
    // function toggleAccordion() {
    //   this.classList.toggle('active');
    //   this.nextElementSibling.classList.toggle('active');
    // }
    // items.forEach((item) => item.addEventListener('click', toggleAccordion));
    this.getMedCoinDetails(0);
    this.fetchReferAndEarn();
  }

  getMedCoinDetails(pageNo) {
    this._coinService.get_user_medcoin_details(pageNo).subscribe(
      (res: any) => {
        if (res.error == false) {
          this.originalData = JSON.parse(JSON.stringify(res.data));
          this.medCoinDatas = JSON.parse(JSON.stringify(res.data));
          //console.log(this.medCoinDatas);
          //console.log(this.originalData);
          if (this.originalData.transactionHistory.length == 0) {
            this.viewMore = false;
            this.viewLess = false;
          }
          //console.log(this.originalData.transactionHistory.length);
          if (this.originalData.transactionHistory.length > 3) {
            this.medCoinDatas.transactionHistory =
              this.originalData.transactionHistory.slice(0, 3);
          } else {
            this.viewMore = false;
          }
        } else {
        }
      },
      (err: any) => {
        //console.log(err.error);
      }
    );
  }
  viewAll() {
    this.viewLess = true;
    this.viewMore = false;
    this.medCoinDatas.transactionHistory = [
      ...this.originalData.transactionHistory,
    ];
  }
  view3() {
    this.viewMore = true;
    this.viewLess = false;
    this.medCoinDatas.transactionHistory =
      this.originalData.transactionHistory.slice(0, 3);
  }
  // viewNextPage() {
  //   if (this.medCoinDatas.hasNextPage == false) {
  //     return;
  //   } else {
  //     this.pageNumber++;
  //     this.getMedCoinDetails(this.pageNumber);
  //   }
  // }
  // viewPreviousPage() {
  //   this.pageNumber--;
  //   this.getMedCoinDetails(this.pageNumber);
  // }
  openWhatsApp() {
    window.open(
      `whatsapp://send?text= Download MediMall app from PlayStore https://medfolio.page.link/Yp9BqdjcfPwuoWjPA use referral code ${this.referralCode}`
    );
  }
  openWhatsappWeb() {
    // this.linkCopied = true;
    // this.timeLeft = 15;
    // this.startTimer();

    window.open(
      `https://web.whatsapp.com://send?text= Download MediMall app from PlayStore https://medfolio.page.link/Yp9BqdjcfPwuoWjPA use referral code ${this.referralCode}`
    );
  }
  // startTimer() {
  //   this.interval = setInterval(() => {
  //     if (this.timeLeft > 0) {
  //       this.timeLeft--;
  //     } else {
  //       // this.timeLeft = 60;
  //       this.pauseTimer();
  //     }
  //   }, 1000);
  // }

  // pauseTimer() {
  //   this.timeLeft = 0;
  //   this.linkCopied = false;
  //   clearInterval(this.interval);
  // }

  alertErr(message) {
    //console.log(message);
    Swal.fire({
      icon: 'error',
      title: message,
    });
  }
  /* To copy any Text */
  copyText() {
    const text = `Download MediMall app from PlayStore https://medfolio.page.link/Yp9BqdjcfPwuoWjPA use referral code ${this.referralCode}`;
    // this.currentURL = text;

    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    textField.focus(); //SET FOCUS on the TEXTFIELD
    document.execCommand('copy');
    textField.remove();
    //console.log('should have copied ' + text);

    Swal.fire({
      text: 'Referal link copied',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3085d6',
      imageHeight: 1000,
    });
  }
  fetchReferAndEarn() {
    this._dashboardService.fetchReferraldetails().subscribe(
      (res: any) => {
        //console.log(res);
        if (res.error === false) {
          this.referralCode = JSON.parse(JSON.stringify(res.data.referralCode));
        } else {
        }
      },
      (err: any) => {
        //console.log('server refused to connect');
      }
    );
  }
  openTerms() {
    const text = `Terms of service are the legal agreements between a service provider and a person who wants to use that service. The person must agree to abide by the terms of service in order to use the offered service. Terms of service can also be merely a disclaimer, especially regarding the use of websites.`;
    // alert(terms)
    Swal.fire({
      text,
      showConfirmButton: false,
      showCancelButton: false,
      width: 400,
      heightAuto: false,
      showCloseButton: true,
    });
  }
}
