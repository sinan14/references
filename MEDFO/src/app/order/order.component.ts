import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { OrderMedicineService } from '../services/order-medicine.service';
import { HealthVaultService } from '../services/health-vault.service';
import Swal from 'sweetalert2';
import { CartService } from 'src/app/services/cart.service';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { UserAuthService } from '../services/user-auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  public whatsappNumber = environment.whatsappNumber;

  public imageLoading :boolean = false;
  public addLoading: boolean = false;
  //whatsappNumber: any = 8281025213;
  public vimeoVideoHOwTo: any;
  public medicineThumbnail: any;
  public medicineVideo: any;
  public topIcons: any;
  public offerSlider: any;
  public arrow: string = 'fa fa-angle-right';
  public hide: boolean = false;
  public flag: boolean = true;
  public border1: number = 0;

  public healthdataClicked: boolean = false;
  public containGuidFlag: boolean = false;

  //Prescription Variables
  public prescriptionImageURLArray: any = [];
  public prescription_id: any;
  public Health_Vault_Array: any = [];

  constructor(
    public _router: Router,
    public orderMedicine: OrderMedicineService,
    public _sanitizer: DomSanitizer,
    private Health_Vault_Service: HealthVaultService,
    public _cartService: CartService,
    public _prescriptionService: PrescriptionService,
    private _auth: UserAuthService
  ) {}
  offerscustomOptions: OwlOptions = {
    loop: false,
    autoplay: true,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 2,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
  };

  ngOnInit(): void {
    this.get_All_prescriptions();

    this.orderMedicine.getOrderMedicine().subscribe((res) => {
      this.medicineThumbnail = res.data.orderMedicine.thumbnail;
      //this.medicineVideo=res.data.orderMedicine.video
      this.vimeoVideo(res.data.orderMedicine.video);
      console.log(this.medicineThumbnail);
      console.log(this.medicineVideo);
      this.topIcons = res.data.top3Icons;
      this.offerSlider = res.data.slider;
      this.offersFromPayment();
    });
  }
  ngAfterViewInit() {
    $(document).ready(function () {
      //@ts-ignore
      $('#how_to').owlCarousel({
        loop: true,
        margin: 0,
        dots: true,
        nav: false,
        items: 1,
      });
    });
  }
  dontHaveOrder() {
    this.flag = !this.flag;
    if (this.flag == true) {
      this.arrow = 'fa fa-angle-right';
      this.hide = false;
      this.border1 = 0;
    } else if (this.flag == false) {
      this.arrow = 'fa fa-angle-down';
      this.hide = true;
      this.border1 = 1;
    }
  }
  sliderDirection(data) {
    if (data.type == 'category') {
      this._router.navigate(['/product-list/' + data.categoryId, data.typeId]);
    }
    if (data.type == 'product') {
      this._router.navigate([
        '/product-detail',
        data.typeName,
        data.typeId,
        data.brand,
        data.metaTitles,
      ]);
    }
  }
  vimeoVideo(vid: any) {
    // this.vimeoVideoHOwTo ='https://player.vimeo.com/video/' + vid.url + '?h=6e8a309fa0';
    this.vimeoVideoHOwTo = this._sanitizer.bypassSecurityTrustResourceUrl(
      `https://player.vimeo.com/video/${vid}?h=6e8a309fa0`
    );
    console.log(this.vimeoVideoHOwTo);
  }

  get_All_prescriptions() {
    this._prescriptionService.get_prescription().subscribe((res: any) => {
      console.log(res);
    });
  }

  //Prescription add
  uploadPrescritpion(event: any, type: any) {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    this.imageLoading = true;
    Img.onload = (e: any) => {
      let content = reader.result as string;
      let presPath = content;

      const formData = new FormData();
      formData.append('prescription', file);

    
    this._prescriptionService.upload_image(formData).subscribe((res:any)=>{
      console.log(res);
          if(!res.error){
            this.prescriptionImageURLArray.push(res.data.images[0]);
            this.imageLoading = false;
          }
          else{
            this.imageLoading = false;
            Swal.fire({
            icon: 'warning',
            title: res.message,
          });
        }
      });
    };
    // console.log(this.Upload_Image,"Change ")

    // }
    // else if (type === 'healthdata') {
    //   console.log('healthdata');

    //   // this._router.navigate(['/dashboard-order-details/health-vault'])
    //   // document.getElementById('dismiss-upload-prescription').click()
    //   // alert("choose healthdata");
    // }
  }
  //Prescription  remove
  removePrescription(index) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        let data: any = [];
        data = this.prescriptionImageURLArray.filter(
          (res: any) => res != index
        );
        this.prescriptionImageURLArray = data;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  Get_Health_Vault_Data() {
    this.healthdataClicked = !this.healthdataClicked;
    // document.getElementById('dismiss-upload-prescription').click()
    this.Health_Vault_Service.get_user_health_vault().subscribe((res: any) => {
      console.log(res, 'health vault data');
      this.Health_Vault_Array = [];
      this.Health_Vault_Array = res.data;

      if(this.Health_Vault_Array.length==0){
        Swal.fire({
          icon: 'warning',
          title: 'No health data found',
        });
      }
      if(this.prescriptionImageURLArray.length!=0){
        this.prescriptionImageURLArray.forEach((pres :any,ind:any) => {
          this.Health_Vault_Array.forEach((element :any,index:any) => {
            if(pres === element.prescription){
                element.checkedFlag = true;
            }
          });
        });
      }
    });
  }

  Select_Health_Data(event, item) {
    if (event.target.checked) {
      console.log(item);
      //this.Health_Data_Image = item.prescription

      this.prescriptionImageURLArray.push(item.prescription);
      console.log(this.prescriptionImageURLArray);
    } else {
      let data: any = [];
      data = this.prescriptionImageURLArray.filter(
        (res: any) => res != item.prescription
      );
      this.prescriptionImageURLArray = data;

      console.log(data);
    }
  }

  Continue_Prescription_Click() {
    if (this.prescriptionImageURLArray.length == 0) {
      this.prescriptionImageURLArray = [];
      this.Health_Vault_Array = [];
      Swal.fire({
        icon: 'warning',
        title: 'Please upload prescription',
      });
      return;
    }
    this.addLoading = true;
    const formData = new FormData();
    let input = {
      prescription: this.prescriptionImageURLArray,
    };
    this._prescriptionService.add_prescription(input).subscribe((res: any) => {
      console.log(res);
      if (!res.error) {
        this.addLoading = false;
        this.Health_Vault_Array = [];
        this.prescriptionImageURLArray = [];
        document.getElementById('dismiss-upload-prescription').click();
        Swal.fire({
          icon: 'success',
          title: res.message,
        });
      }
    });
  }

  offersFromPayment() {
    $(document).ready(function () {
      //@ts-ignore
      $('#paymentOffers').owlCarousel({
        loop: false,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        autoplay: true,
        margin: 10,
        nav: false,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
        responsive: {
          0: {
            items: 3,
          },
          600: {
            items: 3,
          },
          768: {
            items: 4,
          },
          1000: {
            items: 6,
          },
        },
      });
    });
  }
  openLoginScreen() {
    if (this._auth.loggedIn() == false) {
      document.getElementById('login-button').click();
      return;
    } else {
      this.Health_Vault_Array = [];
      this.prescriptionImageURLArray = [];
      document.getElementById('popup-upload-prescription').click();
    }
  }

  openWhatsApp() {
    console.log(this.whatsappNumber);

    window.open(`whatsapp://send?phone=+91 ${this.whatsappNumber}`);
  }

  openWhatsappWeb() {
    console.log(this.whatsappNumber);
    // window.open(
    //   `https://api.whatsapp.com/send?phone=+91 ${this.whatsappNumber}`
    // );
  }
  callNow() {
    const num = `tel:+91${this.whatsappNumber}`;
    var aTag = document.createElement('a');
    aTag.setAttribute('href', num);
    aTag.click();
  }

  prescriptionGuidClick() {
    this.containGuidFlag = !this.containGuidFlag;
  }
}
