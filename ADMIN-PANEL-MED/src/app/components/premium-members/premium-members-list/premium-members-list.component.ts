import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PremiumService } from '../../../services/premium.service';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-premium-members-list',
  templateUrl: './premium-members-list.component.html',
  styleUrls: ['./premium-members-list.component.scss'],
})
export class PremiumMembersListComponent implements OnInit {
  premium_table: any = [];

  public closeResult: string;
  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;
  activeAll: any;
  activeLength: number;
  allMembers: any;
  allLength: number;
  public searchFlag: boolean;
  public SearchPage: any;
  public Searchval: any;
  public List_Type: any;
  public LIST_ARRAY: any = [];
  public pageSize: any;
  public searchResult: any;

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public addFlag: boolean;

  constructor(
    private modalService: NgbModal,
    private _route: Router,
    private intl: IntlService,
    private _router: Router,
    private premium: PremiumService,
    private permissionService: PermissionService,
    private location: Location
  ) {}
  public CurrentPage: any;
  public PageSize: any;
  public TotalRecords: any;
  public hasNextPage: boolean;
  public hasPrevPage: boolean;
  public pagingCounter: 1;
  public totalPages: any;
  public pageNo: number = 1;
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop());
    }

    this.searchFlag = false;
    let page = 1;
    this.get_LIST_PREMIUM_PRODUCTS(page);
  }

  disableTab(value) {
    if (this.user.isAdmin === true) {
      let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    } else if (this.user.isStore === true) {
      let flag = this.permissionService.setPrivilages(value, this.user.isStore);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    } else {
      let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
  }

  get_LIST_PREMIUM_PRODUCTS(pg) {
    this.searchFlag = false;

    let body = {
      limit: 10,
      page: pg,
    };
    this.premium.fetchAllactiveMember('all', pg).subscribe((res: any) => {
      this.allMembers = res.data.finalResult;
      this.allLength = this.allMembers.length;
      this.LIST_ARRAY = [];
      console.log(res, 'getting list res', this.List_Type);
      // this.pageSize = res.data.PageSize.toString()
      this.totalPages = res.data.total_items;
      this.CurrentPage = res.data.current_page;
      this.hasNextPage = res.data.hasNextPage;
      this.hasPrevPage = res.data.hasPrevPage;

      console.log(this.LIST_ARRAY, 'LIST_ARRAY');
    });
    this.premium.fetchAllactiveMember('active', pg).subscribe((res: any) => {
      console.log('active=' + res);
      this.activeAll = res.data.finalResult;
      this.activeLength = res.data.finalResult;
      this.totalPages = res.data.total_items;
      this.CurrentPage = res.data.current_page;
      this.hasNextPage = res.data.hasNextPage;
      this.hasPrevPage = res.data.hasPrevPage;
    });
  }

  open(content, Value: any) {
    console.log(Value);
    if (Value === 'add') {
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (Value === 'edit') {
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (Value === '') {
      this.update_Modal_Flag = false;
      this.add_Modal_Flag = false;
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
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
  }
  searchPremiumList(e: any) {
    console.log(e);

    this.premium.searchPremium('all', this.pageNo, e).subscribe((res: any) => {
      this.allMembers = res.data.finalResult;
      this.allLength = this.allMembers.length;

      console.log(res, 'getting list res', this.List_Type);

      this.totalPages = res.data.total_items;
      this.CurrentPage = res.data.current_page;
      this.hasNextPage = res.data.hasNextPage;
      this.hasPrevPage = res.data.hasPrevPage;
    });
    this.premium
      .searchPremium('active', this.pageNo, e)
      .subscribe((res: any) => {
        this.activeAll = res.data.finalResult;
        this.activeLength = res.data.finalResult;
        this.totalPages = res.data.total_items;
        this.CurrentPage = res.data.current_page;
        this.hasNextPage = res.data.hasNextPage;
        this.hasPrevPage = res.data.hasPrevPage;
      });
  }

  onPageChange(data) {
    console.log(data);
    this.get_LIST_PREMIUM_PRODUCTS(data);
    this.pageNo = data;
  }
  Customer_Detail_pg(id: any) {
    this._router.navigate(['customer-details/cust/' + id]);
  }
}
