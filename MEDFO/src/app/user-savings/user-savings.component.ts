import { Component, OnInit } from '@angular/core';
import { PremiumMembershipService } from '../services/premium-membership.service';

@Component({
  selector: 'app-user-savings',
  templateUrl: './user-savings.component.html',
  styleUrls: ['./user-savings.component.css'],
})
export class UserSavingsComponent implements OnInit {
  constructor(private _premiumService: PremiumMembershipService) {}
  myBenefits: any = {
    allottedFreeDelivery: 2,
    cashBack: 5,
    cashBackAmount: 0,
    daysAfterMemberShipPurchase: 0,
    deliveryCharges: 0,
    discount: 0,
    duration: 4,
    endDate: '20-04-2022',
    fakeArray: [1, 1],
    freeDelivery: 2,
    freeDeliveryLeftInWords: 'two',
    freeDeliveryUsed: 0,
    miniMumOffer: 15,
    paymentGateway: 'razorpay',
    planId: '61569895ab515e27cb34dd7d',
    planName: 'PLATINUM',
    startDate: '20-12-2021',
    _id: '61c0095a9f7927448b74a822',
  };

  ngOnInit(): void {
    this.fetchUserPremiumDetails();
  }

  fetchUserPremiumDetails() {
    this._premiumService.get_user_membership_benefits().subscribe(
      (res: any) => {
        console.log(res);
        if (res.status == true) {
          this.myBenefits = JSON.parse(JSON.stringify(res.data));
          this.myBenefits.freeDeliveryUsed =
            this.myBenefits.allottedFreeDelivery - this.myBenefits.freeDelivery;
            

          this.myBenefits.fakeArray = Array(
            this.myBenefits.allottedFreeDelivery
          ).fill(1);
          // .map((x, i) => i + 1); /*[1,2,3,4,5]*/
        } else {
        }
      },
      (error: any) => {
        console.log('error.error');
      }
    );
  }
}
