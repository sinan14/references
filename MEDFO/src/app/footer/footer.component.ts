import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderMedicineService } from '../services/order-medicine.service';
import { UserAuthService } from '../services/user-auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public whatsappNumber = environment.whatsappNumber;
public medicineName:any
currentURL: string;
  constructor(
    public _auth:UserAuthService,
    public _router: Router,
    public orderMedi:OrderMedicineService) { }

  ngOnInit(): void {
    this.currentURL = window.location.href;
  }
  orderMedicine(){
    this.orderMedi.getActiveMedicine().subscribe(res=>{
    
      this.medicineName=res.data;
    })
  }
  orderMedicineRoute(){
    document.getElementById('dismiss-refund2').click();
    this._router.navigate(['/order'])
  }


  openWhatsApp() { 
    window.open(`https://api.whatsapp.com/send?phone=+91${this.whatsappNumber}`);
  }

  
}
