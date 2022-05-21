import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { SharedServiceService } from 'src/app/shared-service.service';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { DeliveryBoyService } from '../delivery-boy.service';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-delivery-boys',
  templateUrl: './delivery-boys.component.html',
  styleUrls: ['./delivery-boys.component.scss'],
})
export class DeliveryBoysComponent implements OnInit {
  public listingQB: boolean = true;
  public start: any = new Date(2000, 11, 24);
  public end: any = new Date(2100, 11, 24);
  public sample = {
    boy: '',
    id: '',
    StartingDate: this.start,
    EndingDate: this.end,
    pageNo: 1,
    searchBy: '',
  };
  @ViewChild('multiselect')
  public multiselect: MultiSelectComponent;
  ngAfterViewInit() {
    localStorage.clear();
  }

  public pendingToAdminStartDateAndEndDate: any = { ...this.sample };
  public paidToBoyStartDateAndEndDate: any = { ...this.sample };
  public paidToAdminStartDateAndEndDate: any = { ...this.sample };
  public payableToBoyStartDateAndEndDate: any = { ...this.sample };
  public queryBoyStartDateAndEndDate: any = { ...this.sample };

  public gridView: GridDataResult;
  public skip = 0;
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }
  public hasErrorReplay: boolean = false;
  public replayForm: FormGroup = new FormGroup({
    queryId: new FormControl(null),
    reply: new FormControl(null, Validators.required),
  });
  onSubmitReplay() {
    console.log(this.replayForm.value);

    this._boySerivice.replayToQuery(this.replayForm.value).subscribe(
      (res: any) => {
        this.modalService.dismissAll();
        console.log(res);
        // this.queryBoyData = this.queryBoyData.filter(
        //   (q) => q._id !== this.replayForm.get('queryId').value
        // );
        // if (this.queryBoyData.length > 0) {
        //   this.queryBoyData.forEach((item, index) => {
        //     item.sl = index + 1;
        //   });
        // }
        this.replayForm.patchValue({
          queryId: null,
          reply: null,
        });

        if (res.status) {
          this.handleQueryBoy(this.queryBoyStartDateAndEndDate);
          this.alertMsg('success', res.data);
        } else {
          this.alertMsg('error', res.data);
        }
      },
      (err: any) => {
        this.modalService.dismissAll();

        //
      }
    );
  }
  public isValidReplay(controlName) {
    return (
      (this.replayForm.get(controlName).invalid &&
        this.replayForm.get(controlName).touched) ||
      (this.hasErrorReplay && this.replayForm.get(controlName).invalid)
    );
  }
  public pendingBoysWithIndex: any = [];
  public acitveBoysWithIndex: any = [];
  public checkboxValue: boolean;

  private tabSet: ViewContainerRef;
  @ViewChild(NgbTabset) set content(content: ViewContainerRef) {
    this.tabSet = content;
  }
  selectedTab = '';

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public paidToAdmin: any = {
    table: [],
    pageData: {},
  };
  public pendingToAdminData: any = [];
  public queryBoyData: any = [];

  public payableToBoyData: any = [];
  public paidToBoy: any = {
    table: [],
    pageData: {},
  };
  public activeBoysForSearch: any = [];

  public loading: boolean;

  constructor(
    private _router: Router,
    private modalService: NgbModal,
    private shared_Service: SharedServiceService,
    private permissionService: PermissionService,
    private location: Location,
    private _boySerivice: DeliveryBoyService
  ) {}
  public totalCommission: any = 0;

  ngOnInit() {
    // console.log(this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));
    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(
        this.location.path().split('/').pop()
      );
      // console.log(this.permissions);
    }

    this.fetchActiveDeliveryBoys();
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

  fetchPendingDeliveryBoys() {
    this._boySerivice.fetchPendingBoy().subscribe(
      (res: any) => {
        if (res.status) {
          this.pendingBoysWithIndex = res.data;
          this.createIndex(this.pendingBoysWithIndex);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  async fetchActiveDeliveryBoys() {
    this.loading = true;
    this._boySerivice.fetchActiveBoy().subscribe(
      async (res: any) => {
        console.log(res);

        this.acitveBoysWithIndex = await res.data;

        await this.createIndex(this.acitveBoysWithIndex);
        this.activeBoysForSearch = [...this.acitveBoysWithIndex];
        console.log(this.activeBoysForSearch);
      },
      (error: any) => {
        console.log(error);
      }
    );
    this.loading = false;
  }
  alertMsg(icon, title) {
    Swal.fire({
      icon,
      title,
      showCancelButton: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3085d6',
      imageHeight: 500,
    });
  }
  pendingToAdminChange(boy: any) {
    //@ts-ignore
    document.getElementById('pendingToAdminEnd').value = '';
    //@ts-ignore
    document.getElementById('pendingToAdminStart').value = '';
    this.pendingToAdminStartDateAndEndDate = {
      boy,
      id: boy._id,
      StartingDate: this.start,
      EndingDate: this.end,
    };

    this.handlePendingToAdmin(this.pendingToAdminStartDateAndEndDate);
  }
  queryBoyChange(boy: any) {
    //@ts-ignore
    document.getElementById('queryBoyEnd').value = '';
    //@ts-ignore
    document.getElementById('queryBoyStart').value = '';
    this.queryBoyStartDateAndEndDate = {
      boy,
      id: boy._id,
      StartingDate: this.start,
      EndingDate: this.end,
    };

    this.handleQueryBoy(this.queryBoyStartDateAndEndDate);
  }
  paidToAdminChange(boy: any) {
    // console.log(boy);
    //@ts-ignore
    document.getElementById('paidToAdminEnd').value = '';
    //@ts-ignore
    document.getElementById('paidToAdminStart').value = '';

    this.paidToAdminStartDateAndEndDate = {
      boy,
      id: boy._id,
      StartingDate: this.start,
      EndingDate: this.end,
      pageNo: 1,
      searchBy: '',
    };
    this.handleShowPaidToAdmin(this.paidToAdminStartDateAndEndDate);
  }
  payableToBoyChange(boy: any) {
    //@ts-ignore
    document.getElementById('payableEnd').value = '';
    //@ts-ignore
    document.getElementById('payableStart').value = '';
    this.payableToBoyStartDateAndEndDate = {
      boy,
      id: boy._id,
      StartingDate: this.start,
      EndingDate: this.end,
    };
    this.handleShowPayable(this.payableToBoyStartDateAndEndDate);
  }
  paidToBoyChange(boy: any) {
    //@ts-ignore
    document.getElementById('paidToBoyEnd').value = '';
    //@ts-ignore
    document.getElementById('paidToBoyStart').value = '';
    console.log(boy);
    this.paidToBoyStartDateAndEndDate = {
      boy,
      id: boy._id,
      StartingDate: this.start,
      EndingDate: this.end,
      pageNo: 1,
      searchBy: '',
    };
    this.handleShowPaidToBoy(this.paidToBoyStartDateAndEndDate);
  }
  pendingToAdminFilter(str) {
    console.log(str);
    if (str.length >= 1) {
      console.log(str);
      this.activeBoysForSearch = this.acitveBoysWithIndex.filter(
        (s) => s.fullName.toLowerCase().indexOf(str.toLowerCase()) !== -1
      );
    } else {
      this.activeBoysForSearch = [...this.acitveBoysWithIndex];
    }
  }
  queryBoyFilter(str) {
    console.log(str);
    if (str.length >= 1) {
      console.log(str);
      this.activeBoysForSearch = this.acitveBoysWithIndex.filter(
        (s) => s.fullName.toLowerCase().indexOf(str.toLowerCase()) !== -1
      );
    } else {
      this.activeBoysForSearch = [...this.acitveBoysWithIndex];
    }
  }

  paidToAdminFilter(str) {
    console.log(str);
    if (str.length >= 1) {
      console.log(str);
      this.activeBoysForSearch = this.acitveBoysWithIndex.filter(
        (s) => s.fullName.toLowerCase().indexOf(str.toLowerCase()) !== -1
      );
    } else {
      this.activeBoysForSearch = [...this.acitveBoysWithIndex];
    }
  }
  payableToBoyFilter(str) {
    console.log(str);
    if (str.length >= 1) {
      console.log(str);
      this.activeBoysForSearch = this.acitveBoysWithIndex.filter(
        (s) => s.fullName.toLowerCase().indexOf(str.toLowerCase()) !== -1
      );
    } else {
      this.activeBoysForSearch = [...this.acitveBoysWithIndex];
    }
  }
  paidToBoyFilter(str) {
    console.log(str);
    if (str.length >= 1) {
      console.log(str);
      this.activeBoysForSearch = this.acitveBoysWithIndex.filter(
        (s) => s.fullName.toLowerCase().indexOf(str.toLowerCase()) !== -1
      );
    } else {
      this.activeBoysForSearch = [...this.acitveBoysWithIndex];
    }
  }

  Deactivate(itm: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change the status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this._boySerivice.update_Delivery_Status(itm._id).subscribe(
          (res: any) => {
            console.log(res);
            this.pop(res);
          },
          (err: any) => {
            console.log('server err');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // return itm.isActive = !itm.isisActive
        // this.checkboxValue = status
        // console.log(this.acitveBoysWithIndex[index].isActive);
        // console.log(status);
        // this.acitveBoysWithIndex[index].isActive = !status
        // console.log(this.acitveBoysWithIndex[index].isActive);
        // return event
      }
    });
  }

  Approve_Delivery_Boy(_id, _status) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        let body = {
          id: _id,
          status: _status,
        };
        this._boySerivice.approve_Delivery_Boy(body).subscribe(
          (res: any) => {
            console.log(res);
            this.pop(res);
            this.fetchPendingDeliveryBoys();
          },
          (err: any) => {
            console.log('server err');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.fetchActiveDeliveryBoys();
      }
    });
  }

  pop(res: any) {
    if (res.status === true) {
      this.alertMsg('success', res.data);

      this.skip = 0;
      this.fetchActiveDeliveryBoys();
      this.fetchPendingDeliveryBoys();
    } else {
      this.alertMsg('warning', res.data);
    }
  }

  payToAdmin(orderId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change status!',
      cancelButtonText: 'keep it ',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this._boySerivice
          .changePendingToAdminStatus({
            orderId,
            status: 'paid',
          })
          .subscribe((res: any) => {
            console.log(res);
            if (res.error == false) {
              this.alertMsg('success', 'Paid to admin successfully');
              this.handlePendingToAdmin(this.pendingToAdminStartDateAndEndDate);
            } else {
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  handlePendingToAdmin(data) {
    console.log(data);
    console.log('row data');
    const { StartingDate, EndingDate, id } = data;
    const st = new Date(StartingDate);
    const en = new Date(EndingDate);
    const body = { StartingDate: st, EndingDate: en, deliveryBoyId: id };
    this.showPendingToAdminId(body);
  }
  showPendingToAdminId(data) {
    this._boySerivice.showPendingToAdminId(data).subscribe((res: any) => {
      console.log(res);
      if (res.error == false) {
        this.pendingToAdminData = res.data.DatedPendingToAdmin;
        console.log(this.pendingToAdminData);
      } else {
      }
    });
  }

  handleQueryBoy(data) {
    console.log(data);
    console.log('row data');
    const { StartingDate, EndingDate, id } = data;
    const st = new Date(StartingDate);
    const en = new Date(EndingDate);
    if (id != '') {
      this.listingQB = false;
      const body = { StartingDate: st, EndingDate: en, DeliveryBoyID: id };
      this.showQueryBoy(body);
    } else {
      this.listingQB = true;
      this.listQueries({ StartingDate: st, EndingDate: en });
    }
  }
  listQueries(data) {
    this._boySerivice.listQueries(data).subscribe((res: any) => {
      console.log(res);
      if (res.error == false) {
        this.queryBoyData = res.data.DatedQueries;
      } else {
      }
    });
  }
  showQueryBoy(data) {
    this._boySerivice.queryById(data).subscribe((res: any) => {
      console.log(res);
      if (res.error == false) {
        this.queryBoyData = res.data.DatedQueriesDeliveryBoy;
        console.log(this.queryBoyData);
      } else {
      }
    });
  }

  //queryStart
  queryBoyFilterStartDate(StartingDate) {
    this.queryBoyStartDateAndEndDate.StartingDate = StartingDate;
    //@ts-ignore
    document.getElementById('queryEnd').value = '';
  }
  queryBoyFilterEndDate(date) {
    this.queryBoyStartDateAndEndDate.EndingDate = date;
    this.handleQueryBoy(this.queryBoyStartDateAndEndDate);
  }

  //pending to admin end
  pendingToAdminStartDate(StartingDate) {
    this.pendingToAdminStartDateAndEndDate.StartingDate = StartingDate;
    //@ts-ignore
    document.getElementById('pendingToAdminEnd').value = '';
  }
  pendingToAdminEndDate(date) {
    this.pendingToAdminStartDateAndEndDate.EndingDate = date;
    this.handlePendingToAdmin(this.pendingToAdminStartDateAndEndDate);
  }

  paidToAdminStartDate(StartingDate) {
    console.log(StartingDate);
    this.paidToAdminStartDateAndEndDate.StartingDate = StartingDate;
    //@ts-ignore
    document.getElementById('paidToAdminEnd').value = '';
  }

  paidToAdminEndDate(date) {
    this.paidToAdminStartDateAndEndDate.EndingDate = date;
    this.paidToAdminStartDateAndEndDate.pageNo = 1;
    this.handleShowPaidToAdmin(this.paidToAdminStartDateAndEndDate);
  }

  handleShowPaidToAdmin(data) {
    console.log(data);
    console.log('row data');
    const limit = 10;
    const { StartingDate, EndingDate, id, searchBy, pageNo } = data;
    const st = new Date(StartingDate);
    const en = new Date(EndingDate);
    if (searchBy == '') {
      const body = {
        StartingDate: st,
        EndingDate: en,
        deliveryBoyId: id,
        limit,
        pageNo,
      };
      this.showPaidToAdminId(body);
    } else {
      const body = {
        StartingDate: st,
        EndingDate: en,
        deliveryBoyId: id,
        searchBy,
        limit,
        pageNo,
      };
      this.showPaidToAdminId(body);
    }
  }
  showPaidToAdminId(body) {
    this._boySerivice.showPaidToAdminById(body).subscribe((res: any) => {
      console.log(res);
      if (res.error == false) {
        this.paidToAdmin.table = res.data.DatedPaidToAdmin;
        this.paidToAdmin.pageData = {
          current_page: res.data.current_page,
          hasNextPage: res.data.hasNextPage,
          hasPrevPage: res.data.hasPrevPage,
          total_items: res.data.total_items,
          // total_page: res.data.total_pages,
          total_page: 1,
        };

        console.log(this.paidToAdmin);
      } else {
      }
    });
  }
  //todo payable to delivery boy
  payableStartDate(date) {
    this.payableToBoyStartDateAndEndDate.StartingDate = date;
    //@ts-ignore
    document.getElementById('payableEnd').value = '';
  }
  payableEndDate(date) {
    this.payableToBoyStartDateAndEndDate.EndingDate = date;

    this.showPayableToDeliveryBoy(this.payableToBoyStartDateAndEndDate);
  }

  handleShowPayable(data) {
    const { StartingDate, EndingDate, id } = data;
    const st = new Date(StartingDate);
    const en = new Date(EndingDate);
    const body = { StartingDate: st, EndingDate: en, deliveryBoyId: id };
    this.showPayableToDeliveryBoy(body);
  }
  showPayableToDeliveryBoy(data) {
    this._boySerivice
      .showPayableToDeliveryBoyById(data)
      .subscribe((res: any) => {
        console.log(res);
        if (res.error == false) {
          this.payableToBoyData = res.data.DatedPendingDeliveryBoy;
          this.totalCommission = res.data.totalCommission;
          console.log(this.payableToBoyData);
        } else {
        }
      });
  }
  //payable to end

  //paid to delivery boy
  paidToBoyStartDate(date) {
    this.paidToBoyStartDateAndEndDate.StartingDate = date;
    //@ts-ignore
    document.getElementById('paidToBoyEnd').value = '';
  }
  paidToBoyEndDate(date) {
    this.paidToBoyStartDateAndEndDate.EndingDate = date;
    this.paidToBoyStartDateAndEndDate.pageNo = 1;
    this.handleShowPaidToBoy(this.paidToBoyStartDateAndEndDate);
  }

  handleShowPaidToBoy(data) {
    const limit = 10;
    const { StartingDate, EndingDate, id, pageNo, searchBy } = data;
    const st = new Date(StartingDate);
    const en = new Date(EndingDate);
    if (searchBy == '') {
      const body = {
        StartingDate: st,
        EndingDate: en,
        deliveryBoyId: id,
        limit,
        pageNo,
      };
      this.showPaidToDeliveryBoy(body);
    } else {
      const body = {
        StartingDate: st,
        EndingDate: en,
        limit,
        pageNo,
        deliveryBoyId: id,
        searchBy,
      };
      this.showPaidToDeliveryBoy(body);
    }
  }
  showPaidToDeliveryBoy(body) {
    this._boySerivice.showPaidToDeliveryBoyById(body).subscribe((res: any) => {
      console.log(res);
      if (res.error == false) {
        this.paidToBoy.table = res.data.DatedPaidToDeliveryBoy;
        this.paidToBoy.pageData = {
          current_page: res.data.current_page,
          hasNextPage: res.data.hasNextPage,
          hasPrevPage: res.data.hasPrevPage,
          total_items: res.data.total_items,
          // total_pages: res.data.total_pages,
          total_page: 1,
        };
        console.log(this.paidToBoy);
      } else {
      }
    });
  }
  //payable to end

  async createIndex(arr: any) {
    if (arr.length > 0) {
      await arr.forEach((item, index) => {
        item.sl = index + 1;
        item.name = item.fullName + '(' + item.mobile + ')';
      });
      console.log(arr);
    } else {
      console.log('array is empty nothing to indexing');
    }
  }
  public getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  TabChange(change) {
    this.skip = 0;
    const sample = {
      boy: this.activeBoysForSearch[0],
      id: this.activeBoysForSearch[0]._id,
      StartingDate: this.start,
      EndingDate: this.end,
      pageNo: 1,
      searchBy: '',
    };

    if (change.nextId == 'approved') {
      if (this.acitveBoysWithIndex.length == 0) {
        this.fetchActiveDeliveryBoys();
      } else {
        console.log('already clicked');
      }
    } else if (change.nextId == 'pending') {
      if (this.pendingBoysWithIndex.length == 0) {
        this.fetchPendingDeliveryBoys();
      } else {
        console.log('already clicked');
      }
    } else if (change.nextId == 'paidToAdmin') {
      if (this.paidToAdmin.table.length == 0) {
        this.paidToAdminStartDateAndEndDate = { ...sample };
        this.handleShowPaidToAdmin(sample);
      } else {
        console.log('already clicked');
      }
    } else if (change.nextId == 'pendingToAdmin') {
      if (this.pendingToAdminData.length == 0) {
        this.pendingToAdminStartDateAndEndDate = { ...sample };
        this.handlePendingToAdmin(sample);
      } else {
        console.log('already clicked');
      }
    } else if (change.nextId == 'payable') {
      if (this.payableToBoyData.length == 0) {
        this.payableToBoyStartDateAndEndDate = { ...sample };
        console.log('payab to de');
        this.handleShowPayable(sample);
      } else {
        console.log('already clicked');
      }
    } else if (change.nextId == 'paidToBoy') {
      if (this.paidToBoy.table.length == 0) {
        //   console.log('paid to boy');
        this.paidToBoyStartDateAndEndDate = { ...sample };
        this.handleShowPaidToBoy(sample);
      } else {
        console.log('already clicked');
      }
    } else if (change.nextId == 'queryBoy') {
      if (this.queryBoyData.length == 0) {
        this.queryBoyStartDateAndEndDate = { ...sample };
        this.queryBoyStartDateAndEndDate.id = '';
        this.queryBoyStartDateAndEndDate.boy = {};
        this.handleQueryBoy(this.queryBoyStartDateAndEndDate);
      } else {
        //
      }
    } else if (change.nextId == 'deactivated') {
      // this.get_ACTIVE_DEACTIVE_PROMO('deactivated')
    } else if (change.nextId == 'expired') {
      // this.get_EXPIRED_PROMO()
    }
  }

  //searchApis
  searchPaidToAdmin(searchBy) {
    if (searchBy !== '') {
      this.paidToAdminStartDateAndEndDate.pageNo = 1;
      this.paidToAdminStartDateAndEndDate.searchBy = searchBy;

      this.handleShowPaidToAdmin(this.paidToAdminStartDateAndEndDate);
    } else {
      this.paidToAdminStartDateAndEndDate.searchBy = '';
      this.handleShowPaidToAdmin(this.paidToAdminStartDateAndEndDate);
    }
  }
  searchPaidToBoy(searchBy) {
    if (searchBy !== '') {
      this.paidToBoyStartDateAndEndDate.pageNo = 1;
      this.paidToBoyStartDateAndEndDate.searchBy = searchBy;
      this.handleShowPaidToBoy(this.paidToBoyStartDateAndEndDate);
    } else {
      this.paidToBoyStartDateAndEndDate.searchBy = '';
      this.handleShowPaidToBoy(this.paidToBoyStartDateAndEndDate);
    }
  }
  paginatePaidToBoy(page) {
    if (
      (this.paidToBoy.pageData.hasNextPage == false &&
        page > this.paidToBoy.pageData.current_page) ||
      (this.paidToBoy.pageData.hasPrevPage == false &&
        page < this.paidToBoy.pageData.current_page)
    ) {
      console.log('noo');
      return;
    } else {
      this.paidToBoyStartDateAndEndDate.pageNo = page;
      this.handleShowPaidToBoy(this.paidToBoyStartDateAndEndDate);
    }
  }
  paginatePaidToAdmin(page) {
    if (
      (this.paidToAdmin.pageData.hasNextPage == false &&
        page > this.paidToAdmin.pageData.current_page) ||
      (this.paidToAdmin.pageData.hasPrevPage == false &&
        page < this.paidToAdmin.pageData.current_page)
    ) {
      console.log('noo');
      return;
    } else {
      this.paidToAdminStartDateAndEndDate.pageNo = page;
      this.handleShowPaidToBoy(this.paidToAdminStartDateAndEndDate);
    }
  }
  payToDeliveryBoy() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, pay to ',
      cancelButtonText: 'keep it ',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this.payToDeliveryBoyApi();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  payToDeliveryBoyApi() {
    this._boySerivice
      .payToDeliveryBoy({
        status: 'paid',
        deliveryBoyId: this.payableToBoyStartDateAndEndDate.id,
      })
      .subscribe(
        (res: any) => {
          if (res.error == false) {
            this.alertMsg('success', 'Paid successfully');
            // this.payableToBoyData = [];
            // this.totalCommission = 0;
            this.handleShowPayable(this.payableToBoyStartDateAndEndDate);
          } else {
          }
        },
        (err: any) => {}
      );
  }
  //query
  deleteQuery(query) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete ',
      cancelButtonText: 'keep it ',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this.deleteQueryApi(query);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  deleteQueryApi(query) {
    this._boySerivice.deleteQuery(query._id).subscribe((res: any) => {
      if (res.status) {
        this.queryBoyData = this.queryBoyData.filter((q) => q !== query);
        if (this.queryBoyData.length > 0) {
          this.queryBoyData.forEach((item, index) => {
            item.sl = index + 1;
          });
        }

        this.alertMsg('success', 'Deleted successfully');
      } else {
        this.alertMsg('error', res.data);
      }
    });
  }

  public closeResult: any;
  open(content, Value: any, id: any) {
    if (Value === 'queryId') {
      this.replayForm.patchValue({
        queryId: id,
      });
    }
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
