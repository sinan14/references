import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { AdsPromotionsService } from 'src/app/services/ads-promotions.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ads-promotions',
  templateUrl: './ads-promotions.component.html',
  styleUrls: ['./ads-promotions.component.scss']
})
export class AdsPromotionsComponent implements OnInit {

  public closeResult: string;
  public value_array = [];
  public product_array = [];
  public colorValue: any;
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
  public uploadImage: any;
  public image_URL: any = '';
  public attemptedSubmit: boolean;
  public ItemId: any;

  public Partner_Promotion_Array = [];
  public Promotion_Array = [];

  public Partner_Promotion_Form: FormGroup;
  public Promotion_Form: FormGroup;

  constructor(private modalService: NgbModal,
    private _route: Router,
    private intl: IntlService,
    private permissionService: PermissionService,
    private location: Location,
    private Promotion_Service: AdsPromotionsService,
    public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    this.initForms();
    this.getPartnerPromo()
    this.getPromo()


  }

  getPartnerPromo() {
    this.Promotion_Service.getPartnerPromo().subscribe((res: any) => {
      this.Partner_Promotion_Array = res.data
      console.log(res);
      console.log(this.Partner_Promotion_Array, "Partner Promo");
    })

  }
  getPromo() {
    this.Promotion_Service.getPromo().subscribe((res: any) => {
      this.Promotion_Array = res.data
      console.log(res);
      console.log(this.Promotion_Array, "Promo");
    })

  }


  initForms() {
    this.Partner_Promotion_Form = this.formBuilder.group({
      _id: ['', Validators.required],
      type: [''],
      image: [''],
      ExternalLink: ['', Validators.required]
    })

    this.Promotion_Form = this.formBuilder.group({
      _id: ['', Validators.required],
      type: [''],
      image: [''],
      termsConditions: ['', Validators.required]
    })
  }

  get Partner_Promo_Control() {
    return this.Partner_Promotion_Form.controls;
  }
  get Promo_Control() {
    return this.Promotion_Form.controls;
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

  Save(type: any) {
    console.log(type);

    if (type === 'PartnerPromotion') {
      if (this.image_URL === '') {

        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      } else if (this.Partner_Promotion_Form.get('ExternalLink').value === '' || this.Partner_Promotion_Form.get('ExternalLink').value == null) {


        Swal.fire({
          text: 'Please Add Link!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      }
      else {
        const formData = new FormData();
        if (this.uploadImage == undefined) {

          formData.append('type', type);
          formData.append('ExternalLink', this.Partner_Promotion_Form.get('ExternalLink').value);

        } else {

          formData.append('type', type);
          formData.append('ExternalLink', this.Partner_Promotion_Form.get('ExternalLink').value);
          formData.append('image', this.uploadImage);
        }

        this.Promotion_Service.Update_Partner_Promo(formData).subscribe((res: any) => {
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
            this.modalService.dismissAll();
            this.getPartnerPromo()
            this.attemptedSubmit = false;
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

            this.Partner_Promotion_Form.reset();
            this.image_URL = '';
            this.uploadImage = undefined;
          }
        }, (err) => {
          console.log(err);
        })






      }
    }

    else if (type === 'Promotion') {
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
      else if (this.Promotion_Form.get('termsConditions').value === '' || this.Promotion_Form.get('termsConditions').value == null) {


        Swal.fire({
          text: 'Please Add Terms & Conditions!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      }
      else {
        const formData = new FormData();
        if (this.uploadImage == undefined) {

          formData.append('type', type);
          formData.append('termsConditions', this.Promotion_Form.get('termsConditions').value);

        } else {

          formData.append('type', type);
          formData.append('termsConditions', this.Promotion_Form.get('termsConditions').value);
          formData.append('image', this.uploadImage);
        }

        this.Promotion_Service.Update_Promo(formData).subscribe((res: any) => {
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
            this.modalService.dismissAll();
            this.getPromo()
            this.attemptedSubmit = false;
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

            this.Promotion_Form.reset();
            this.image_URL = '';
            this.uploadImage = undefined;
          }
        }, (err) => {
          console.log(err);
        })






      }
    }
  }

  OnUpdate(type: any) {
    console.log(type);

    if (type === 'PartnerPromotion') {
      if (this.image_URL === '') {

        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      } else if (this.Partner_Promotion_Form.get('ExternalLink').value === '' || this.Partner_Promotion_Form.get('ExternalLink').value == null) {


        Swal.fire({
          text: 'Please Add Link!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      }
      else {

        const formData = new FormData();
        if (this.uploadImage == undefined) {
          formData.append('_id', this.ItemId);
          formData.append('type', type);
          formData.append('ExternalLink', this.Partner_Promotion_Form.get('ExternalLink').value);

        } else {
          formData.append('_id', this.ItemId);
          formData.append('type', type);
          formData.append('ExternalLink', this.Partner_Promotion_Form.get('ExternalLink').value);
          formData.append('image', this.uploadImage);
        }

        console.log(this.Partner_Promotion_Form.value);

        console.log(this.ItemId);
        console.log(this.Partner_Promotion_Form.get('ExternalLink').value);
        console.log(this.uploadImage);

        this.Promotion_Service.Update_Partner_Promo(formData).subscribe((res: any) => {
          console.log(res);

          if (res.status === true) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            // this.resetForms();
            this.modalService.dismissAll();
            this.getPartnerPromo()
            this.attemptedSubmit = false;
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

            this.Partner_Promotion_Form.reset();
            this.image_URL = '';
            this.uploadImage = undefined;
          }
        }, (err) => {
          console.log(err);
        })

      }
    }

    else if (type === 'Promotion') {
      if (this.image_URL === '') {

        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      } else if (this.Promotion_Form.get('termsConditions').value === '' || this.Promotion_Form.get('termsConditions').value == null) {


        Swal.fire({
          text: 'Please Add Link!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      }
      else {

        const formData = new FormData();
        if (this.uploadImage == undefined) {
          formData.append('_id', this.ItemId);
          formData.append('type', type);
          formData.append('termsConditions', this.Promotion_Form.get('termsConditions').value);

        } else {
          formData.append('_id', this.ItemId);
          formData.append('type', type);
          formData.append('termsConditions', this.Promotion_Form.get('termsConditions').value);
          formData.append('image', this.uploadImage);
        }

        console.log(this.Promotion_Form.value);

        console.log(this.ItemId);
        console.log(this.Promotion_Form.get('termsConditions').value);
        console.log(this.uploadImage);

        this.Promotion_Service.Update_Promo(formData).subscribe((res: any) => {
          console.log(res);

          if (res.status === true) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            // this.resetForms();
            this.modalService.dismissAll();
            this.getPromo()
            this.attemptedSubmit = false;
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

            this.Promotion_Form.reset();
            this.image_URL = '';
            this.uploadImage = undefined;
          }
        }, (err) => {
          console.log(err);
        })

      }
    }

  }

  delete(type: any, id: any) {
    if (type === 'PartnerPromotionContent') {

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
          this.Promotion_Service.delete_PartnerPromo(id).subscribe((res: any) => {
            if (res.status) {
              Swal.fire({
                text: 'Successfully Deleted',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 500,
              });
              this.getPartnerPromo();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });


    }

    else if (type === 'PromotionContent') {

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
          this.Promotion_Service.delete_Promo(id).subscribe((res: any) => {
            if (res.status) {
              Swal.fire({
                text: 'Successfully Deleted',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 500,
              });
              this.getPromo();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });


    }

  }






  open(content, Value: any, item: any) {
    console.log(item);

    console.log(Value)
    if (Value === 'add') {

      this.Promotion_Form.reset()
      this.Partner_Promotion_Form.reset()
      this.image_URL = ''
      this.uploadImage = undefined


      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value === 'edit') {

      if (item.ExternalLink) {
        this.Partner_Promotion_Form.patchValue({
          ExternalLink: item.ExternalLink
        })
        console.log(this.Partner_Promotion_Form.value);
      }

      if (item.termsConditions) {
        this.Promotion_Form.patchValue({
          termsConditions: item.termsConditions
        })
        console.log(this.Promotion_Form.value);
      }

      this.ItemId = item._id;
      this.image_URL = item.image;





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

  dropDownChange(value: any) {
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
    if (value === 'Product') {
      this.product_array = ['a', 'b', 'c'];
    }
    else if (value === 'Category') {
      this.product_array = ['cat 1', 'cat 2', 'cat 3',];
    }
  }

  changeColorPickerValue(value) {
    console.log(value);
    this.colorValue = value;
  }


}
