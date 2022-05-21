import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbTabset,
} from '@ng-bootstrap/ng-bootstrap';
import * as Chart from 'chart.js';
import * as chartData from '../../../shared/data/chart';
import { total_views } from '../../../shared/data/chart';
import { Router } from '@angular/router';
import { aggregateBy } from '@progress/kendo-data-query';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { FoliofitServiceService } from 'src/app/services/foliofi-testi,bmi,health.service';
import Swal from 'sweetalert2';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gym',
  templateUrl: './gym.component.html',
  styleUrls: ['./gym.component.scss'],
})
export class GymComponent implements OnInit {
  public min: Date = new Date();
  public value: Date = new Date();

  public editor_value = `
  <p style='color:white;opacity:0.5;font-weight:lighter;font-style:Poppins;'>
    
  </p>

`;

  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;

  // public medicinedata = [
  //   {
  //     slno: "1",
  //     name: "Aswin",
  //     medicine: "Dolo 650",
  //   },
  //   {
  //     slno: "2",
  //     name: "Rahul",
  //     medicine: "Dolo 650",
  //   },
  //   {
  //     slno: "3",
  //     name: "Aswin",
  //     medicine: "Dolo 650",
  //   },

  // ];

  // public bmidata = [
  //   {
  //     slno: "1",
  //     name: "Aswin",
  //     mobile: "9845023409",
  //     bmi: "Under Weight",
  //   },
  //   {
  //     slno: "2",
  //     name: "Rahul",
  //     mobile: "9845023409",
  //     bmi: "Normal Weight",
  //   },
  //   {
  //     slno: "3",
  //     name: "Aswin",
  //     mobile: "9845023409",
  //     bmi: "Over Weight",
  //   },

  // ];

  backFlag: boolean = false;
  caloriebackFlag: boolean = false;

  profit_colorScheme = {
    domain: [
      '#ffffff',
      '#0088ff',
      '#ffffff',
      '#0088ff',
      '#ffffff',
      '#0088ff',
      '#ffffff',
    ],
  };
  calculator_colorScheme = {
    domain: [
      '#ffffff',
      '#02d2bd',
      '#ffffff',
      '#02d2bd',
      '#ffffff',
      '#02d2bd',
      '#ffffff',
    ],
  };
  total_views: any[];
  profit_view: any[] = [194, 100];
  legend: boolean = true;
  legendPosition: string = 'top';

  public closeResult: string;
  public accountForm: FormGroup;
  public permissionForm: FormGroup;

  public media = [];

  public settings = {
    columns: {
      img: {
        title: 'Image',
        type: 'html',
      },
      file_name: {
        title: 'File Name',
      },
      url: {
        title: 'Url',
      },
    },
  };

  public config1: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
  };

  private tabSet: ViewContainerRef;

  @ViewChild(NgbTabset) set content(content: ViewContainerRef) {
    this.tabSet = content;
  }

  ngAfterViewInit() {
    localStorage.clear();
    //console.log(this.tabSet.activeTab);
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _route: Router,
    private permissionService: PermissionService,
    private location: Location,
    private FFS: FoliofitServiceService,
    public fb: FormBuilder
  ) {
    this.media = mediaDB.data;
    Object.assign(this, { total_views });
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

  //CONTAINERS
  public FoliofitTestimonialArray: any = [];
  public YogaTestimonialArray: any = [];
  public WebTestimonialArray: any = [];

  public image_URL: any = '';
  public uploadImage: any;
  public addLoading: boolean = false;
  public ItemId: any;
  public foliofit: boolean = false;
  public yoga: boolean = false;
  public web: boolean = false;

  //health reminder
  //kendo table
  public gridView: GridDataResult;
  public skip = 0;
  public medarray: any = [];
  public med_dt_array: any = [];
  public medicine_search_array: any = [];
  public medForm: FormGroup;
  public MM_ARRAY: any = [];
  public BC_ARRAY: any = [];
  public medicinedata: any = [];
  public totalData: any = [];
  public temp: any;
  public strt_dt = new Date().toISOString().split('T')[0];
  public end_dt = new Date().toISOString().split('T')[0];
  public temp_dt: any;

  //BMI
  public bmidata: any = [];
  public bmiarray: any = [];
  public bmi_dt_array: any = [];
  public bmiForm: FormGroup;
  public temp1: any;
  public strt_dt1 = new Date().toISOString().split('T')[0];
  public end_dt1 = new Date().toISOString().split('T')[0];

  public end_Dt = '';
  public end_Dt1 = '';

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop());
    }

    let tabselected = localStorage.getItem('TabID');
    if (tabselected != '') {
      if (tabselected == 'tab-selectbyid3') {
        this.selectedTab = 'tab-selectbyid3';
      } else if (tabselected == 'tab-selectbyid5') {
        this.selectedTab = 'tab-selectbyid5';
      }
    } else {
      localStorage.clear();
      this.selectedTab = '';
    }

    this.medForm = this.fb.group({
      strt_dt: ['', Validators.required],
      end_dt: ['', Validators.required],
    });
    this.GetMed();

    this.bmiForm = this.fb.group({
      endDate: ['', Validators.required],
      startDate: ['', Validators.required],
    });

    this.GetBMI();

    //console.log(this.selectedTab);
    //Health Reminders Bar chart 2

    // var healthRemindersChart = new Chart("healthRemindersChart", {
    //   type: 'bar',
    //   data: {
    //     labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    //     datasets: [
    //       {
    //         label: 'Views',
    //         data: [100, 60, 40, 60, 55, 40, 65, 80, 25, 33],
    //         fill: true,
    //         backgroundColor: '#ffffff',
    //       },
    //       {
    //         label: 'Udes',
    //         data: [50, 30, 20, 30, 40, 10, 25, 10, 75, 67],
    //         fill: true,
    //         backgroundColor: '#0088ff'
    //       }
    //     ],
    //   },
    //   options: {
    //     legend: {
    //       position: 'right',
    //       labels: {
    //         boxWidth: 10,
    //       }
    //     },
    //     scales: {
    //       yAxes: [{
    //         display: false,
    //         gridLines: {
    //           drawBorder: false,
    //           drawOnChartArea: true
    //         },
    //       }],
    //       xAxes: [{
    //         display: false,
    //         gridLines: {
    //           display: false,
    //           drawOnChartArea: true
    //         },
    //       }],
    //     },
    //   },
    // });

    //Testimonial Funcs
    this.GetFoliofitTestimonial();
    this.GetYogaTestimonial();
    this.GetWebTestimonial();
  }

  //////HEALTH REMINDER FUNCTIONS START
  public allData = (): Observable<any> => {
    return this.totalData;
  };

  GetMed() {
    let body = {
      limit: '0',
      page: '1',
    };

    this.FFS.GetMed(body).subscribe((res: any) => {
      console.log('Res', res.data);
      // this.medicinedata = res.data.reverse();
      let mappedData = res.data.map((medicine) => {
        return {
          _id: medicine._id,
          createdAt: medicine.createdAt,
          medicine: medicine.medicine
            .map((med) => {
              return med.name;
            })
            .toString(),
          sl: medicine.sl,
          type: medicine.type,
          updatedAt: medicine.updatedAt,
          userId: medicine.userId,
        };
      });
      this.medicinedata = mappedData;
      console.log('this.medicinedata', this.medicinedata);

      this.totalData = mappedData;
    });
  }

  getStartdate(event: any) {
    this.temp = event.target.value;

    // this.temp_dt = new Date(event.target.value).toJSON('en-US')
    this.medForm.patchValue({
      end_dt: '',
    });

    // this.temp = event.target.value;
    // let today = new Date(event.target.value).toJSON('en-US');
    // // this.startDate = today;
  }

  date_change(event) {
    let today = new Date(event.target.value).toJSON('en-US');
    this.end_Dt = today;

    this.end_Dt = this.medForm.get('end_dt').value;
    console.log(this.medForm.get('end_dt').value);
    var e = this.medForm.get('end_dt').value;
    var s = this.medForm.get('strt_dt').value;

    var end = e + 'T11:59:59Z';
    var start = new Date(s);
    var a = start.toISOString();
    // var b = end.toISOString();

    console.log(a, 'start');
    console.log(end, 'end');

    let dt = {
      startDate: a,
      endDate: end,
    };

    this.FFS.PostMed_dt(dt).subscribe(
      (res: any) => {
        console.log(res);

        let mappedData = res.data.map((medicine) => {
          return {
            _id: medicine._id,
            createdAt: medicine.createdAt,
            medicine: medicine.medicine
              .map((med) => {
                return med.name;
              })
              .toString(),
            sl: medicine.sl,
            type: medicine.type,
            updatedAt: medicine.updatedAt,
            userId: medicine.userId,
          };
        });

        this.medicinedata = mappedData;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  Med_Search(data: any) {
    // var med = data.target.value

    var val = this.medicine_search_array.filter((med) => {
      if (med == data) {
        console.log(med);
        return med;
      }
    });

    console.log(val, 'in array');

    console.log(this.medicine_search_array, 'search arr');
  }

  filterMedicine(val) {
    let listing: any = [];
    if (val != '') {
      this.totalData.filter((s: any) => {
        s.medicine.forEach((element) => {
          let test =
            element.name.toLowerCase().indexOf(val.toLowerCase()) !== -1;
          console.log(test);
          if (test) {
            listing.push(s);
            console.log(this.medicinedata);
            return;
          }
        });
      });
      this.medicinedata = listing;
    } else {
      this.GetMed();
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.GetMed();
  }

  clear() {
    this.medForm.reset();
    this.temp = '';
    this.GetMed();
  }

  ///////HEALTH REMINDER FUNCTION END

  ////////////BMI FUNCTION START

  GetBMI() {
    this.FFS.GetBMI().subscribe((res: any) => {
      console.log(res);
      this.bmidata = res.data;
    });
  }

  getStartdate1(event: any) {
    this.temp1 = event.target.value;
    this.bmiForm.patchValue({
      endDate: '',
    });
  }

  date_change1() {
    this.end_Dt1 = this.bmiForm.get('endDate').value;
    var e = this.bmiForm.get('endDate').value;
    var s = this.bmiForm.get('startDate').value;
    var end = e + 'T11:59:59Z';
    var start = new Date(s);
    var a = start.toISOString();
    console.log(a, 'start');
    console.log(end, 'end');
    let dt = {
      startDate: a,
      endDate: end,
    };
    console.log(dt);
    this.FFS.PostBMI_dt(dt).subscribe((res: any) => {
      console.log(res);
      this.bmidata = res.data;
    }),
      (err) => {
        console.log(err);
      };
  }

  clear1() {
    this.bmiForm.reset();
    this.temp1 = '';
    this.GetBMI();
  }

  ////////////BMI FUNCTION END

  GetFoliofitTestimonial() {
    this.FFS.GetFoliofitTestimonial().subscribe((res: any) => {
      this.FoliofitTestimonialArray = res.data;
    });
  }
  GetYogaTestimonial() {
    this.FFS.GetYogaTestimonial().subscribe((res: any) => {
      this.YogaTestimonialArray = res.data;
    });
  }
  GetWebTestimonial() {
    this.FFS.GetWebTestimonial().subscribe((res: any) => {
      this.WebTestimonialArray = res.data;
    });
  }

  disableBox(value) {
    let flag = this.permissionService.setBoxCategoryPrivilege(
      value,
      this.user.isAdmin
    );
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
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

  onChangeImage(event: any, width: any, height: any) {
    let setFlag: boolean = false;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);
    Img.onload = (e: any) => {
      if (
        e.path[0].naturalHeight === parseInt(height) &&
        e.path[0].naturalWidth === parseInt(width)
      ) {
        setFlag = true;
        this.uploadImage = file;
        let content = reader.result as string;
        this.image_URL = content;
      } else {
        setFlag = true;
        Swal.fire({
          text: 'Invalid Image Dimension - ' + width + 'x' + height,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
    };
  }

  Save(type) {
    if (type === 'foliofit' || type === 'yoga' || type === 'web') {
      if (this.image_URL == '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      } else {
        const formData = new FormData();
        this.addLoading = true;
        formData.append('image', this.uploadImage);
        if (type === 'foliofit') {
          this.FFS.PostFoliofitTestimonial(formData).subscribe((res: any) => {
            this.pop(res);
          });
        } else if (type === 'yoga') {
          this.FFS.PostYogaTestimonial(formData).subscribe((res: any) => {
            this.pop(res);
          });
        } else if (type === 'web') {
          this.FFS.PostWebTestimonial(formData).subscribe((res: any) => {
            this.pop(res);
          });
        }
      }
    }
  }

  OnUpdate(type) {
    if (type === 'foliofit' || type === 'yoga' || type === 'web') {
      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      } else {
        const formData = new FormData();
        this.addLoading = true;
        if (this.uploadImage == undefined) {
          formData.append('id', this.ItemId);
        } else {
          formData.append('id', this.ItemId);
          formData.append('image', this.uploadImage);
        }
        if (type === 'foliofit') {
          this.FFS.UpdateFoliofitTestimonial(formData).subscribe((res: any) => {
            this.pop(res);
          });
        } else if (type === 'yoga') {
          this.FFS.UpdateYogaTestimonial(formData).subscribe((res: any) => {
            this.pop(res);
          });
        } else if (type === 'web') {
          this.FFS.UpdateWebTestimonial(formData).subscribe((res: any) => {
            this.pop(res);
          });
        }
      }
    }
  }

  Delete(type, id) {
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
        if (type === 'foliofit') {
          this.FFS.DeleteFoliofitTestimonial(id).subscribe((res: any) => {
            this.pop(res);
          });
        } else if (type === 'yoga') {
          this.FFS.DeleteYogaTestimonial(id).subscribe((res: any) => {
            this.pop(res);
          });
        } else if (type === 'web') {
          this.FFS.DeleteWebTestimonial(id).subscribe((res: any) => {
            this.pop(res);
          });
        }
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
      });
    } else {
      Swal.fire({
        text: res.data,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });
    }
    this.addLoading = false;
    this.modalService.dismissAll();
    this.uploadImage = undefined;
    this.GetFoliofitTestimonial();
    this.GetYogaTestimonial();
    this.GetWebTestimonial();
  }

  open(content, Value: any, item: any) {
    console.log(item);
    console.log(content);
    this.addLoading = false;
    this.image_URL = '';
    this.uploadImage = undefined;
    console.log(Value);
    if (Value === 'add') {
      if (item === 'yoga') {
        this.yoga = true;
        this.foliofit = false;
        this.web = false;
      } else if (item === 'foliofit') {
        this.foliofit = true;
        this.yoga = false;
        this.web = false;
      } else if (item === 'web') {
        this.foliofit = false;
        this.yoga = false;
        this.web = true;
      }
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
      this.ItemId = item._id;
      this.image_URL = item.image;
      if (item.testimonialType === 'yoga') {
        this.yoga = true;
        this.foliofit = false;
        this.web = false;
      } else if (item.testimonialType === 'foliofit') {
        this.foliofit = true;
        this.yoga = false;
        this.web = false;
      } else if (item.testimonialType === 'web') {
        this.foliofit = false;
        this.yoga = false;
        this.web = true;
      }
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

  redirectToDietPlan() {
    this.selectedTab = 'tab-selectbyid3';
    this._route.navigate(['/fitness-wellness/diet-plan']);
    localStorage.setItem('TabID', 'tab-selectbyid3');
  }

  redirectToCalorieChart() {
    this._route.navigate(['/fitness-wellness/calorie-chart']);
    localStorage.setItem('TabID', 'tab-selectbyid5');
  }

  tabChangeEvent(event) {
    console.log(event.nextId);
    //localStorage.setItem("TabID",event.nextId);
  }
}
