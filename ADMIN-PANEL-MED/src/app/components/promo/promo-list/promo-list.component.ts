import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { PageChangeEvent } from "@progress/kendo-angular-grid";
import { PromoServiceService } from 'src/app/services/promo-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-promo-list',
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.scss']
})
export class PromoListComponent implements OnInit {

  public viewFlags: boolean;
  public editFlags: boolean;




  promo_table = [
    {
      slno: "1",
      ordertype: "Normal Order",
      area: "Normal",
      type: "Medimall",
      promoname: "100",
      code: "x353g",
      percentage: "10",
      amount: "100"
    },
    {
      slno: "2",
      ordertype: "First Order",
      area: "Premium",
      type: "Premium Subscription",
      promoname: "100",
      code: "xxxx",
      percentage: "20",
      amount: "100"
    },
    {
      slno: "3",
      ordertype: "Third Order",
      area: "Premium",
      type: "Subscription",
      promoname: "100",
      code: "12423",
      percentage: "30",
      amount: "100"
    },
    {
      slno: "4",
      ordertype: "Fifth Order",
      area: "Premium",
      type: "Subscription",
      promoname: "100",
      code: "12423",
      percentage: "30",
      amount: "100"
    },


  ];

  active_promo_table = [
    {
      slno: "1",
      name: "Basic Promotion Day Base",
      offer: "Flat 50",
      period: "01 Dec 2020 to 02 Jan 2021",
      coupon: "Hello20",
      performance: "People used this",
    },
    {
      slno: "2",
      name: "Basic Promotion Day Base",
      offer: "Flat 50",
      period: "01 Dec 2020 to 02 Jan 2021",
      coupon: "Hello20",
      performance: "People used this",
    },
    {
      slno: "3",
      name: "Basic Promotion Day Base",
      offer: "Flat 50",
      period: "01 Dec 2020 to 02 Jan 2021",
      coupon: "Hello20",
      performance: "People used this",
    },
    {
      slno: "4",
      name: "Basic Promotion Day Base",
      offer: "Flat 50",
      period: "01 Dec 2020 to 02 Jan 2021",
      coupon: "Hello20",
      performance: "People used this",
    },
  ];

  public closeResult: string;
  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;



  public ALL_PROMO_ARRAY: any = [];
  public ACTIVE_PROMO_ARRAY: any = [];
  public DEACTIVE_PROMO_ARRAY: any = [];
  public EXPIRED_PROMO_ARRAY: any = [];
  public loading: boolean = false;


  public skip = 0;

  constructor(private modalService: NgbModal,
    private intl: IntlService,
    private _router: Router,
    private permissionService: PermissionService,
    private location: Location,
    private Promo_Service: PromoServiceService) { }


  ngAfterViewInit() {
    localStorage.clear();
    //console.log(this.tabSet.activeTab);
  }


  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }
    this.get_PROMO_CODE_BY_TYPE('all')
  }


  get_PROMO_CODE_BY_TYPE(type) {
    this.loading = true;
    this.ALL_PROMO_ARRAY = []
    this.Promo_Service.get_PROMO_CODE_BY_TYPE(type).subscribe((res: any) => {
      console.log(res, "type res");
      let mappedData = res.data.map((itm, index) => {
        return {





          no: index + 1,
          _id: itm._id,
          type: itm.type,
          name: itm.name,
          code: itm.code,
          customerType: itm.customerType,
          maximumAmount: itm.maximumAmount,
          percentage: itm.percentage,
          promotionType: itm.promotionType,
        }
      });
      this.ALL_PROMO_ARRAY = mappedData
      this.loading = false;
      console.log(this.ALL_PROMO_ARRAY, "array get");

    })
  }



  get_ACTIVE_DEACTIVE_PROMO(type) {
    // this.PROMO_ARRAY = []
    this.loading = true
    this.Promo_Service.get_ACTIVE_DEACTIVE_PROMO(type).subscribe((res: any) => {
      console.log(res);

      if (type == 'activated') {
        this.ACTIVE_PROMO_ARRAY = []
        let mappedData = res.data.map((itm, index) => {
          return {
            no: index + 1,
            _id: itm._id,
            type: itm.type,
            name: itm.name,
            code: itm.code,
            customerType: itm.customerType,
            maximumAmount: itm.maximumAmount,
            percentage: itm.percentage,
            promotionType: itm.promotionType,

          }
        });
        this.ACTIVE_PROMO_ARRAY = mappedData
      } else if (type == 'deactivated') {
        this.DEACTIVE_PROMO_ARRAY = []
        let mappedData = res.data.map((itm, index) => {
          return {
            no: index + 1,
            _id: itm._id,
            type: itm.type,
            name: itm.name,
            code: itm.code,
            customerType: itm.customerType,
            maximumAmount: itm.maximumAmount,
            percentage: itm.percentage,
            promotionType: itm.promotionType,

          }
        });
        this.DEACTIVE_PROMO_ARRAY = mappedData
      }
      this.loading = false;
    })
  }

  get_EXPIRED_PROMO() {
    this.loading = true
    this.Promo_Service.get_EXPIRED_PROMO().subscribe((res: any) => {
      console.log(res);
      this.EXPIRED_PROMO_ARRAY = []
      let mappedData = res.data.map((itm, index) => {
        return {
          no: index + 1,
          _id: itm._id,
          type: itm.type,
          name: itm.name,
          code: itm.code,
          customerType: itm.customerType,
          maximumAmount: itm.maximumAmount,
          percentage: itm.percentage,
          promotionType: itm.promotionType,
        }
      });
      this.EXPIRED_PROMO_ARRAY = mappedData
      this.loading = false;
    })
  }

  TabChange(change) {
    if (change.nextId == 'all') {
      this.get_PROMO_CODE_BY_TYPE('all')
    } else if (change.nextId == 'activated') {
      this.get_ACTIVE_DEACTIVE_PROMO('activated')
    } else if (change.nextId == 'deactivated') {
      this.get_ACTIVE_DEACTIVE_PROMO('deactivated')
    } else if (change.nextId == 'expired') {
      this.get_EXPIRED_PROMO()
    }
    this.skip = 0
  }

  Deactivate_Promo(id) {

    let body = {
      status: true
    }
    Swal.fire({
      title: 'Do you want to deactivate?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this.Promo_Service.activate_deactivate_PROMO_CODE(id, body).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

  }

  disableTab(value){
    if(this.user.isAdmin === true){
      let flag = this.permissionService.setPrivilages(value,this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
    else   if(this.user.isStore === true){
      let flag = this.permissionService.setPrivilages(value,this.user.isStore);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
    else{
      let flag = this.permissionService.setPrivilages(value,this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
  }


  open(content, Value: any) {
    console.log(Value)
    if (Value === 'add') {
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value === 'edit') {
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }


    else if (Value === '') {
      this.update_Modal_Flag = false;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  BackRedirectTo() {
    this._router.navigate(['/delivery-boys'])
  }


  viewPromoDetails(id) {
    this._router.navigate(['/promo/create-promo/' + id + '/view']);
    this.editFlags = true;
    localStorage.setItem("EditFlag", "false");
  }

  editPromoDetails(id) {
    this._router.navigate(['/promo/create-promo/' + id + '/edit']);
    this.viewFlags = true;
    localStorage.setItem("EditFlag", "true");
  }



  // editPromoDetails() {
  //   this._router.navigate(['/promo/edit-promo']);
  //   this.viewFlags = true;
  //   localStorage.setItem("EditFlag", "true");
  // }


  Delete(id) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this.Promo_Service.delete_PROMO_CODE(id).subscribe((res: any) => {
          console.log(res, "del res");
          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });




  }











  pop(res: any) {
    if (res.status === true) {
      Swal.fire({
        text: res.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
      this.skip = 0;
      this.get_PROMO_CODE_BY_TYPE('all')
      this.get_ACTIVE_DEACTIVE_PROMO('activated')
      this.get_ACTIVE_DEACTIVE_PROMO('deactivated')
      this.get_EXPIRED_PROMO()
    } else {
      Swal.fire({
        text: res.data,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
    }
    // this.addLoading = false;
    // this.submitted = false;
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    //  this.get_ALL_BRANDS()
    // this.Brands({ activeId: 'all', nextId: 'promoted' })
    // this.Brands({ activeId: 'all', nextId: 'shop' })
    // this.Brands({ activeId: 'all', nextId: 'trending' })
    // this.Brands({ activeId: 'all', nextId: 'featured' })
  }




}
