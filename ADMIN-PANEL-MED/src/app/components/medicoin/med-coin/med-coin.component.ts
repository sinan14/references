import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedcoinService } from 'src/app/services/medcoin.service';
import Swal from 'sweetalert2';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-med-coin',
  templateUrl: './med-coin.component.html',
  styleUrls: ['./med-coin.component.scss'],
})
export class MedCoinComponent implements OnInit {
  public customerIds: any = [];
  @ViewChild('multiselect') public multiselect: MultiSelectComponent;
  @ViewChild('multiselect') public multiselect2: MultiSelectComponent;

  public redeemId: string;
  public narration: any = '';
  public statementPageDetails: any = [];
  public customerPageDetails: any = [];
  public payCustomerList: any = [];
  payLoading: boolean = false;
  public segmentForm: FormGroup;
  // public segments: string[] = [
  //   'all_customers',
  //   'single_order_customers',
  //   'no_orders_customers',
  //   'order_ongoing_customers',
  //   'premium_customers',
  //   'subscribed_customers',
  // ];

  public pagePay: number = 0;
  rechargeForm: FormGroup;
  payForm: FormGroup;
  withDrawForm: FormGroup;
  redeemForm: FormGroup;
  statementForm: FormGroup;
  public customerStatementForm: FormGroup;
  public hasErrorRecharge: boolean;
  public hasErrorWithDraw: boolean;

  public statMin: any;
  public custMin: any;

  public hasErrorPay: boolean;
  public hasErrorRedeem: boolean;
  public medCoinDetails: any;

  public customerList: Array<{ name: string; _id: string }> = [];
  public medCoinStatement: any = [];
  public customerMedCoinStatement: any = [];

  public closeResult: string;

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
    private _fb: FormBuilder,
    private _medService: MedcoinService,
    private permissionService: PermissionService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop());
    }

    this.modalService.dismissAll();
    this.hasErrorPay = false;
    this.hasErrorRecharge = false;
    this.hasErrorRedeem = false;
    this.hasErrorWithDraw = false;
    const from = new Date(2010, 11, 24).toISOString();
    const to = new Date(2099, 1, 31).toISOString();
    const page = 1;

    this.statementForm = this._fb.group({
      statementType: ['med_coin_statements'],
      searchBy: [null],
      from,
      to,
      page,
    });
    document.getElementById('');

    this.customerStatementForm = this._fb.group({
      statementType: ['customer_wise_statement'],
      searchBy: [null],
      from,
      to,
      page,
    });

    this.rechargeForm = this._fb.group({
      medCoinCount: ['', [Validators.required]],
      narration: ['', [Validators.required]],
    });
    this.withDrawForm = this._fb.group({
      medCoinCount: ['', [Validators.required, Validators.min(1)]],
      narration: ['', [Validators.required]],
    });
    this.payForm = this._fb.group({
      customers: ['', [Validators.required]],
      medCoinCount: ['', [Validators.required, Validators.min(1)]],
      narration: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
    });
    this.redeemForm = this._fb.group({
      // customers: ['', Validators.required],
      customerId: ['', [Validators.required]],
      medCoinCount: ['', [Validators.required, Validators.min(1)]],
      narration: ['', [Validators.required]],
    });
    // this.segmentForm = this._fb.group({
    //   segment: ['all_customers'],
    //   page: [0],
    //   name: [''],
    //   selectAll: [false],
    // });

    this.getMedCoinDetails();
    this.getStatement();
    this.getCustomerStatement();
    // this.getCustomerList({
    //   page: 0,
    //   selectAll: false,
    // });
  }
  // public statementData: any;
  // public custStatementData: any;

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

  public getStatement() {
    let body;
    if (
      this.statementForm.get('searchBy').value === null ||
      this.statementForm.get('searchBy').value === ''
    ) {
      body = {
        statementType: 'med_coin_statements',
        from: this.statementForm.get('from').value,
        to: this.statementForm.get('to').value,
        page: this.statementForm.get('page').value,
      };
    } else {
      body = this.statementForm.value;
    }
    console.log(body);
    this._medService.getMedCoinStatement(body).subscribe(
      (res: any) => {
        this.statementPageDetails = res.data.pageDetails;

        this.medCoinStatement = JSON.parse(JSON.stringify(res.data.statements));
        this.medCoinStatement.forEach((item, i) => {
          this.medCoinStatement[i].index = i + 1;
        });

        console.log('statement page details');
        console.log(this.statementPageDetails);
        console.log(this.medCoinStatement);
      },
      (err: any) => {
        this.handleServerErr(err);
      }
    );
  }
  public getCustomerStatement() {
    let body;
    console.log(this.customerStatementForm.value);

    if (
      this.customerStatementForm.get('searchBy').value === null ||
      this.customerStatementForm.get('searchBy').value === ''
    ) {
      body = {
        statementType: 'customer_wise_statement',
        from: this.customerStatementForm.get('from').value,
        to: this.customerStatementForm.get('to').value,
        page: this.customerStatementForm.get('page').value,
      };
    } else {
      body = this.customerStatementForm.value;
    }

    this._medService.getMedCoinStatement(body).subscribe(
      (res: any) => {
        console.log(res);
        this.customerPageDetails = JSON.parse(
          JSON.stringify(res.data.pageDetails)
        );
        console.log('customer statement details');
        console.log(this.customerPageDetails);
        this.customerMedCoinStatement = JSON.parse(
          JSON.stringify(res.data.statements)
        );

        this.customerMedCoinStatement.forEach((item, i) => {
          this.customerMedCoinStatement[i].index = i + 1;
        });
        console.log(this.customerMedCoinStatement);
      },
      (err: any) => {
        this.handleServerErr(err);
      }
    );
  }

  public statmentFilterStartDate(value: any) {
    this.statMin = value;
    this.statementForm.patchValue({
      from: new Date(value).toISOString(),
      to: '',
    });
    //@ts-ignore
    document.getElementById('stm2').value = '';
  }

  public statmentFilterEndDate(value) {
    this.statementForm.patchValue({
      to: new Date(value).toISOString(),
      page: 1,
    });
    console.log(this.statementForm.value);
    console.log('statment date filter to date');
    this.getStatement();
  }

  public statClear() {
    this.statMin = '';
  }

  public custStart(value: any) {
    this.custMin = value;
    this.customerStatementForm.patchValue({
      from: new Date(value).toISOString(),
      to: '',
    });
    //@ts-ignore
    document.getElementById('cstm2').value = '';
  }

  public custEnd(value: any) {
    this.customerStatementForm.patchValue({
      to: new Date(value).toISOString(),
      page: 1,
    });
    this.getCustomerStatement();
  }

  public custClear() {
    this.custMin = '';
  }

  public rechargeData = [];

  public onPageChange(page) {
    // console.log(`${page} \n${this.statementPageDetails.hasNextPage}\n ${this.statementPageDetails.currentPage}\n${this.statementPageDetails.hasPrevPage}`)
    if (
      (this.statementPageDetails.hasNextPage == false &&
        page > this.statementPageDetails.currentPage) ||
      (this.statementPageDetails.hasPrevPage == false &&
        page < this.statementPageDetails.currentPage)
    ) {
      return;
    } else {
      this.statementForm.patchValue({
        page: page,
      });
      this.getStatement();
    }
  }

  public onPageChange2(page) {
    if (
      (this.customerPageDetails.hasNextPage == false &&
        page > this.customerPageDetails.currentPage) ||
      (this.customerPageDetails.hasPrevPage == false &&
        page < this.customerPageDetails.currentPage)
    ) {
      return;
    } else {
      this.customerStatementForm.patchValue({
        page: page,
      });
      this.getCustomerStatement();
    }
  }

  public vendors = [];

  open(content, Value: any, text) {
    if (Value == 'narr') {
      if (text == undefined || text == null || text == '') {
        return;
      } else {
        this.narration = text;
      }
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
    if (Value === 'pay' || Value === 'redeem') {
      this.getCustomerList({
        segment: 'all_customers',
        page: 0,
        selectAll: false,
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

  getColor(expiryValue: any) {
    let color = 'orange';
    if (expiryValue === 'Expired') {
      color = '#ff8084';
    } else if (expiryValue === 'Used') {
      color = '#81ba00';
    }
    return color;
  }

  public getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  public onSubmitRecharge() {
    if (this.rechargeForm.invalid) {
      this.hasErrorRecharge = true;
    } else {
      this._medService.rechargeMedcoinAdmin(this.rechargeForm.value).subscribe(
        (res: any) => {
          console.log(res);
          if (res.error == false) {
            Swal.fire({
              icon: 'success',
              title: '<h4>Recharged successfully</h4>',
            }).then(() => {
              this.closeAll();
              this.getMedCoinDetails();
              this.getStatement();
              this.getCustomerStatement();
            });
          } else {
            // this.closeAll();
            this.handleOperationalErr(res);
          }
        },
        (err: any) => {
          this.handleServerErr(err);
        }
      );
    }
  }

  public onSubmitWithDraw() {
    if (this.withDrawForm.invalid) {
      this.hasErrorWithDraw = true;
    } else {
      this._medService.withDrawMedcoinAdmin(this.withDrawForm.value).subscribe(
        (res: any) => {
          console.log(res);
          if (res.error == false) {
            Swal.fire({
              icon: 'success',
              title: 'Withdrawn successfully',
            }).then(() => {
              this.closeAll();
              this.getMedCoinDetails();
              this.getStatement();
              this.getCustomerStatement();
            });
          } else {
            // this.closeAll();
            this.handleOperationalErr(res);
          }
        },
        (err: any) => {
          this.handleServerErr(err);
        }
      );
    }
  }
  public onSubmitPay() {
    const body = {
      customers: this.customerIds,
      medCoinCount: this.payForm.get('medCoinCount').value,
      expiryDate: this.payForm.get('expiryDate').value,
      narration: this.payForm.get('narration').value,
    };
    console.log(this.payForm.value);
    if (this.payForm.invalid) {
      this.hasErrorPay = true;
    } else {
      this.payLoading = true;
      this._medService.payMedcoin(body).subscribe(
        (res: any) => {
          console.log(res);
          this.payLoading = false;
          if (res.error == false) {
            Swal.fire({
              icon: 'success',
              title: '<h4>Paid successfully</h4>',
            }).then(() => {
              this.closeAll();
              this.getMedCoinDetails();
              this.getStatement();
              this.getCustomerStatement();
            });
          } else {
            console.log('some error');
            // this.closeAll();
            this.handleOperationalErr(res);
          }
        },
        (err: any) => {
          this.payLoading = false;
          this.handleServerErr(err);
        }
      );
    }
  }

  public onSubmitRedeem() {
    console.log(this.redeemForm.value);
    if (this.redeemForm.invalid) {
      this.hasErrorRedeem = true;
    } else {
      const body = {
        customerId: this.redeemForm.get('customerId').value,
        medCoinCount: this.redeemForm.get('medCoinCount').value,
        narration: this.redeemForm.get('narration').value,
      };
      this._medService.redeemMedcoin(body).subscribe(
        (res: any) => {
          console.log(res);
          if (res.error == false) {
            Swal.fire({
              icon: 'success',
              title: '<h4>Redeemed successfully</h4>',
            }).then(() => {
              this.closeAll();
              this.getMedCoinDetails();
              this.getStatement();
              this.getCustomerStatement();
            });
          } else {
            console.log('some error');
            // this.closeAll();
            this.handleOperationalErr(res);
          }
        },
        (err: any) => {
          this.handleServerErr(err);
        }
      );
    }
  }
  public getMedCoinDetails() {
    this._medService.getMedCoinDetails().subscribe(
      (res: any) => {
        console.log(res);
        if (res.error == false) {
          this.medCoinDetails = JSON.parse(JSON.stringify(res.data));
        } else {
          console.log('some error');
        }
      },
      (err: any) => {
        this.handleServerErr(err);
      }
    );
  }
  public isValidRecharge(controlName) {
    return (
      (this.rechargeForm.get(controlName).invalid &&
        this.rechargeForm.get(controlName).touched) ||
      (this.hasErrorRecharge && this.rechargeForm.get(controlName).invalid)
    );
  }
  public isValidWith(controlName) {
    return (
      (this.withDrawForm.get(controlName).invalid &&
        this.withDrawForm.get(controlName).touched) ||
      (this.hasErrorWithDraw && this.withDrawForm.get(controlName).invalid)
    );
  }
  public isValidRedeem(controlName) {
    return (
      (this.redeemForm.get(controlName).invalid &&
        this.redeemForm.get(controlName).touched) ||
      (this.hasErrorRedeem && this.redeemForm.get(controlName).invalid)
    );
  }

  public isValidPay(controlName) {
    return (
      (this.payForm.get(controlName).invalid &&
        this.payForm.get(controlName).touched) ||
      (this.hasErrorPay && this.payForm.get(controlName).invalid)
    );
  }

  public payCustomerChange(value: any) {
    let data: any = [];
    let paginate: any = [];
    this.customerIds = [];
    console.log(this.payForm.value);

    this.payForm.get('customers').value.forEach((el) => {
      this.customerIds.push(el['_id']);
    });
    // console.log(this.customerIds);
  }

  // redeemChange(selected: any) {
  // if (selected.length > 0) {
  // console.log(selected);
  //   this.redeemForm
  //     .get('customers')
  //     .setValue([selected[selected.length - 1]]);
  //   this.redeemForm
  //     .get('customerId')
  //     .setValue(this.redeemForm.get('customers').value[0]._id);
  // }
  // console.log(this.redeemForm.get('customers').value);
  // }
  redeemChange(selected: any) {
    this.redeemForm.get('customerId').setValue(selected);
  }

  public payCustomerFilter(value) {
    console.log(value, value.length);
    if (value.length >= 1) {
      this.getCustomerList({
        //@ts-ignore
        segment: document.getElementById('ps').selectedOptions[0].value,
        page: 0,
        name: value.toLowerCase(),
        selectAll: false,
      });
    } else {
      this.getCustomerList({
        //@ts-ignore
        segment: document.getElementById('ps').selectedOptions[0].value,
        page: 0,

        selectAll: false,
      });
    }
  }
  payClose() {
    this.segmentForm.patchValue({
      name: null,
    });
  }
  public redeemFilter(value) {
    if (value.length >= 1) {
      this.getCustomerList({
        //@ts-ignore
        segment: document.getElementById('rs').selectedOptions[0].value,
        name: value.toLowerCase(),
        selectAll: false,
        page: 0,
      });
    } else {
      this.getCustomerList({
        //@ts-ignore
        segment: document.getElementById('rs').selectedOptions[0].value,
        selectAll: false,
        page: 0,
      });
    }
  }

  selectAllCustomers() {
    this.getCustomerList({
      //@ts-ignore
      segment: document.getElementById('ps').selectedOptions[0].value,
      selectAll: true,
      page: 0,
    });
    this.payForm.get('customers').setValue(this.customerList);
    this.payForm.get('customers').value.forEach((el) => {
      this.customerIds.push(el['_id']);
    });
  }

  public onChangeSegment(segmentValue) {
    console.log(segmentValue);
    this.getCustomerList({
      segment: segmentValue,
      page: 0,
      selectAll: false,
    });
  }

  public getCustomerList(val) {
    this._medService.fetchSegmentWiseCustomers(val).subscribe(
      (res: any) => {
        if (res.error === false) {
          console.log(res);
          this.customerList = [];
          this.customerList = JSON.parse(
            JSON.stringify(res.data.customers)
          ).map((item) => {
            return {
              _id: item._id,
              name: item.name + '(' + item.phone + ')',
            };
          });
          console.log(this.customerList);
        } else {
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  closeAll() {
    this.modalService.dismissAll();
    this.rechargeForm.reset();
    this.withDrawForm.reset();
    this.payForm.reset();
    this.customerIds = [];
    this.redeemForm.reset();
    this.payForm.patchValue({
      segment: 'all_customers',
    });
  }
  searchStatment(value) {
    console.log(value);
    this.statementForm.patchValue({
      searchBy: value,
      page: 1,
    });
    this.getStatement();
  }
  searchCustStatment(value) {
    console.log(value);
    this.customerStatementForm.patchValue({
      searchBy: value,
      page: 1,
    });
    this.getCustomerStatement();
  }

  // focusPay(val) {
  //   let payPage = 0;
  //   console.log(val);
  //   console.log('ffffffffff');
  //   // setInterval(this.getPayCustomerList, 1000);

  //   // function myTimer() {
  //   //   payPage = payPage + 1;
  //   //   this.patchPayPage(payPage);

  //   //   this.getPayCustomerList();

  //   // const d = new Date();
  //   // document.getElementById('demo').innerHTML = d.toLocaleTimeString();
  //   // }
  // }

  // blurPay(val) {
  //   console.log(val);
  //   console.log('bbbbbbbbbbbb');
  // }

  // onOpen(val) {
  //   console.log(val);
  //   console.log('ooooooooooo');
  // }
  // onClose(val) {
  //   console.log(val);
  //   console.log('ccccccccccccccc');
  // }
  viewNarration(narration) {}
  handleOperationalErr(e) {
    console.log(e);
    Swal.fire({
      icon: 'error',
      title: `${e.message}`,
    });
  }
  handleServerErr(error) {
    (error: any) => {
      console.log(error.error);
    };
  }
  goToCustomer(id) {
    console.log(id);
    this._route.navigate([`/customer-details/cust/${id}`]);
  }
}
