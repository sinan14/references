import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/permission.service';
import { FoliofitServiceService } from 'src/app/services/foliofi-testi,bmi,health.service';
import { Location } from '@angular/common';
import { DataBindingDirective, GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
// import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-health-reminders-tab',
  templateUrl: './health-reminders-tab.component.html',
  styleUrls: ['./health-reminders-tab.component.scss']
})
export class HealthRemindersTabComponent implements OnInit {



  //kendo table
  public gridView: GridDataResult;
  public skip = 0;


  public min: Date = new Date();
  public value: Date = new Date();


  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  selectedTab = '';


  public medarray: any = []
  public med_dt_array: any = []
  public medicine_search_array: any = []

  public medForm: FormGroup;

  public MM_ARRAY: any = []
  public BC_ARRAY: any = []



  public medicinedata: any = [];
  public totalData: any = [];
  public temp: any;
  public strt_dt = new Date().toISOString().split('T')[0];
  public end_dt = new Date().toISOString().split('T')[0];
  

  constructor(
    private _route: Router,
    private permissionService: PermissionService,
    private location: Location,
    private FFS: FoliofitServiceService,
    public fb: FormBuilder
  ) {
   }

  ngOnInit(): void {
    this.allData = this.allData.bind(this);
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    let tabselected = localStorage.getItem("TabID");
    if (tabselected != '') {
      if (tabselected == 'tab-selectbyid3') {
        this.selectedTab = 'tab-selectbyid3';
      }
      else if (tabselected == 'tab-selectbyid5') {
        this.selectedTab = 'tab-selectbyid5';
      }
    }
    else {
      localStorage.clear();
      this.selectedTab = '';
    }

    this.medForm = this.fb.group({
      "strt_dt": ['', Validators.required],
      "end_dt": ['', Validators.required]
    })

    this.GetMed()

  }

  public allData = (): Observable<any> => {
    return this.totalData;
  };


  GetMed() {

    let body = {
      "limit": "0",
      "page": "1"
    }

    this.FFS.GetMed(body).subscribe((res: any) => {
      console.log("Res",res.data);
      // this.medicinedata = res.data.reverse();
      let mappedData = res.data.map( medicine => {
        return {
          _id : medicine._id,
          createdAt : medicine.createdAt,
          medicine : medicine.medicine.map( med => { return med.name}).toString() ,
          sl : medicine.sl,
          type: medicine.type,
          updatedAt: medicine.updatedAt,
          userId: medicine.userId,
        }
      });

      this.medicinedata = mappedData
      console.log("this.medicinedata",this.medicinedata);
      
      this.totalData = mappedData;

      // this.MM_ARRAY = []

      // this.medarray.forEach((itm, i) => {
      //   // var med = ""
      //   //      itm.medicine.map((res)=>{
      //   //        console.log(res);
      //   //        med = res.medicine
      //   //      })

      //   let data = {
      //     "slno": i + 1,
      //     "name": itm.userId.name,
      //     "medicine": itm.medicine
      //   }
      //   let med = {
      //     "medicine": itm.medicine,
      //   }
      //   this.MM_ARRAY.push(med)
      //   this.BC_ARRAY = this.MM_ARRAY
      //   // this.BC_ARRAY = this.BC_ARRAY + itm.medicine

      //   console.log(data);
      //   this.medicinedata.push(data)
      //   this.medicine_search_array = this.medicine_search_array.concat(itm.medicine)
      // })
      // console.log(this.medicinedata);
      // console.log(this.medicine_search_array);
      // console.log(this.BC_ARRAY);


    })
  }


  getStartdate(event: any) {
    this.temp = event.target.value;
    this.medForm.patchValue({
      end_dt: ''
    })
    // let today = new Date(event.target.value).toJSON('en-US');
    // this.startDate = today;
  }


  date_change() {

    console.log(this.medForm.get('end_dt').value);
    var e = this.medForm.get('end_dt').value
    var s = this.medForm.get('strt_dt').value

    var end = e + 'T11:59:59Z'
    var start = new Date(s);
    var a = start.toISOString();
    // var b = end.toISOString();

    console.log(a, "start");
    console.log(end, "end");


    let dt = {
      // Date().toISOString()
      "startDate": a,
      "endDate": end,
    }

    this.FFS.PostMed_dt(dt).subscribe((res: any) => {
      console.log(res);

      let mappedData = res.data.map( medicine => {
        return {
          _id : medicine._id,
          createdAt : medicine.createdAt,
          medicine : medicine.medicine.map( med => { return med.name}).toString() ,
          sl : medicine.sl,
          type: medicine.type,
          updatedAt: medicine.updatedAt,
          userId: medicine.userId,
        }
      });

      this.medicinedata = mappedData


      // this.medicinedata = res.data

      // this.medarray = []


      // this.med_dt_array.forEach((itm, i) => {
      //   let data = {
      //     "slno": i + 1,
      //     "name": itm.userId.name,
      //     "medicine": itm.medicine,
      //   }


      //   this.medarray.push(data)
      //   this.medicinedata = this.medarray

      // })
      // console.log(this.medicinedata);


    }, err => {
      console.log(err);

    })

  }

  Med_Search(data: any) {
    // var med = data.target.value

    var val = this.medicine_search_array.filter((med) => {
      if (med == data) {
        console.log(med)
        return med
      }
    })

    console.log(val, "in array");

    console.log(this.medicine_search_array, "search arr");

  }

  filterMedicine(val) {
    let listing: any = [];
    if (val != '') {
      this.totalData.filter((s: any) => {
        s.medicine.forEach(element => {
          let test = element.name.toLowerCase().indexOf(val.toLowerCase()) !== -1;
          console.log(test);
          if (test) {
            listing.push(s);
            console.log(this.medicinedata);
            return;
          }
        });
      }
      );
      this.medicinedata = listing;

    }
    else {
      this.GetMed();
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.GetMed();
  }

  clear() {
    this.medForm.reset()
    this.temp = ''
    this.GetMed()
  }


  //export to excel

  // ExportTOExcel() {
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.medicinedata);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, 'Medicine.xls');
  // }

}
