import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromoServiceService } from 'src/app/services/promo-service.service';
import Swal from 'sweetalert2';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-create-promo',
  templateUrl: './create-promo.component.html',
  styleUrls: ['./create-promo.component.scss']
})
export class CreatePromoComponent implements OnInit {

  // @Output() @ViewChild('editor') public editor: EditorComponent;

  public viewFlag: any;
  public editFlag: any = false;


  public Promo_Form: FormGroup
  public submitted: boolean = false
  public addLoading: boolean = false
  public medi_flag: boolean = false
  public premiun_flag: boolean = true
  public uploadImage: any;
  public image_URL: any;
  public today = new Date().toISOString().split('T')[0];
  public temp_dt: any
  public promo_id: any
  public TYPE: any
  public viewonly_flag: boolean
  public editable_flag: boolean
  public Text_Editorvalue = ``;
  public CustType: any
  public Type: any
  public PromoType: any

  public Max_Disc: any
  public Pur_Amt: any


  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editPermFlag :boolean;
  public deleteFlag :boolean;
  public viewPermFlag :boolean;
  public addFlag :boolean;

  constructor(public fb: FormBuilder,
    private Promo_Service: PromoServiceService,
    public activated_route: ActivatedRoute,
    private _router: Router,
    private permissionService:PermissionService,
    private location: Location,) { }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }


    if (localStorage.getItem("EditFlag") === '') {
      this.editFlag = false;
    }
    else if (localStorage.getItem("EditFlag") === "true") {
      this.editFlag = false;
    }
    else if (localStorage.getItem("EditFlag") === "false") {
      this.editFlag = true;
    }


    this.Promo_Form = this.fb.group({
      type: ['', Validators.required],
      customerType: [''],
      promotionType: [''],
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      category: [''],
      from: ['', Validators.required],
      to: ['', Validators.required],
      percentage: ['', [Validators.required, Validators.pattern("^[0-9,.]*$"), Validators.max(100), Validators.min(1)]],
      purchaseAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]],
      maximumAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]],
      maximumUser: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]],
      numberPerUser: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]],
      termsAndCondition: ['', Validators.required],
      image: [''],
    })



    this.activated_route.paramMap.subscribe((res: any) => {
      this.TYPE = res.get('type')
      console.log(this.TYPE);
      this.promo_id = res.get('id')
      if (this.TYPE == 'view') {
        this.viewonly_flag = true
        this.editable_flag = false
        this.get_PROMO_CODE_BY_ID(this.promo_id)
        this.Promo_Form.disable()
      } else if (this.TYPE == 'edit') {
        this.editable_flag = true
        this.viewonly_flag = false
        this.get_PROMO_CODE_BY_ID(this.promo_id)
      } else {
        this.editable_flag = false
        this.viewonly_flag = false
      }
    })

    this.submitted = false
    this.addLoading = false

  }


  disableTab(value){
    if(this.user.isAdmin === true){
      let flag = this.permissionService.setPrivilages(value,this.user.isAdmin);
      this.editPermFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewPermFlag = this.permissionService.viewFlag;
      return flag;
    }
    else   if(this.user.isStore === true){
      let flag = this.permissionService.setPrivilages(value,this.user.isStore);
      this.editPermFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
    else{
      let flag = this.permissionService.setPrivilages(value,this.user.isAdmin);
      this.editPermFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewPermFlag = this.permissionService.viewFlag;
      return flag;
    }
  }


  onChange(event: any, width: any, height: any) {
    let setFlag: boolean = false;
    const reader = new FileReader();
    const file = event.target.files[0];


    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      // console.log(e.path[0].naturalHeight);
      // console.log(e.path[0].naturalWidth);
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


  // this.disable_Form()
  get_PROMO_CODE_BY_ID(id) {
    // this.Text_Editorvalue = ''
    this.Promo_Service.get_PROMO_CODE_BY_ID(id).subscribe((res: any) => {
      console.log(res, "get by id res");
      this.Promo_Form.patchValue({
        type: res.data.type,
        customerType: res.data.customerType,
        promotionType: res.data.promotionType,
        name: res.data.name,
        code: res.data.code,
        category: res.data.category,
        from: res.data.from.slice(0, 10),
        to: res.data.to.slice(0, 10),
        percentage: res.data.percentage,
        purchaseAmount: res.data.purchaseAmount,
        maximumAmount: res.data.maximumAmount,
        maximumUser: res.data.maximumUser,
        numberPerUser: res.data.numberPerUser,
        // termsAndCondition: res.data.termsAndCondition.replace(/<[^>]*>/g, ''),
        // termsAndCondition: res.data.termsAndCondition,

        image: res.data.image,
      })
      this.temp_dt = res.data.from.slice(0, 10);
      this.Text_Editorvalue = res.data.termsAndCondition;
      this.Type = res.data.type
      this.CustType = res.data.customerType
      this.PromoType = res.data.promotionType
      this.image_URL = res.data.image

      if (res.data.type == 'Medimall') {
        this.medi_flag = true
        this.premiun_flag = false

      } else if (res.data.type == 'Premium Subscription') {
        this.medi_flag = false
        this.premiun_flag = true

      } else if (res.data.type == 'Subscription') {
        this.medi_flag = false
        this.premiun_flag = false

      }

      console.log(this.Promo_Form.value, "form value");

    })
  }


  Create() {
    console.log("clicked");
    console.log(this.Promo_Form.value);

    this.submitted = true
    if (this.image_URL == '' || this.image_URL == undefined) {
      Swal.fire({
        text: 'Please Add Image!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });
    } else {
      if (this.Promo_Form.valid) {
        console.log("valid form");
        this.addLoading = true
        const formdata = new FormData()

        formdata.append('type', this.Promo_Form.get('type').value)
        formdata.append('customerType', this.Promo_Form.get('customerType').value)
        formdata.append('promotionType', this.Promo_Form.get('promotionType').value)
        formdata.append('name', this.Promo_Form.get('name').value)
        formdata.append('code', this.Promo_Form.get('code').value)
        formdata.append('category', this.Promo_Form.get('category').value)
        formdata.append('from', this.Promo_Form.get('from').value)
        formdata.append('to', this.Promo_Form.get('to').value)
        formdata.append('percentage', this.Promo_Form.get('percentage').value)
        formdata.append('purchaseAmount', this.Promo_Form.get('purchaseAmount').value)
        formdata.append('maximumAmount', this.Promo_Form.get('maximumAmount').value)
        formdata.append('maximumUser', this.Promo_Form.get('maximumUser').value)
        formdata.append('numberPerUser', this.Promo_Form.get('numberPerUser').value)
        formdata.append('termsAndCondition', this.Promo_Form.get('termsAndCondition').value)

        formdata.append('image', this.uploadImage)

        this.Promo_Service.add_PROMO_CODE(formdata).subscribe((res: any) => {
          this.pop(res)
        }, (err: any) => {
          console.log(err);
        })
      }
    }
  }


  Update() {
    console.log(this.Promo_Form.value, "form val");

    this.submitted = true
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
      if (this.Promo_Form.valid) {

        this.addLoading = true
        const formdata = new FormData()

        if (this.uploadImage == undefined) {

          formdata.append('type', this.Promo_Form.get('type').value)
          formdata.append('customerType', this.Promo_Form.get('customerType').value)
          formdata.append('promotionType', this.Promo_Form.get('promotionType').value)
          formdata.append('name', this.Promo_Form.get('name').value)
          formdata.append('code', this.Promo_Form.get('code').value)
          formdata.append('category', this.Promo_Form.get('category').value)
          formdata.append('from', this.Promo_Form.get('from').value)
          formdata.append('to', this.Promo_Form.get('to').value)
          formdata.append('percentage', this.Promo_Form.get('percentage').value)
          formdata.append('purchaseAmount', this.Promo_Form.get('purchaseAmount').value)
          formdata.append('maximumAmount', this.Promo_Form.get('maximumAmount').value)
          formdata.append('maximumUser', this.Promo_Form.get('maximumUser').value)
          formdata.append('numberPerUser', this.Promo_Form.get('numberPerUser').value)
          formdata.append('termsAndCondition', this.Promo_Form.get('termsAndCondition').value)

        } else {

          formdata.append('type', this.Promo_Form.get('type').value)
          formdata.append('customerType', this.Promo_Form.get('customerType').value)
          formdata.append('promotionType', this.Promo_Form.get('promotionType').value)
          formdata.append('name', this.Promo_Form.get('name').value)
          formdata.append('code', this.Promo_Form.get('code').value)
          formdata.append('category', this.Promo_Form.get('category').value)
          formdata.append('from', this.Promo_Form.get('from').value)
          formdata.append('to', this.Promo_Form.get('to').value)
          formdata.append('percentage', this.Promo_Form.get('percentage').value)
          formdata.append('purchaseAmount', this.Promo_Form.get('purchaseAmount').value)
          formdata.append('maximumAmount', this.Promo_Form.get('maximumAmount').value)
          formdata.append('maximumUser', this.Promo_Form.get('maximumUser').value)
          formdata.append('numberPerUser', this.Promo_Form.get('numberPerUser').value)
          formdata.append('termsAndCondition', this.Promo_Form.get('termsAndCondition').value)
          formdata.append('image', this.uploadImage)
        }
        this.Promo_Service.edit_PROMO_CODE(this.promo_id, formdata).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
          if (res.status == true) {
            this._router.navigate(['/promo/promo-list'])
          }
        })
      }
    }
  }





  type(type) {
    this.Type = type
    this.CustType = null
    this.PromoType = null
    if (type == 'Medimall') {
      // this.Type == type
      this.medi_flag = true
      this.premiun_flag = false

      this.Promo_Form.controls['customerType'].setValidators([Validators.required]);
      this.Promo_Form.controls['customerType'].updateValueAndValidity();

      this.Promo_Form.controls['promotionType'].setValidators([Validators.required]);
      this.Promo_Form.controls['promotionType'].updateValueAndValidity();

      this.Promo_Form.controls['category'].setValidators([Validators.required]);
      this.Promo_Form.controls['category'].updateValueAndValidity();

    } else if (type == 'Premium Subscription') {
      this.medi_flag = false
      this.premiun_flag = true

      this.Promo_Form.get('customerType').clearValidators()
      this.Promo_Form.get('customerType').updateValueAndValidity()

      this.Promo_Form.controls['promotionType'].clearValidators()
      this.Promo_Form.controls['promotionType'].updateValueAndValidity()

      // this.Promo_Form.patchValue({
      //   customerType: '-----',
      //   promotionType: '-----'
      // })


    }
    else if (type == 'Subscription') {
      this.medi_flag = false
      this.premiun_flag = false

      this.Promo_Form.controls['customerType'].setValidators([Validators.required]);
      this.Promo_Form.controls['customerType'].updateValueAndValidity();

      this.Promo_Form.controls['promotionType'].clearValidators()
      this.Promo_Form.controls['promotionType'].updateValueAndValidity()

      // this.Promo_Form.patchValue({
      //   customerType: '-----',
      //   promotionType: '-----'
      // })

    }

    this.Promo_Form.patchValue({
      type: type,
      customerType: null,
      promotionType: null
    })
  }

  cust_type(cust) {
    this.CustType = cust
    this.PromoType = null
    // this.Promo_Form.patchValue({
    //   customerType: ''
    // })
    this.Promo_Form.patchValue({
      customerType: cust,
      promotionType: null
    })

  }

  promo_type(promo) {
    this.PromoType = promo

    // this.Promo_Form.patchValue({
    //   promotionType: ''
    // })
    this.Promo_Form.patchValue({
      promotionType: promo
    })
  }

  Date_Change() {
    // this.temp_dt = this.Promo_Form.get('from').value
    // this.temp_dt = date.target.value
    this.Date_Change_To()
    this.Promo_Form.patchValue({
      to: ''
    })
  }

  Date_Change_To() {
    console.log("date check");

    console.log(this.Promo_Form.get('from').value);

    this.temp_dt = this.Promo_Form.get('from').value
    console.log(this.temp_dt);

  }


  Min_Use() {
    this.Max_Disc = null
    this.Max_Disc = this.Promo_Form.get('maximumUser').value
    this.Promo_Form.controls['numberPerUser'].setValidators([Validators.max(this.Max_Disc),Validators.pattern("^[0-9]*$")]);
    this.Promo_Form.controls['numberPerUser'].updateValueAndValidity()
  }

  Date_Click(event){
console.log(event);

  }


  disable_Form() {
    this.Promo_Form.get('type').disable()
    this.Promo_Form.get('customerType').disable()

    this.Promo_Form.get('promotionType').disable()

    this.Promo_Form.get('name').disable()

    this.Promo_Form.get('code').disable()

    this.Promo_Form.get('category').disable()

    this.Promo_Form.get('from').disable()

    this.Promo_Form.get('to').disable()


    this.Promo_Form.get('percentage').disable()


    this.Promo_Form.get('purchaseAmount').disable()

    this.Promo_Form.get('maximumAmount').disable()

    this.Promo_Form.get('maximumUser').disable()
    this.Promo_Form.get('numberPerUser').disable()
    this.Promo_Form.get('termsAndCondition').disable()
    this.Promo_Form.get('image').disable()


  }



  pop(res: any) {
    // this.attemptedSubmit = false
    if (res.status === true) {
      Swal.fire({
        text: res.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
      this.Promo_Form.reset()
      this.image_URL = undefined
      this.uploadImage = undefined
      this.medi_flag = false
      this.premiun_flag = true
      this.CustType = null
      this.Type = null
      this.PromoType = null
      // this.get_ALL_STORE()
      // this.get_STORE_DROPDOWN()
      // this.modalService.dismissAll();
      // this.skip = 0;
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
    this.addLoading = false;
    this.submitted = false;
  }


}
