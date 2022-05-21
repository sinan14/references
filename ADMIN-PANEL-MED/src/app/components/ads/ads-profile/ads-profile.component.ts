import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ad1ProfileService } from 'src/app/services/ad1-profile.service';


@Component({
  selector: 'app-ads-profile',
  templateUrl: './ads-profile.component.html',
  styleUrls: ['./ads-profile.component.scss']
})
export class AdsProfileComponent implements OnInit {

  public closeResult: string;
  public value_array = [];
  public product_array = [];
  public data_array = [];
  public id_array = [];
  public colorValue: any;
  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;

  //NEW VARIABLES

  public addLoading: boolean = false;
  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public uploadImage: any;
  public image_URL: any = '';
  public attemptedSubmit: boolean;
  public Ad1ContentUpdateForm: FormGroup;
  public MedfillContentUpdateForm: FormGroup;
  public MedPrideUpdateForm: FormGroup;
  public ReferEarnUpdateForm: FormGroup;
  public AddrssUpdateForm: FormGroup;
  public Ad1: any = [];
  public medFill: any = [];
  public medPride_Array: any = [];
  public ReferEarn_Array: any = [];
  public Addrs_Array: any = [];
  public ItemId: any;
  public drop1_cat_array: any = [];
  public drop1_pdt_array: any = [];
  public newdrop_list_array = [];

  constructor(private modalService: NgbModal,
    private _route: Router,
    private intl: IntlService,
    private permissionService: PermissionService,
    private location: Location,
    private Ad1_Service: Ad1ProfileService,
    public formBuilder: FormBuilder) {

  }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    this.getDropDown1_Cat()
    this.getDropDown1_pdt()

    this.getAd1()
    this.getMedPride()
    this.getRefer_Earn()
    this.getAddrs()
    this.initForms();


  }


  getAd1() {
    this.Ad1_Service.getAd1().subscribe((res: any) => {
      // console.log(res);

      this.Ad1 = res.data
      console.log(this.Ad1);

      this.medFill = this.Ad1.filter((item) => {
        return item.type === "medFill"
      })
      console.log(this.medFill);
    })

  }
  getMedPride() {
    this.Ad1_Service.getMedPride().subscribe((res: any) => {
      // console.log(res);

      this.medPride_Array = res.data
      console.log(this.medPride_Array);
    })

  }
  getRefer_Earn() {
    this.Ad1_Service.getRefer_Earn().subscribe((res: any) => {
      // console.log(res);

      this.ReferEarn_Array = res.data
      console.log(this.ReferEarn_Array);
    })

  }
  getAddrs() {
    this.Ad1_Service.getAddrs().subscribe((res: any) => {
      // console.log(res);

      this.Addrs_Array = res.data
      console.log(this.Addrs_Array);
    })
  }

  getDropDown1_Cat() {
    this.Ad1_Service.getDropDown1_Cat().subscribe((res: any) => {
      // console.log(res);
      this.drop1_cat_array = res.data
      console.log(this.drop1_cat_array, "drop 1 cat");

    })
  }
  getDropDown1_pdt() {
    console.log("drop 1 pdt");

    this.Ad1_Service.getDropDown1_pdt().subscribe((res: any) => {
      console.log(res);
      this.drop1_pdt_array = res.data
      console.log(this.drop1_pdt_array, "drop 1 pdt");

    })
  }


  initForms() {
    this.Ad1ContentUpdateForm = this.formBuilder.group({
      _id: ['', Validators.required],
      type: ['ad1'],
      image: [''],
    })

    this.MedfillContentUpdateForm = this.formBuilder.group({
      _id: ['', Validators.required],
      type: ['medFill', Validators.required],
      image: [''],
    })

    this.MedPrideUpdateForm = this.formBuilder.group({
      _id: ['', Validators.required],
      type: ['medPride', Validators.required],
      image: [''],
    })

    this.ReferEarnUpdateForm = this.formBuilder.group({
      _id: ['', Validators.required],
      type: ['referEarn', Validators.required],
      title: ['', Validators.required],
      image: [''],
    })

    this.AddrssUpdateForm = this.formBuilder.group({
      sliderId: ['', Validators.required],
      sliderType: ['address', Validators.required],
      type: ['', Validators.required],
      typeId: ['', Validators.required],
      image: [''],
    })
  }



  get f() {
    return this.Ad1ContentUpdateForm.controls;
  }
  get medfil() {
    return this.MedfillContentUpdateForm.controls;
  }
  get medPride() {
    return this.MedPrideUpdateForm.controls;
  }
  get ReferEarn() {
    return this.ReferEarnUpdateForm.controls;
  }
  get Addrs() {
    return this.AddrssUpdateForm.controls;
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



  OnUpdate(type: any) {
    console.log(type);


    if (type === 'Ad1_Image') {
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
          formData.append('_id', this.ItemId);
          formData.append('type', this.Ad1ContentUpdateForm.get('type').value);
        } else {
          formData.append('_id', this.ItemId);
          formData.append('type', this.Ad1ContentUpdateForm.get('type').value);
          formData.append('image', this.uploadImage);
        }

        this.Ad1_Service.update_Ad1_Medfill_Image(formData).subscribe((res: any) => {
          console.log(res);
          if (res.status === true) {
            Swal.fire({
              text: 'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            // this.resetForms();
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getAd1()
            this.uploadImage = undefined;
          }
          else {
            this.addLoading = false;
            Swal.fire({
              text: 'Invalid!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.Ad1ContentUpdateForm.reset();
            this.image_URL = '';
            this.uploadImage = undefined;
          }
        }, (err) => {
          console.log(err);
        })

      }
    }


    else if (type === 'Medfill_img') {
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
          formData.append('_id', this.ItemId);
          formData.append('type', this.medfil.type.value);

        } else {
          formData.append('_id', this.ItemId);
          formData.append('type', this.medfil.type.value);
          formData.append('image', this.uploadImage);
        }

        console.log(this.ItemId);
        console.log(this.medfil.type.value);
        console.log(this.uploadImage);

        this.Ad1_Service.update_Ad1_Medfill_Image(formData).subscribe((res: any) => {
          console.log(res);
          if (res.status === true) {
            Swal.fire({
              text: 'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            // this.resetForms();
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getAd1()
            this.image_URL = '';
            this.uploadImage = undefined;

          }
          else {
            this.addLoading = false;
            Swal.fire({
              text: 'Invalid!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.MedfillContentUpdateForm.reset();
            this.image_URL = '';
            this.uploadImage = undefined;
          }

        }, (err) => {
          console.log(err);
        })
      }

    }


    else if (type === 'MedPride_img') {
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
          formData.append('_id', this.ItemId);
          formData.append('type', this.medPride.type.value);
        } else {
          formData.append('_id', this.ItemId);
          formData.append('type', this.medPride.type.value);
          formData.append('image', this.uploadImage);
        }
        console.log(this.ItemId);
        console.log(this.medPride.type.value);
        console.log(this.uploadImage);

        this.Ad1_Service.update_MedPride_Image(formData).subscribe((res: any) => {
          console.log(res);
          if (res.status === true) {
            Swal.fire({
              text: 'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            // this.resetForms();
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getMedPride()
            this.image_URL = '';
            this.uploadImage = undefined;
          }
          else {
            this.addLoading = false;
            Swal.fire({
              text: 'Invalid!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.MedPrideUpdateForm.reset();
            this.image_URL = '';
            this.uploadImage = undefined;
          }
        }, (err) => {
          console.log(err);
        })
      }
    }


    else if (type === 'ReferEarn_img') {
      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });


      } else if (this.ReferEarn.title.value === '') {
        Swal.fire({
          text: 'Please Add Title!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      } else {


        console.log(type);

        const formData = new FormData();
        this.addLoading = true;
        if (this.uploadImage == undefined) {
          formData.append('_id', this.ItemId);
          formData.append('type', this.ReferEarn.type.value);
          formData.append('title', this.ReferEarn.title.value);
        } else {
          formData.append('_id', this.ItemId);
          formData.append('type', this.ReferEarn.type.value);
          formData.append('title', this.ReferEarn.title.value);
          formData.append('image', this.uploadImage);
        }
        console.log(this.ItemId);
        console.log(this.ReferEarn.type.value);
        console.log(this.ReferEarn.title.value);
        console.log(this.uploadImage);
        this.Ad1_Service.update_ReferEarn_Image(formData).subscribe((res: any) => {
          console.log(res);
          if (res.status === true) {
            Swal.fire({
              text: 'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.attemptedSubmit = false;
            // this.resetForms();
            this.modalService.dismissAll();
            this.getRefer_Earn()
            this.image_URL = '';
            this.uploadImage = undefined;
          }
          else {
            Swal.fire({
              text: 'Invalid!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.ReferEarnUpdateForm.reset();
            this.image_URL = '';
            this.uploadImage = undefined;
          }
        }, (err) => {
          console.log(err);
        })

      }
    }


    else if (type === 'Addrs_img') {
      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });


      }
      //  else if (this.Addrs.typeId.value === '' || this.Addrs.typeId.value === null) {

      //   Swal.fire({
      //     text: 'Invalid!!!',
      //     icon: 'warning',
      //     showCancelButton: false,
      //     confirmButtonText: 'Ok',
      //     confirmButtonColor: '#3085d6',
      //     imageHeight: 500,
      //   });
      //   this.addLoading = false;
      //   this.AddrssUpdateForm.reset();
      //   this.image_URL = '';
      //   this.uploadImage = undefined;
      // }
      else {
        console.log(type);

        const formData = new FormData();
        this.addLoading = true;
        if (this.uploadImage == undefined) {
          formData.append('sliderId', this.ItemId);
          formData.append('sliderType', this.Addrs.sliderType.value);
          formData.append('type', this.Addrs.type.value);
          formData.append('typeId', this.Addrs.typeId.value);
        } else {
          formData.append('sliderId', this.ItemId);
          formData.append('sliderType', this.Addrs.sliderType.value);
          formData.append('type', this.Addrs.type.value);
          formData.append('typeId', this.Addrs.typeId.value);
          formData.append('image', this.uploadImage);
        }
        console.log(this.ItemId);
        console.log(this.Addrs.sliderType.value);
        console.log(this.Addrs.type.value);
        console.log(this.Addrs.typeId.value);
        console.log(this.uploadImage);

        this.Ad1_Service.update_Addr_Image(formData).subscribe((res: any) => {
          console.log(res);
          if (res.status === true) {
            Swal.fire({
              text: 'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.attemptedSubmit = false;
            // this.resetForms();
            this.modalService.dismissAll();
            this.getAddrs()
            this.image_URL = '';
            this.uploadImage = undefined;
          }
          else {
            Swal.fire({
              text: 'Invalid!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.AddrssUpdateForm.reset();
            this.image_URL = '';
            this.uploadImage = undefined;
          }
        }, (err) => {
          console.log(err);
        })
      }
    }
  }




  open(content, Value: any, item: any) {
    this.image_URL = ''
    this.ItemId = null
    console.log(item);
    // this.getDropDown1_Cat()
    // this.getDropDown1_pdt()
    console.log(this.image_URL);


    console.log(item._id)
    console.log(Value)
    if (Value === 'add') {
      this.newdrop_list_array = []
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value === 'edit') {
      this.newdrop_list_array = []

      this.ItemId = item._id;
      this.image_URL = item.image;
      this.update_Modal_Flag = true;

      console.log(this.image_URL)
      console.log(this.ItemId)

      // this.getDropDown1_Cat()
      // this.getDropDown1_pdt()

      // this.newdrop_list_array = this.drop1_cat_array;
      // this.newdrop_list_array = this.drop1_pdt_array;

      if (item.sliderType != '') {

        if (item.type == '0') {

          this.newdrop_list_array = this.drop1_cat_array
        }
        if (item.type == '1') {

          this.newdrop_list_array = this.drop1_pdt_array
        }
        console.log(this.newdrop_list_array);


        this.AddrssUpdateForm.patchValue({
          sliderId: this.ItemId,
          sliderType: "address",
          type: item.type,
          typeId: item.typeId,

        })
        console.log(this.AddrssUpdateForm.value);

      }


      if (item.title !== '') {
        this.ReferEarnUpdateForm.patchValue({
          title: item.title
        })
        // console.log(this.ReferEarnUpdateForm.value);
      }



      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;

        console.log(this.closeResult);

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

  dropDownChange(value: any) {
    console.log(value);

    if (value === 'medimall') {
      this.value_array = ['Product', 'Category'];
    }
    else if (value === 'foliofit') {
      this.value_array = ['Fitness Club', 'Yoga', 'Diet Regieme', 'Health', 'Nutri Chart', 'BMI'];
      this.product_array = [];
    }
    else if (value === 'medfeed') {
      this.value_array = ['Med Articles', 'Medquiz', 'Expert Advice', 'Health Tips', 'Live Updates', 'Home'];
      this.product_array = [];
    }
    else if (value === 'external') {
      this.value_array = ['Link'];
      this.product_array = [];
    }
  }

  dropDownProductChange(value: any) {
    console.log(value)
    // this.getDropDown1_Cat()
    // this.getDropDown1_pdt()
    if (value == '0') {
      this.newdrop_list_array = this.drop1_cat_array

      console.log(this.newdrop_list_array, "cat");
    }
    if (value == '1') {
      this.newdrop_list_array = this.drop1_pdt_array

      console.log(this.newdrop_list_array, "pdt");
    }
    this.AddrssUpdateForm.patchValue({
      sliderId: this.ItemId,
      sliderType: "address",
      type: value,
      typeId: this.newdrop_list_array[0]._id,

    })
    console.log(this.newdrop_list_array[0]._id);

    // this.data_array = this.product_array.map((item) => {
    //   return item.title
    // })

    // this.id_array = this.product_array.map((item) => {
    //   return item._id
    // })

    // console.log(this.data_array, "title");
    // console.log(this.id_array, "Id");
  }

  Filter(value) {
    if (this.AddrssUpdateForm.get('type').value == '0') {
      if (value.length >= 1) {
        this.newdrop_list_array = this.drop1_cat_array.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } else {
        this.getDropDown1_Cat();
        this.newdrop_list_array = this.drop1_cat_array;
      }
    }

    else {
      if (value.length >= 1) {
        this.newdrop_list_array = this.drop1_pdt_array.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } else {
        this.getDropDown1_pdt();
        this.newdrop_list_array = this.drop1_pdt_array
      }
    }

    // this.newdrop_list_array = this.newdrop_list_array.filter((item) => {
    //   if(item.title == value) {
    //     console.log(item.title);
    //     // return item.title == value
    //   }
     
    // })
    // console.log(value);

  }

  changeColorPickerValue(value) {
    console.log(value);
    this.colorValue = value;
  }

  resetForms() {
    this.Ad1ContentUpdateForm.reset()
    this.MedfillContentUpdateForm.reset()
    this.MedPrideUpdateForm.reset()
    this.ReferEarnUpdateForm.reset()
    this.AddrssUpdateForm.reset()
    this.attemptedSubmit = false;
  }

}
