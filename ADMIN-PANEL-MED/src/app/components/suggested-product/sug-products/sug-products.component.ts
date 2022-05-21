import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedServiceService } from 'src/app/shared-service.service';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { SuggestedProductService } from 'src/app/services/suggested-product.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageChangeEvent } from "@progress/kendo-angular-grid";


import * as XLSX from 'xlsx'; 

// import { ExcelExportData } from "@progress/kendo-angular-excel-export";
// import { process } from "@progress/kendo-data-query";

@Component({
  selector: 'app-sug-products',
  templateUrl: './sug-products.component.html',
  styleUrls: ['./sug-products.component.scss']
})
export class SugProductsComponent implements OnInit {



  public suggestedProduct_data = [
    {
      slno: "1",
      name: "Aswin Vinod",
      id: "38949",
      productname: "Mask",
      contact: "9856321923"
    },
    {
      slno: "2",
      name: "Aswin Vinod",
      id: "38949",
      productname: "Mask",
      contact: "9856321923"
    },
    {
      slno: "3",
      name: "Aswin Vinod",
      id: "38949",
      productname: "Mask",
      contact: "9856321923"
    },
    {
      slno: "4",
      name: "Aswin Vinod",
      id: "38949",
      productname: "Mask",
      contact: "9856321923"
    },
  ];

  public closeResult: string;

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  public sugForm: FormGroup

  public suggestedProduct_Array = []
  public Excel_Array = []

  public temp: any;
  public strt_dt = new Date().toISOString().split('T')[0];
  public end_dt = new Date().toISOString().split('T')[0];
  public temp_dt: any
  public end_Dt = ''

  public skip = 0;

  minDate: any;


  constructor(private _router: Router,
    private modalService: NgbModal,
    private shared_Service: SharedServiceService,
    private permissionService: PermissionService,
    private location: Location,
    private Sug_Service: SuggestedProductService,
    public fb: FormBuilder
  ) {
    // this.allData = this.allData.bind(this.suggestedProduct_Array);
  }


  // public allData(): ExcelExportData {
  //   const result: ExcelExportData = {
  //     data: process(this.suggestedProduct_Array, {
  //       sort: [{ field: "slno", dir: "asc" }],
  //     }).data,
  //     // group: this.group,
  //   };

  //   return result;
  // }





  ngOnInit(): void {
    this.minDate = this.shared_Service.disablePastDate();

    console.log(this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));


    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }

    this.sugForm = this.fb.group({
      "strt_dt": ['', Validators.required],
      "end_dt": ['', Validators.required]
    })
    this.Get_All_Pdts(2500, 1)
  }


  Get_All_Pdts(limit, pg) {
    let body = {
      limit: limit,
      page: pg
    }
    this.suggestedProduct_Array = []
    this.Sug_Service.get_suggested_products(body).subscribe((res: any) => {
      console.log(res);
      let mappedData = res.data.finalResult.map(itm => {
        return {
          _id: itm._id,
          slno: itm.sl + 1,
          name: itm.name,
          contact: itm.phone,
          User_id: itm.customerId,
          productname: itm.title,
        }
      });
      this.suggestedProduct_Array = mappedData
      console.log(this.suggestedProduct_Array, "mapped array");

      this.Excel_Array = []
      let ExcelData = res.data.finalResult.map(itm => {
        return {
          slno: itm.sl + 1,
          name: itm.name,
          contact: itm.phone,
          User_id: itm.customerId,
          productname: itm.title,
        }
      });
      this.Excel_Array=ExcelData
    })
  }

  Add_Suggested_Pdt(pdt) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      imageHeight: 50,
    }).then((result) => {

      if (result.value) {
        console.log(pdt, "pdt");
        let body = {
          "id": pdt._id,
          "status": true
        }

        this.Sug_Service.add_suggested_products(body).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        }, err => {
          console.log(err);
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.Get_All_Pdts(2500, 1)
      }
    })
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    // console.log(event);

    //  this.get_ALL_BRANDS()
    // this.Brands({ activeId: 'all', nextId: 'promoted' })
    // this.Brands({ activeId: 'all', nextId: 'shop' })
    // this.Brands({ activeId: 'all', nextId: 'trending' })
    // this.Brands({ activeId: 'all', nextId: 'featured' })
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;

  open(content, Value: any) {
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


  BackRedirectTo() {
    this._router.navigate(['/master-settings/category'])
  }


  pop(res: any) {

    console.log(res.data, "res data");
    console.log(res.error, "res status");
    // this.attemptedSubmit = false
    if (res.error == false) {
      Swal.fire({
        text: res.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
      // this.modalService.dismissAll();
      this.skip = 0;
      this.Get_All_Pdts(2500, 1)

    } else {
      Swal.fire({
        text: res.data,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
      // this.updateFlag = false
    }
    // this.addLoading = false;
    // this.attemptedSubmit = false;
  }


  getStartdate(event: any) {
    this.temp = event.target.value;

    this.temp_dt = new Date(event.target.value).toJSON('en-US')
    this.sugForm.patchValue({
      end_dt: ''
    })

    this.temp = event.target.value;
    let today = new Date(event.target.value).toJSON('en-US');
    // this.startDate = today;
  }



  date_change(event) {



    let today = new Date(event.target.value).toJSON('en-US');
    this.end_Dt = today;




    this.end_Dt = this.sugForm.get('end_dt').value
    console.log(this.sugForm.get('end_dt').value);
    var e = this.sugForm.get('end_dt').value
    var s = this.sugForm.get('strt_dt').value

    var end = e + 'T11:59:59Z'
    var start = new Date(s);
    var a = start.toISOString();


    // var b = end.toISOString();  /////////no needed

    // console.log(a, "start");
    // console.log(end, "end");


    let data = {
      "endDate": end,
      "startDate": a,
      "limit": 2500,
      "page": 1
    }

    this.Sug_Service.get_date_suggested_products(data).subscribe((res: any) => {
      console.log(res);
      this.suggestedProduct_Array = []
      let mappedData = res.data.finalResult.map(itm => {
        return {

          _id: itm._id,
          slno: itm.sl + 1,
          name: itm.name,
          contact: itm.phone,
          User_id: itm.customerId,
          productname: itm.title,
        }
      });
      this.suggestedProduct_Array = mappedData


      this.Excel_Array = []
      let ExcelData = res.data.finalResult.map(itm => {
        return {
          slno: itm.sl + 1,
          name: itm.name,
          contact: itm.phone,
          User_id: itm.customerId,
          productname: itm.title,
        }
      });
      this.Excel_Array=ExcelData



    })





    // this.FFS.PostMed_dt(dt).subscribe((res: any) => {
    //   console.log(res);

    //   let mappedData = res.data.map(medicine => {
    //     return {
    //       _id: medicine._id,
    //       createdAt: medicine.createdAt,
    //       medicine: medicine.medicine.map(med => { return med.name }).toString(),
    //       sl: medicine.sl,
    //       type: medicine.type,
    //       updatedAt: medicine.updatedAt,
    //       userId: medicine.userId,
    //     }
    //   });

    //   this.medicinedata = mappedData

    // }, err => {
    //   console.log(err);

    // })

  }



  clear() {
    this.sugForm.reset()
    this.temp = ''
    this.Get_All_Pdts(2500, 1)
  }




  exportexcel() {
    console.log("inside excel");
    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Excel_Array);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Suggested Products.xls');
  }


}
