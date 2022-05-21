import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { AdsCartService } from 'src/app/services/ads-cart.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-ads-cart',
  templateUrl: './ads-cart.component.html',
  styleUrls: ['./ads-cart.component.scss']
})
export class AdsCartComponent implements OnInit {


  public closeResult: string;
  public value_array = [];
  public product_array = [];
  public colorValue: any;
  public add_Modal_Flag: boolean = false;
  public update_Modal_Flag: boolean = false;
  public drop1_cat_array = [];
  public drop2_subcat_array = [];

  public drop1_pdt_array = [];
  // public drop2_subpdtORcat_array = [];
  public drop_list_array = [];
  public newdrop_list_array = [];

  public cat: boolean;

  public pdt: boolean;

  //NEW VARIABLES

  public addLoading: boolean = false;
  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public HandPick_Array: any = [];
  public Item_HandPick_Array: any = [];
  public Mixed_Array: any = [];
  public AD1_Array: any = [];
  public Subscrption_Array: any = [];
  public Order_Rev1_Array: any = [];
  public Order_Rev2_Array: any = [];
  public Order_Medicine_3Icon_Array: any = [];
  public How_To_Order_Medicine_Array: any = [];
  public Order_Medicine_Slider_Array: any = [];
  public uploadImage: any;
  public image_URL: any = '';
  public attemptedSubmit: boolean;
  public Hand_Pick_Add_Form: FormGroup;
  public Hand_Pick_ContentUpdateForm: FormGroup;
  public Ad1_Subs_OrdrRev2: FormGroup;
  public OrderReview_1_ContentUpdateForm: FormGroup;
  public OrderMedicine_3Icon_ContentUpdateForm: FormGroup;
  public HowToOrder_MedicineContent_UpdateForm: FormGroup;
  public Order_Medicine_Slider_Form: FormGroup;


  public uploadedVideo: any = null;
  public vid_src: any = '';


  public ItemId: any;


  constructor(private modalService: NgbModal,
    private _route: Router,
    private intl: IntlService,
    private permissionService: PermissionService,
    private location: Location,
    private Cart_Service: AdsCartService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    this.initForms();
    this.getDropDown1_Cat()
    this.getDropDown1_pdt()
    this.getHandPick()
    this.getAd1_Subs_OrdrRev2()
    this.getOrderRev1()
    this.getOrderMed_3Icon()
    this.getHowToOrderMed()
    this.getOrderMed_Slider()


  }

  getDropDown1_Cat() {
    this.Cart_Service.getDropDown1_Cat().subscribe((res: any) => {
      // console.log(res);
      this.drop1_cat_array = res.data
      console.log(this.drop1_cat_array, "drop 1");

    })
  }
  getDropDown2_CatSub(data) {
    console.log(data, "drop 2 called");

    this.Cart_Service.getDropDown2_CatSub(data).subscribe((res: any) => {
      // console.log(res);

      this.drop2_subcat_array = res.data
      console.log(this.drop2_subcat_array, "drop 2");
    })
  }

  getDropDown1_pdt() {
    console.log("drop 1 pdt");

    this.Cart_Service.getDropDown1_pdt().subscribe((res: any) => {
      console.log(res);
      this.drop1_pdt_array = res.data
      console.log(this.drop1_pdt_array, "drop 1 pdt/cat");

    })
  }
  // getDropDown2_pdtORcatSub(data) {
  //   console.log(data, "drop 2 _pdtORcatSub called");
  //   this.Cart_Service.getDropDown2_pdtORcatSub(data).subscribe((res: any) => {
  //     console.log(res)
  //     this.drop2_subpdtORcat_array = res.data
  //     console.log(this.drop2_subpdtORcat_array, "drop 1 pdt/cat");

  //   })
  // }

  getHandPick() {
    this.Cart_Service.getHandPick().subscribe((res: any) => {
      // console.log(res);
      this.HandPick_Array = res.data
      console.log(this.HandPick_Array, "Hand Pick");
      console.log(this.Item_HandPick_Array, "Item Hand Pick");

    })
  }

  getAd1_Subs_OrdrRev2() {
    this.Cart_Service.getAd1_Subs_OrdrRev2().subscribe((res: any) => {
      // console.log(res);
      this.Mixed_Array = res.data
      console.log(this.Mixed_Array);

      this.AD1_Array = this.Mixed_Array.filter((item) => {
        return item.type === "ad1"
      })
      console.log(this.AD1_Array, "ad1");

      this.Subscrption_Array = this.Mixed_Array.filter((item) => {
        return item.type === "subscription"
      })
      console.log(this.Subscrption_Array, "subscription");

      this.Order_Rev2_Array = this.Mixed_Array.filter((item) => {
        return item.type === "orderreview2"
      })
      console.log(this.Order_Rev2_Array, "orderreview2");
    })


  }

  getOrderRev1() {
    this.Cart_Service.getOrderRev1().subscribe((res: any) => {
      this.Order_Rev1_Array = res.data
      console.log(this.Order_Rev1_Array, "Order Rev 1");

    })
  }

  getOrderMed_3Icon() {
    this.Cart_Service.getOrderMed_3Icon().subscribe((res: any) => {
      this.Order_Medicine_3Icon_Array = res.data
      console.log(this.Order_Medicine_3Icon_Array, "Order Med 3 Icon");

    })
  }

  getHowToOrderMed() {
    this.Cart_Service.getHowToOrderMed().subscribe((res: any) => {
      this.How_To_Order_Medicine_Array = res.data
      console.log(this.How_To_Order_Medicine_Array, "How To Order Med");

    })
  }

  getOrderMed_Slider() {
    this.Cart_Service.getOrderMed_Slider().subscribe((res: any) => {
      this.Order_Medicine_Slider_Array = res.data
      console.log(this.Order_Medicine_Slider_Array, "Order Med Slider");

    })
  }


  initForms() {

    this.Hand_Pick_ContentUpdateForm = this.formBuilder.group({
      type: ['', Validators.required],
      typeId: ['', Validators.required],
      sliderId: [''],
    })


    this.Ad1_Subs_OrdrRev2 = this.formBuilder.group({
      _id: ['', Validators.required],
      type: ['', Validators.required],
      image: [''],
    })

    this.OrderReview_1_ContentUpdateForm = this.formBuilder.group({
      sliderId: [''],
      type: ['', Validators.required],
      typeId: ['', Validators.required],
      image: [''],
    })

    this.OrderMedicine_3Icon_ContentUpdateForm = this.formBuilder.group({
      _id: [''],
      type: ['', Validators.required],
      image: [''],
      name: ['', Validators.required]
    })

    this.HowToOrder_MedicineContent_UpdateForm = this.formBuilder.group({
      HowToOrderMedicineId: [''],
      type: ['', Validators.required],
      thumbnail: ['', Validators.required],
      video: [''],
    })

    this.Order_Medicine_Slider_Form = this.formBuilder.group({
      sliderId: [''],
      type: ['', Validators.required],
      typeId: ['', Validators.required],
      image: [''],
    })

  }

  get h() {
    return this.Hand_Pick_ContentUpdateForm.controls;
  }

  get or1() {
    return this.OrderReview_1_ContentUpdateForm.controls;
  }
  get Med3Icon() {
    return this.OrderMedicine_3Icon_ContentUpdateForm.controls;
  }
  get how() {
    return this.HowToOrder_MedicineContent_UpdateForm.controls;
  }

  get oms() {
    return this.Order_Medicine_Slider_Form.controls;
  }
  get aso1() {
    return this.Ad1_Subs_OrdrRev2.controls;
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

  onVideoChange(event: any) {
    let form = this.HowToOrder_MedicineContent_UpdateForm;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.type.indexOf('video') != 0) {
        Swal.fire('Oops!', "Please image select a valid video file", 'warning');
        return false;
      }
      this.uploadedVideo = file;
      // this.uploadedVideoFileName = file.name;

      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   let content = reader.result as string;
      //   this.uploadedThumbnailImagePreview = content;
      // };
    }
  }



  OnUpdate(type: any) {
    console.log(type);

    if (type === 'handpick') {
      if (this.Hand_Pick_ContentUpdateForm.valid) {
        let body = {
          type: this.Hand_Pick_ContentUpdateForm.get('type').value,
          typeId: this.Hand_Pick_ContentUpdateForm.get('typeId').value,
          sliderId: this.ItemId,
        }
        console.log(body);
        this.addLoading = true;
        this.Cart_Service.update_HandPick(body).subscribe((res: any) => {
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
            this.getHandPick()
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
            this.attemptedSubmit = false;
            // this.Hand_Pick_ContentUpdateForm.reset();
          } 
          // else if (res.status == false && res.data == 'Handpick already exist') {
          //   this.addLoading = false;
          //   Swal.fire({
          //     text: 'Successfully Updated',
          //     icon: 'success',
          //     showCancelButton: false,
          //     confirmButtonText: 'Ok',
          //     confirmButtonColor: '#3085d6',
          //     imageHeight: 500,
          //   });
          //   this.modalService.dismissAll();
          //   this.getHandPick()
          //   this.uploadImage = undefined;
          //   this.uploadedVideo = undefined;
          //   this.attemptedSubmit = false;
          // }
          else if (res.status == false) {
            this.addLoading = false;
            Swal.fire({
              text: res.data,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.modalService.dismissAll();
            this.getHandPick()
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
            this.attemptedSubmit = false;
          }
        })
      }
      else {
        this.addLoading = false;
        Swal.fire({
          text: 'Please Add Data!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

        // this.Hand_Pick_ContentUpdateForm.reset();
        this.uploadImage = undefined;
        this.uploadedVideo = undefined;
      }
    }
    // , (err) => {
    //   console.log(err);
    // })
    else if (type === 'ad1' || type === 'subscription' || type === 'orderreview2') {
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
          formData.append('type', type);
        } else {
          formData.append('_id', this.ItemId);
          formData.append('type', type);
          formData.append('image', this.uploadImage);
        }
        this.Cart_Service.update_Ad1_Subs_OrdrRev2(formData).subscribe((res: any) => {
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
            this.getAd1_Subs_OrdrRev2()
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
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

            this.Ad1_Subs_OrdrRev2.reset();
            this.image_URL = '';
            this.vid_src = '';
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
          }
        }, (err) => {
          console.log(err);
        })

      }

    }



    else if (type === 'Order_Rev_1') {
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
          formData.append('sliderId', this.ItemId);
          formData.append('type', this.OrderReview_1_ContentUpdateForm.get('type').value);
          formData.append('typeId', this.OrderReview_1_ContentUpdateForm.get('typeId').value);

        } else {
          formData.append('sliderId', this.ItemId);
          formData.append('type', this.OrderReview_1_ContentUpdateForm.get('type').value);
          formData.append('typeId', this.OrderReview_1_ContentUpdateForm.get('typeId').value);
          formData.append('image', this.uploadImage);
        }
        console.log(this.OrderReview_1_ContentUpdateForm.value);

        console.log(this.ItemId);
        console.log(this.OrderReview_1_ContentUpdateForm.get('type').value);
        console.log(this.OrderReview_1_ContentUpdateForm.get('typeId').value);
        console.log(this.uploadImage);

        this.Cart_Service.update_OrderRev1(formData).subscribe((res: any) => {
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
            this.getOrderRev1()
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
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

            this.OrderReview_1_ContentUpdateForm.reset();
            this.image_URL = '';
            this.vid_src = '';
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
          }
        }, (err) => {
          console.log(err);
        })
      }
    }
    else if (type === 'orderMedicine3Icon') {
      console.log(type);

      if (this.image_URL === '') {

        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      } else if (this.OrderMedicine_3Icon_ContentUpdateForm.get('name').value === '') {
        Swal.fire({
          text: 'Please Add Name!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
      else {

        const formData = new FormData();
        this.addLoading = true;
        if (this.uploadImage == undefined) {
          formData.append('_id', this.ItemId);
          formData.append('type', type);
          formData.append('name', this.Med3Icon.name.value);

        } else {
          formData.append('_id', this.ItemId);
          formData.append('type', type);
          formData.append('name', this.Med3Icon.name.value);
          formData.append('image', this.uploadImage);
        }

        console.log(this.ItemId);
        console.log(type);
        console.log(this.Med3Icon.name.value);
        console.log(this.uploadImage);

        this.Cart_Service.update_Order_Med_3Icn(formData).subscribe((res: any) => {

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
            this.getOrderMed_3Icon()
            this.attemptedSubmit = false;
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
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

            this.OrderMedicine_3Icon_ContentUpdateForm.reset();
            this.image_URL = '';
            this.vid_src = '';
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
          }
        }, (err) => {
          console.log(err);


        })
      }

    } else if (type === 'howToOrderMedicineThumbnail') {
      console.log(type);

      if (this.image_URL === '') {

        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      } else if (this.vid_src === '') {

        Swal.fire({
          text: 'Please Add Video!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      }


      else {

        const formData = new FormData();
        this.addLoading = true;
        if (this.uploadImage == undefined && this.uploadedVideo == undefined) {
          formData.append('HowToOrderMedicineId', this.ItemId);
          formData.append('type', type);
          // formData.append('video', this.HowToOrder_MedicineContent_UpdateForm.get('video').value);

        } else if (this.uploadImage == undefined && this.uploadedVideo != undefined) {
          formData.append('HowToOrderMedicineId', this.ItemId);
          formData.append('type', type);
          formData.append('video', this.uploadedVideo);

        } else if (this.uploadedVideo == undefined && this.uploadImage != undefined) {
          formData.append('HowToOrderMedicineId', this.ItemId);
          formData.append('type', type);
          formData.append('thumbnail', this.uploadImage);

        }else {
          formData.append('HowToOrderMedicineId', this.ItemId);
          formData.append('type', type);
          formData.append('video', this.uploadedVideo);
          formData.append('thumbnail', this.uploadImage);
        }

        console.log(this.ItemId);
        console.log(type);
        console.log(this.uploadedVideo);
        console.log(this.uploadImage);

        this.Cart_Service.update_HowToOrder(formData).subscribe((res: any) => {
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
            this.getHowToOrderMed()
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
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
            this.HowToOrder_MedicineContent_UpdateForm.reset();
            this.image_URL = '';
            this.vid_src = '';
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
          }
        }, (err) => {
          console.log(err);


        })
      }

    } else if (type === 'OrderMedicineSlider') {
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
          formData.append('sliderId', this.ItemId);
          formData.append('type', this.Order_Medicine_Slider_Form.get('type').value);
          formData.append('typeId', this.Order_Medicine_Slider_Form.get('typeId').value);

        } else {
          formData.append('sliderId', this.ItemId);
          formData.append('type', this.Order_Medicine_Slider_Form.get('type').value);
          formData.append('typeId', this.Order_Medicine_Slider_Form.get('typeId').value);
          formData.append('image', this.uploadImage);
        }
        console.log(this.Order_Medicine_Slider_Form.value);

        console.log(this.ItemId);
        console.log(this.Order_Medicine_Slider_Form.get('type').value);
        console.log(this.Order_Medicine_Slider_Form.get('typeId').value);
        console.log(this.uploadImage);

        this.Cart_Service.update_Order_Med_Slider(formData).subscribe((res: any) => {
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
            this.addLoading = false;
            // this.resetForms();
            this.modalService.dismissAll();
            this.getOrderMed_Slider()
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
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

            this.Order_Medicine_Slider_Form.reset();
            this.image_URL = '';
            this.vid_src = '';
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
          }
        }, (err) => {
          console.log(err);
        })
      }
    }
  }




  Save(type) {
    console.log(type);


    if (type === 'handpick') {



      console.log("hand pick");
      if (this.Hand_Pick_ContentUpdateForm.valid) {
        const formData = new FormData();
        this.addLoading = true;
        formData.append('type', this.Hand_Pick_ContentUpdateForm.get('type').value)
        formData.append('typeId', this.Hand_Pick_ContentUpdateForm.get('typeId').value)

        this.Cart_Service.update_HandPick(formData).subscribe((res: any) => {

          console.log(res);
          if (res.status == true) {
            Swal.fire({
              text: 'Added Sucessfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.image_URL = '';
            this.vid_src = '';
            this.getHandPick()
            this.attemptedSubmit = false;
            // this.drop1_cat_array = []
            // this.Hand_Pick_ContentUpdateForm.reset();
          } else if (res.status == false) {
            this.addLoading = false;
            Swal.fire({
              text: res.data,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });

          }
        })

      } else {
        Swal.fire({
          text: 'Please Add Data!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      }
    }
    if (type === 'OrderMedicineSlider') {

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
      if (this.Order_Medicine_Slider_Form.valid) {

        const formData = new FormData();
        this.addLoading = true;
        if (this.uploadImage == undefined) {
          // formData.append('sliderId', this.ItemId);
          formData.append('type', this.Order_Medicine_Slider_Form.get('type').value);
          formData.append('typeId', this.Order_Medicine_Slider_Form.get('typeId').value);

        } else {
          // formData.append('sliderId', this.ItemId);
          formData.append('type', this.Order_Medicine_Slider_Form.get('type').value);
          formData.append('typeId', this.Order_Medicine_Slider_Form.get('typeId').value);
          formData.append('image', this.uploadImage);
        }
        console.log(this.Order_Medicine_Slider_Form.value);

        console.log(this.ItemId);
        console.log(this.Order_Medicine_Slider_Form.get('type').value);
        console.log(this.Order_Medicine_Slider_Form.get('typeId').value);
        console.log(this.uploadImage);


        this.Cart_Service.update_Order_Med_Slider(formData).subscribe((res: any) => {
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
            this.getOrderMed_Slider()
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;

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

            this.Order_Medicine_Slider_Form.reset();
            this.image_URL = '';
            this.vid_src = '';
            this.uploadImage = undefined;
            this.uploadedVideo = undefined;
          }
        }, (err) => {
          console.log(err);
        })



      }
    }
  }





  open(content, Value: any, item: any) {
    this.attemptedSubmit = false
    console.log(item);

    console.log(Value)

    if (Value === 'add') {
      this.Hand_Pick_ContentUpdateForm.reset()
      this.Order_Medicine_Slider_Form.reset()
      this.drop_list_array = []
      this.drop2_subcat_array = []
      this.vid_src = '';
      this.image_URL = ''
      this.uploadedVideo = undefined;
      this.uploadImage = undefined
      // if (item === 'handpick') {
      //   this.Hand_Pick_ContentUpdateForm.reset()
      // }

      // if (item === 'OrderMedicineSlider') {
      //   this.Order_Medicine_Slider_Form.reset()

      // }


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
      // this.getDropDown1_Cat()
      // this.getDropDown1_pdt()
      // this.drop_list_array = this.drop1_cat_array
      // this.drop_list_array = this.drop1_pdt_array   
      if (item.sliderType === "handpick") {
        this.getDropDown2_CatSub(item.type)
        this.Hand_Pick_ContentUpdateForm.patchValue({
          type: item.type,
          typeId: item.typeId._id,
          sliderId: item._id,
        })
      }
      console.log(this.Hand_Pick_ContentUpdateForm.value, "hand_pick_form");


      if (item.sliderType === "orderreview") {
        // this.getDropDown2_CatSub(item.type)


        if (item.type == '0') {

          this.drop_list_array = this.drop1_cat_array
        } else if (item.type == '1') {

          this.drop_list_array = this.drop1_pdt_array
        }
        console.log(this.drop_list_array);

        this.OrderReview_1_ContentUpdateForm.patchValue({

          type: item.type,
          typeId: item.typeId,
          sliderId: item._id,

        })
      }
      console.log(this.OrderReview_1_ContentUpdateForm.value, "order_rev1_form");


      if (item.sliderType === "OrderMedicineSlider") {

        if (item.type == '0') {

          this.newdrop_list_array = this.drop1_cat_array
        } else if (item.type == '1') {

          this.newdrop_list_array = this.drop1_pdt_array
        }
        console.log(this.newdrop_list_array);
        this.Order_Medicine_Slider_Form.patchValue({

          type: item.type,
          typeId: item.typeId,
          sliderId: item._id,

        })
      }
      console.log(this.Order_Medicine_Slider_Form.value, "order_med_slider_form");

      if (item.name !== '') {
        this.OrderMedicine_3Icon_ContentUpdateForm.patchValue({
          name: item.name
        })
      }




      if (item.image) {
        this.image_URL = item.image
      }
      console.log(this.image_URL);

      if (item.thumbnail) {
        this.image_URL = item.thumbnail
        console.log("thumbnail")
      }

      if (item.video) {
        this.vid_src = item.video
      }
      console.log(this.vid_src);


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


  delete(type: any, id: any) {
    if (type === 'handpick') {

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
          this.Cart_Service.delete_HandPick(id).subscribe((res: any) => {
            if (res.status) {
              Swal.fire({
                text: 'Successfully Deleted',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 500,
              });
              this.getHandPick();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });


    } else if (type === 'OrderMedicineSlider') {

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
          this.Cart_Service.delete_Order_Med_Slider(id).subscribe((res: any) => {
            if (res.status) {
              Swal.fire({
                text: 'Successfully Deleted',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 500,
              });
              this.getOrderMed_Slider();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });

    }

  }


  newdropDown(value: any) {

    console.log(value)
    if (value == '0') {
      this.newdrop_list_array = this.drop1_cat_array
    }
    if (value == '1') {
      this.newdrop_list_array = this.drop1_pdt_array
    }
    this.Order_Medicine_Slider_Form.patchValue({
      type: value,
      typeId: this.newdrop_list_array[0]._id,

    })
    console.log(this.newdrop_list_array[0]._id);

  }


  dropDownChange(value: any) {

    if (value == '0') {

      this.drop_list_array = this.drop1_cat_array

      console.log(this.drop_list_array, "cat");
    }
    if (value == '1') {

      this.drop_list_array = this.drop1_pdt_array

    }

    console.log(this.drop_list_array, "pdt");

    this.OrderReview_1_ContentUpdateForm.patchValue({
      sliderId: this.ItemId,
      type: value,
      typeId: this.drop_list_array[0]._id,

    })



  }

  FilterMainDrop(value) {
    console.log(this.drop1_cat_array);
    if (value.length >= 1) {
      this.drop1_cat_array = this.drop1_cat_array.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.drop1_cat_array = this.drop1_cat_array;
      this.getDropDown1_Cat()
    }

  }

  FilterSubDrop(value) {
    console.log(this.drop2_subcat_array);
    if (value.length >= 1) {
      this.drop2_subcat_array = this.drop2_subcat_array.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.drop2_subcat_array = this.drop2_subcat_array;
    }

  }

  FilterOR1(value) {
    console.log(this.drop_list_array);
    if (value.length >= 1) {
      this.drop_list_array = this.drop_list_array.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.drop_list_array = this.drop_list_array;
    }
  }

  // this.newdrop_list_array = this.drop1_cat_array

  FilterOMS(value) {
    console.log(value);

    if (this.Order_Medicine_Slider_Form.get('type').value == '0') {
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

  }



  dropDownProductChange(value: any) {
    console.log(value)
    this.getDropDown2_CatSub(value)
    console.log(this.drop2_subcat_array);

    this.Hand_Pick_ContentUpdateForm.patchValue({
      // sliderId: this.ItemId,
      type: value,
      typeId: this.drop2_subcat_array[0].typeId,
    })
    console.log(this.drop2_subcat_array[0].typeId);

  }

  changeColorPickerValue(value) {
    console.log(value);
    this.colorValue = value;
  }

  name = "Angular";
  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

}
