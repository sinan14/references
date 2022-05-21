import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { AdsMedcoinService } from 'src/app/services/ads-medcoin.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ads-medcoin',
  templateUrl: './ads-medcoin.component.html',
  styleUrls: ['./ads-medcoin.component.scss']
})
export class AdsMedcoinComponent implements OnInit {

  public closeResult: string;
  public value_array = [];
  public product_array = [];
  public colorValue: any;
  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;
  public addLoading :boolean = false;



  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;


  public Mixed_Array = [];
  public AD1_Array = [];
  public AD2_Array = [];
  public Disclaimer_Array = [];
  public How_It_Wrk_Array = [];
  public uploadImage: any;
  public image_URL: any = '';
  public ItemId: any;


  public AD1_Form: FormGroup;
  public AD2_Form: FormGroup;
  public Disclaimer_Form: FormGroup;
  public How_It_Wrk_Form: FormGroup;


  constructor(private modalService: NgbModal,
    private _route: Router,
    private intl: IntlService,
    private permissionService: PermissionService,
    private location: Location,
    private Ads_Medcoin_Service: AdsMedcoinService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    this.getDATA()
    // this.getAD1()
    // this.getAD2()
    // this.getDISCLAIMER()
    // this.getHowItWrk()

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

  getDATA() {

    this.Ads_Medcoin_Service.getDATA().subscribe((res: any) => {
      // console.log(res);
      this.Mixed_Array = res.data
      console.log(this.Mixed_Array, "mixed");

      this.AD1_Array = this.Mixed_Array.filter((item) => {
        return item.type === 'ad1'
      })
      console.log(this.AD1_Array, "ad1");


      this.AD2_Array = this.Mixed_Array.filter((item) => {
        return item.type === 'ad2'
      })
      console.log(this.AD2_Array, "ad2");


      this.Disclaimer_Array = this.Mixed_Array.filter((item) => {
        return item.type === 'disclaimer'
      })
      console.log(this.Disclaimer_Array, "disclaimer");


      this.How_It_Wrk_Array = this.Mixed_Array.filter((item) => {
        return item.type === 'howItWorks'
      })
      console.log(this.How_It_Wrk_Array, "howItWorks");




    })


  }



  // getAD1() {
  //   this.Ads_Medcoin_Service.getAD1().subscribe((res: any) => {
  //     // console.log(res);
  //     this.AD1_Array = res.data
  //     console.log(this.AD1_Array, "ad1");
  //   })
  // }
  // getAD2() {
  //   this.Ads_Medcoin_Service.getAD2().subscribe((res: any) => {
  //     // console.log(res);
  //     this.AD2_Array = res.data
  //     console.log(this.AD2_Array, "ad2");
  //   })
  // }
  // getDISCLAIMER() {
  //   this.Ads_Medcoin_Service.getDISCLAIMER().subscribe((res: any) => {
  //     console.log(res);
  //     this.Disclaimer_Array = res.data
  //     console.log(this.Disclaimer_Array, "disclaimer");
  //   })
  // }
  // getHowItWrk() {
  //   this.Ads_Medcoin_Service.getHowItWrk().subscribe((res: any) => {
  //     // console.log(res);
  //     this.How_It_Wrk_Array = res.data
  //     console.log(this.How_It_Wrk_Array, "howItWorks");
  //   })
  // }









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

    if (type === 'ad1' || type === 'ad2' || type === 'disclaimer' || type === 'howItWorks' ) {
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
      else {
        this.addLoading = true;
        const formData = new FormData();
        if (this.uploadImage == undefined) {
          formData.append('_id', this.ItemId);
          formData.append('type', type);
          // formData.append('ExternalLink', this.AD1_Form.get('ExternalLink').value);

        } else {
          formData.append('_id', this.ItemId);
          formData.append('type', type);
          // formData.append('ExternalLink', this.AD1_Form.get('ExternalLink').value);
          formData.append('image', this.uploadImage);
        }

        // console.log(this.AD1_Form.value);

        console.log(this.ItemId);
        // console.log(this.AD1_Form.get('ExternalLink').value);
        console.log(this.uploadImage);

        this.Ads_Medcoin_Service.Update_Data(formData).subscribe((res: any) => {
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
          this.addLoading = false;
            this.modalService.dismissAll();
            this.getDATA()
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

            // this.AD1_Form.reset();
            this.image_URL = '';
            this.uploadImage = undefined;
          }
        }, (err) => {
          console.log(err);
        })

      }
    }
    // else if (type === 'ad2') {
    //   if (this.image_URL === '') {

    //     Swal.fire({
    //       text: 'Please Add Image!!!',
    //       icon: 'warning',
    //       showCancelButton: false,
    //       confirmButtonText: 'Ok',
    //       confirmButtonColor: '#3085d6',
    //       imageHeight: 500,
    //     });

    //   }
    //   else {

    //     const formData = new FormData();
    //     if (this.uploadImage == undefined) {
    //       formData.append('_id', this.ItemId);
    //       formData.append('type', type);
    //       // formData.append('ExternalLink', this.AD1_Form.get('ExternalLink').value);

    //     } else {
    //       formData.append('_id', this.ItemId);
    //       formData.append('type', type);
    //       // formData.append('ExternalLink', this.AD1_Form.get('ExternalLink').value);
    //       formData.append('image', this.uploadImage);
    //     }

    //     // console.log(this.AD2_Form.value);

    //     console.log(this.ItemId);
    //     // console.log(this.AD1_Form.get('ExternalLink').value);
    //     console.log(this.uploadImage);

    //     this.Ads_Medcoin_Service.Update_AD2(formData).subscribe((res: any) => {
    //       console.log(res);

    //       if (res.status === true) {
    //         Swal.fire({
    //           text: 'Successfully Updated',
    //           icon: 'success',
    //           showCancelButton: false,
    //           confirmButtonText: 'Ok',
    //           confirmButtonColor: '#3085d6',
    //           imageHeight: 500,
    //         });
    //         // this.resetForms();
    //         this.modalService.dismissAll();
    //         // this.getAD2()
    //         this.uploadImage = undefined;
    //       }
    //       else {
    //         Swal.fire({
    //           text: 'Invalid!!!',
    //           icon: 'warning',
    //           showCancelButton: false,
    //           confirmButtonText: 'Ok',
    //           confirmButtonColor: '#3085d6',
    //           imageHeight: 500,
    //         });

    //         // this.AD1_Form.reset();
    //         this.image_URL = '';
    //         this.uploadImage = undefined;
    //       }
    //     }, (err) => {
    //       console.log(err);
    //     })

    //   }
    // }
    // else if (type === 'disclaimer') {
    //   if (this.image_URL === '') {

    //     Swal.fire({
    //       text: 'Please Add Image!!!',
    //       icon: 'warning',
    //       showCancelButton: false,
    //       confirmButtonText: 'Ok',
    //       confirmButtonColor: '#3085d6',
    //       imageHeight: 500,
    //     });

    //   }
    //   else {

    //     const formData = new FormData();
    //     if (this.uploadImage == undefined) {
    //       formData.append('_id', this.ItemId);
    //       formData.append('type', type);
    //       // formData.append('ExternalLink', this.AD1_Form.get('ExternalLink').value);

    //     } else {
    //       formData.append('_id', this.ItemId);
    //       formData.append('type', type);
    //       // formData.append('ExternalLink', this.AD1_Form.get('ExternalLink').value);
    //       formData.append('image', this.uploadImage);
    //     }

    //     // console.log(this.AD2_Form.value);

    //     console.log(this.ItemId);
    //     // console.log(this.AD1_Form.get('ExternalLink').value);
    //     console.log(this.uploadImage);

    //     this.Ads_Medcoin_Service.Update_DISCLAIMER(formData).subscribe((res: any) => {
    //       console.log(res);

    //       if (res.status === true) {
    //         Swal.fire({
    //           text: 'Successfully Updated',
    //           icon: 'success',
    //           showCancelButton: false,
    //           confirmButtonText: 'Ok',
    //           confirmButtonColor: '#3085d6',
    //           imageHeight: 500,
    //         });
    //         // this.resetForms();
    //         this.modalService.dismissAll();
    //         // this.getDISCLAIMER()
    //         this.uploadImage = undefined;
    //       }
    //       else {
    //         Swal.fire({
    //           text: 'Invalid!!!',
    //           icon: 'warning',
    //           showCancelButton: false,
    //           confirmButtonText: 'Ok',
    //           confirmButtonColor: '#3085d6',
    //           imageHeight: 500,
    //         });

    //         // this.AD1_Form.reset();
    //         this.image_URL = '';
    //         this.uploadImage = undefined;
    //       }
    //     }, (err) => {
    //       console.log(err);
    //     })

    //   }
    // }
    // else if (type === 'howItWorks') {
    //   if (this.image_URL === '') {

    //     Swal.fire({
    //       text: 'Please Add Image!!!',
    //       icon: 'warning',
    //       showCancelButton: false,
    //       confirmButtonText: 'Ok',
    //       confirmButtonColor: '#3085d6',
    //       imageHeight: 500,
    //     });

    //   }
    //   else {

    //     const formData = new FormData();
    //     if (this.uploadImage == undefined) {
    //       formData.append('_id', this.ItemId);
    //       formData.append('type', type);
    //       // formData.append('ExternalLink', this.AD1_Form.get('ExternalLink').value);

    //     } else {
    //       formData.append('_id', this.ItemId);
    //       formData.append('type', type);
    //       // formData.append('ExternalLink', this.AD1_Form.get('ExternalLink').value);
    //       formData.append('image', this.uploadImage);
    //     }

    //     // console.log(this.AD2_Form.value);

    //     console.log(this.ItemId);
    //     // console.log(this.AD1_Form.get('ExternalLink').value);
    //     console.log(this.uploadImage);

    //     this.Ads_Medcoin_Service.Update_HowItWrk(formData).subscribe((res: any) => {
    //       console.log(res);

    //       if (res.status === true) {
    //         Swal.fire({
    //           text: 'Successfully Updated',
    //           icon: 'success',
    //           showCancelButton: false,
    //           confirmButtonText: 'Ok',
    //           confirmButtonColor: '#3085d6',
    //           imageHeight: 500,
    //         });
    //         // this.resetForms();
    //         this.modalService.dismissAll();
    //         // this.getHowItWrk()
    //         this.uploadImage = undefined;
    //       }
    //       else {
    //         Swal.fire({
    //           text: 'Invalid!!!',
    //           icon: 'warning',
    //           showCancelButton: false,
    //           confirmButtonText: 'Ok',
    //           confirmButtonColor: '#3085d6',
    //           imageHeight: 500,
    //         });

    //         // this.AD1_Form.reset();
    //         this.image_URL = '';
    //         this.uploadImage = undefined;
    //       }
    //     }, (err) => {
    //       console.log(err);
    //     })

    //   }
    // }

  }




  open(content, Value: any, item: any) {
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
