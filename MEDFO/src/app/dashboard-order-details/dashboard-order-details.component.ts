import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserDashboardService } from '../services/user-dashboard.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
@Component({
  selector: 'app-dashboard-order-details',
  templateUrl: './dashboard-order-details.component.html',
  styleUrls: ['./dashboard-order-details.component.css'],
})
export class DashboardOrderDetailsComponent implements OnInit {
  constructor(
    public _userService: UserDashboardService,
    private _router: Router,
    private route: ActivatedRoute,
    public _authenticationService: UserAuthService
  ) {}
  ngOnInit(): void {
    this._userService.getPersonalDetails();
    this._userService.getFamilyMembers();

    this._userService.familyUpdated.subscribe((data: any) => {
      if (data === true) {
        console.log(true);

        this._userService.getFamilyMembers();
      }
    });
    this._userService.personalUpdated.subscribe((data: any) => {
      if (data === true) {
        console.log(true);
        this._userService.getPersonalDetails();
      }
    });
  }
  ngAfterViewInit() {
    const items = document.querySelectorAll('.accordion a');
    function toggleAccordion() {
      this.classList.toggle('active');
      this.nextElementSibling.classList.toggle('active');
    }
    items.forEach((item) => item.addEventListener('click', toggleAccordion));
    var elems = document.querySelectorAll('a li');

    elems.forEach((item) => item.addEventListener('click', myFunction));

    function myFunction(e) {
      [].forEach.call(elems, function (el) {
        el.classList.remove('active_dsh_lft');
      });
      e.target.className = 'active_dsh_lft';
    }
  }

  onChangeProfile(event: any, width: any, height: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);
    Img.onload = (e: any) => {
      const fd = new FormData();
      fd.append('image', file);
      this._userService.updateUserImage(fd).subscribe(
        (res: any) => {
          console.log(res);
          if (res.error == false) {
            this.winpop(res.message);
            this._userService.getPersonalDetails();
          } else {
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    };
  }
  winpop(msg: any) {
    console.log(msg);
    Swal.fire({
      icon: 'success',
      title: `${msg}`,
    });
  }
  errorMessage(msg: any) {
    console.log(msg);

    Swal.fire({
      icon: 'error',
      title: `${msg}`,
    });
  }
  serverError(error) {
    console.log('server refused to connect');
    console.log(error);
  }

  public arr: any = [
    {
      que: `How do I check my referral codes?`,

      ans: `You can find your referral code in the refer & earn section below the profile section of the Medimall app.`,
    },

    {
      que: `How can I refer my friend to Medimall?`,

      ans: `Once you've checked the referral code, you can send it to your friends via Whatsapp, SMS, or any other method. You will receive your reward when your friend uses the code to install the Medimall app and makes their first purchase.`,
    },
    {
      que: `Is there an expiration date for referral codes?`,

      ans: `No, the referral codes have no expiration date.`,
    },

    {
      que: `How long does it take to get a reward?`,

      ans: `When the friend you referred purchases through the application, you will receive the referral reward within 7 days once the product is delivered.`,
    },

    {
      que: `How will I get my reward?`,

      ans: `Your reward will be in the form of MedCoins, which you can use to buy medicines and healthcare products for yourself and your family.`,
    },

    {
      que: `Are there any limits on the most number of referrals that can be made?`,

      ans: `No, there is no limit. You can make as many referrals and get rewards as you want.`,
    },
    {
      que: `Why didn't I receive the reward?`,

      ans: `Your friend did not use your code when logging in the Medimall application. 
  
  Your friend entered your code but did not create an account or make any purchases with it.
  
  The person who used the referral code has already purchased from Medimall and is an existing customer.
  
  If your referral does not fall into one of the above criteria and you have not received your reward, please contact our customer service representatives.`,
    },
    {
      que: `How many referrals do I need to qualify for a reward?`,

      ans: `You will be rewarded for each user you refer. There are no lower or upper limits.`,
    },
    {
      que: `How do I check the status of my referral benefits?`,

      ans: `You can view your referral benefits under the profile section in the Medimall application.`,
    },
  ];
}
