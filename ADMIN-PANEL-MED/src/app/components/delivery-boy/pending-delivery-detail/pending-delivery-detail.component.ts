import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { DeliveryBoyService } from '../delivery-boy.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-pending-delivery-detail',
  templateUrl: './pending-delivery-detail.component.html',
  styleUrls: ['./pending-delivery-detail.component.scss']
})
export class PendingDeliveryDetailComponent implements OnInit {

  public listStore: Array<string> = ['Store 1', 'Store 2', 'Store 3', 'Store 4'];
  public listPincode: Array<string> = ['Pincode 1', 'Pincode 2', 'Pincode 3', 'Pincode 4'];

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

  public List_Array: any = []
  public loading: boolean
  public _id: any;

  constructor(private modalService: NgbModal,
    private _route: Router,
    private intl: IntlService,
    private _router: Router,
    private permissionService: PermissionService,
    private location: Location,
    private Delivery_Boy_Service: DeliveryBoyService,
    private route: ActivatedRoute,) { }
    public paramsSubscription: Subscription;
  ngOnInit(): void {
    console.log(this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this._id = params['id'];
      console.log(this._id);

      this.Get_By_Id(this._id)
    });
  }

  disableTab(value) {
    let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
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
    this._router.navigate(['/delivery-boys']);
    localStorage.setItem("TabID", "tab-selectbyid1");
  }

  Get_By_Id(id) {
    this.Delivery_Boy_Service.fetchBoyById(id).subscribe((res: any) => {
      this.loading = true
      console.log(res, "res");
      this.List_Array = []
      this.List_Array = res.data
      this.loading = false
    })
  }

}
