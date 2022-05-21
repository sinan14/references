import { Component, OnInit } from '@angular/core';
import { PermissionService } from 'src/app/permission.service';
import { FoliofitServiceService } from 'src/app/services/foliofi-testi,bmi,health.service';
import { Location } from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-testimonial-tab',
  templateUrl: './testimonial-tab.component.html',
  styleUrls: ['./testimonial-tab.component.scss']
})
export class TestimonialTabComponent implements OnInit {

    //NEW VARIABLES

    public permissions: any = [];
    public user: any = [];
    public currentPrivilages: any = [];
    public aciveTagFlag: boolean = true;
    public editFlag: boolean;
    public deleteFlag: boolean;
    public viewFlag: boolean;

   //CONTAINERS
   public FoliofitTestimonialArray: any = []
   public YogaTestimonialArray: any = []
   public WebTestimonialArray: any = []


   public image_URL: any = ''
   public uploadImage: any
   public addLoading: boolean = false
   public ItemId: any;
   public foliofit: boolean = false
   public yoga: boolean = false
   public web: boolean = false

   public closeResult: string;

   add_Modal_Flag: boolean = false;
   update_Modal_Flag: boolean = false;
 

   selectedTab = '';

  constructor( 
    private modalService: NgbModal,
    private _route: Router,
    private permissionService: PermissionService,
    private location: Location,
    private FFS: FoliofitServiceService
    ) { }

  ngOnInit(): void {

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


    //Testimonial Funcs
    this.GetFoliofitTestimonial()
    this.GetYogaTestimonial()
    this.GetWebTestimonial()


  }


  GetFoliofitTestimonial() {
    this.FFS.GetFoliofitTestimonial().subscribe((res: any) => {
      this.FoliofitTestimonialArray = res.data
    })
  }
  GetYogaTestimonial() {
    this.FFS.GetYogaTestimonial().subscribe((res: any) => {
      this.YogaTestimonialArray = res.data
    })
  }
  GetWebTestimonial() {
    this.FFS.GetWebTestimonial().subscribe((res: any) => {
      this.WebTestimonialArray = res.data
    })
  }



  onChangeImage(event: any, width: any, height: any) {
    let setFlag: boolean = false;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);
    Img.onload = (e: any) => {
      if (e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width)) {
        setFlag = true;
        this.uploadImage = file;
        let content = reader.result as string;
        this.image_URL = content;
      }
      else {
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
    }
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
        const formData = new FormData()
        this.addLoading = true
        formData.append('image', this.uploadImage);
        if (type === 'foliofit') {
          this.FFS.PostFoliofitTestimonial(formData).subscribe((res: any) => {
            this.pop(res)
          })
        } else if (type === 'yoga') {
          this.FFS.PostYogaTestimonial(formData).subscribe((res: any) => {
            this.pop(res)
          })
        } else if (type === 'web') {
          this.FFS.PostWebTestimonial(formData).subscribe((res: any) => {
            this.pop(res)
          })
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
            this.pop(res)
          })
        } else if (type === 'yoga') {
          this.FFS.DeleteYogaTestimonial(id).subscribe((res: any) => {
            this.pop(res)
          })
        } else if (type === 'web') {
          this.FFS.DeleteWebTestimonial(id).subscribe((res: any) => {
            this.pop(res)
          })
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  // OnUpdate(type) {
  //   if (type === 'foliofit' || type === 'yoga' || type === 'web') {
  //     if (this.image_URL === '') {
  //       Swal.fire({
  //         text: 'Please Add Image!!!',
  //         icon: 'warning',
  //         showCancelButton: false,
  //         confirmButtonText: 'Ok',
  //         confirmButtonColor: '#3085d6',
  //         imageHeight: 500,
  //       });

  //     } else {
  //       const formData = new FormData()
  //       this.addLoading = true;
  //       if (this.uploadImage == undefined) {
  //         formData.append('id', this.ItemId);
  //       } else {
  //         formData.append('id', this.ItemId);
  //         formData.append('image', this.uploadImage);
  //       }
  //       if (type === 'foliofit') {
  //         this.FFS.UpdateFoliofitTestimonial(formData).subscribe((res: any) => {
  //           this.pop(res)
  //         })
  //       } else if (type === 'yoga') {
  //         this.FFS.UpdateYogaTestimonial(formData).subscribe((res: any) => {
  //           this.pop(res)
  //         })
  //       } else if (type === 'web') {
  //         this.FFS.UpdateWebTestimonial(formData).subscribe((res: any) => {
  //           this.pop(res)
  //         })
  //       }

  //     }
  //   }
  // }


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
    this.addLoading = false;
    this.modalService.dismissAll();
    this.uploadImage = undefined;
    this.GetFoliofitTestimonial()
    this.GetYogaTestimonial()
    this.GetWebTestimonial()
  }

  open(content, Value: any, item: any) {
    console.log(item);
    console.log(content);
    this.addLoading = false;
    this.image_URL = ''
    this.uploadImage = undefined
    console.log(Value)
    if (Value === 'add') {
      if (item === 'yoga') {
        this.yoga = true
        this.foliofit = false
        this.web = false
      } else if (item === 'foliofit') {
        this.foliofit = true
        this.yoga = false
        this.web = false
      } else if (item === 'web') {
        this.foliofit = false
        this.yoga = false
        this.web = true
      }
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value === 'edit') {
      this.ItemId = item._id
      this.image_URL = item.image
      if (item.testimonialType === 'yoga') {
        this.yoga = true
        this.foliofit = false
        this.web = false
      } else if (item.testimonialType === 'foliofit') {
        this.foliofit = true
        this.yoga = false
        this.web = false
      } else if (item.testimonialType === 'web') {
        this.foliofit = false
        this.yoga = false
        this.web = true
      }
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
 


  disableBox(value) {
    let flag = this.permissionService.setBoxCategoryPrivilege(value, this.user.isAdmin);
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

  tabChangeEvent(event) {
    console.log(event.nextId);
    //localStorage.setItem("TabID",event.nextId);
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

  // redirectToDietPlan() {
  //   this.selectedTab = 'tab-selectbyid3';
  //   this._route.navigate(['/fitness-wellness/diet-plan']);
  //   localStorage.setItem("TabID", 'tab-selectbyid3')
  // }

  // redirectToCalorieChart() {
  //   this._route.navigate(['/fitness-wellness/calorie-chart'])
  //   localStorage.setItem("TabID", 'tab-selectbyid5')
  // }



}
