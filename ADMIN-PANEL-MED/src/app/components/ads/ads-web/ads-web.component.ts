import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AdsWebServiceService } from 'src/app/services/ads-web-service.service';
import Swal from 'sweetalert2';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ads-web',
  templateUrl: './ads-web.component.html',
  styleUrls: ['./ads-web.component.scss']
})
export class AdsWebComponent implements OnInit {


  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;
  public addFlag :boolean;


  public closeResult: string;
  public slider1Form: FormGroup;
  public addLoading: boolean;
  public attemptedSubmit: boolean;
  public add_Modal_Flag: boolean;
  public pdt_flag: boolean;


  public image_URL: any;
  public uploadImage: any;
  public WED_HOME: any = []
  public WED_Banner: any = []
  public CAT_SUB_DRP: any = []
  public PDT_SUB_DRP: any = []
  public value_array: any = []
  public ID: any


  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private Web_Service: AdsWebServiceService,
    private permissionService:PermissionService,
    private location: Location,) { }

  ngOnInit(): void {


    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }


    this.slider1Form = this.formBuilder.group({
      redirection_type: ['', Validators.required],
      redirection_id: ['', Validators.required],
      image: [''],
    });
    this.pdt_flag = false;
    this.addLoading = false;
    this.attemptedSubmit = false;
    this.get_all_web_home()
    this.get_second_drop()
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


  get_all_web_home() {
    this.Web_Service.get_ALL_HOME_SLIDERS().subscribe((res: any) => {
      this.WED_HOME = []
      this.WED_HOME = res.data.sliders
    })
  }

  get_all_pdt_banners() {
    this.Web_Service.get_ALL_PDT_BANNER().subscribe((res: any) => {
      console.log(res);
      this.WED_Banner = []
      this.WED_Banner = res.data.banners
    })
  }

  get_second_drop() {
    this.Web_Service.get_CAT_SUB_DRP().subscribe((res: any) => {
      console.log(res, "cat");
      this.CAT_SUB_DRP = res.data
    })

    this.Web_Service.get_PDT_SUB_DRP().subscribe((res: any) => {
      console.log(res, "pdt");
      this.PDT_SUB_DRP = res.data
    })
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




  dropDownChange(value: any) {
    this.value_array = []
    this.slider1Form.patchValue({
      redirection_id: null
    })
    this.Dropdown_Value(value)
  }

  Dropdown_Value(value) {
    this.value_array = []
    if (value === 'product') {
      this.value_array = this.PDT_SUB_DRP;
    } else if (value === 'category') {
      this.value_array = this.CAT_SUB_DRP;
    }
  }


  tabChangeEvent(event) {
    if (event.nextId == 'pdt_bnr') {
      this.get_all_pdt_banners()
    } else if (event.nextId == 'home') {
      this.get_all_web_home()
    }
  }


  delete(id) {
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
        this.Web_Service.delete_HOME_SLIDERS(id).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }


  save() {
    this.attemptedSubmit = true
    if (this.uploadImage == '' || this.uploadImage == undefined) {
      Swal.fire({
        text: 'Please Add Image!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });
    } else {
      if (this.slider1Form.valid) {
        const formdata = new FormData()
        this.addLoading = true
        formdata.append('redirection_type', this.slider1Form.get('redirection_type').value)
        formdata.append('redirection_id', this.slider1Form.get('redirection_id').value)
        formdata.append('image', this.uploadImage)

        this.Web_Service.add_HOME_SLIDERS(formdata).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        })
      }
    }

  }

  close() {
    this.modalService.dismissAll();
    this.pdt_flag = false;
    this.addLoading = false;
    // this.addLoading = true;
    this.attemptedSubmit = false;
    this.slider1Form.reset();
    // this.slider2Form.reset();
    // this.slider3Form.reset();
    // this.yogaSliderForm.reset();
    // this.yogaBannerForm.reset();
    // this.fitnessSliderForm.reset();
    // this.fitnessBannerForm.reset();
  }


  Update(type: any) {
    this.attemptedSubmit = true
    console.log(this.image_URL);
    console.log(this.uploadImage);

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

      if (this.slider1Form.valid) {


        const formdata = new FormData()
        this.addLoading = true;

        if (this.uploadImage == undefined) {
          formdata.append('redirection_type', this.slider1Form.get('redirection_type').value)
          formdata.append('redirection_id', this.slider1Form.get('redirection_id').value)
          formdata.append('image', null)
        } else {
          formdata.append('redirection_type', this.slider1Form.get('redirection_type').value)
          formdata.append('redirection_id', this.slider1Form.get('redirection_id').value)
          formdata.append('image', this.uploadImage)
        }

        if (type == 'home') {
          this.Web_Service.edit_HOME_SLIDERS(this.ID, formdata).subscribe((res: any) => {
            console.log(res);
            this.pop(res)
          })
        } else if (type == 'pdt') {
          this.Web_Service.edit_PDT_BANNER(this.ID, formdata).subscribe((res: any) => {
            console.log(res);
            this.pop(res)
          })
        }
      }
    }
    // const formdata = new FormData()

    // formdata.append('redirection_type', this.slider1Form.get('redirection_type').value)
    // formdata.append('redirection_id', this.slider1Form.get('redirection_id').value)
    // formdata.append('image', this.uploadImage)


    // this.Web_Service.add_HOME_SLIDERS(formdata).subscribe((res: any) => {
    //   console.log(res);
    //   this.pop(res)
    // })

  }




  handleFilterFitnessSliderCategory(value) {
    let type = this.slider1Form.get('redirection_type').value
    if (value.length >= 1) {
      this.value_array = this.value_array.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
    else if (value.length >= 3) {
      this.value_array = this.value_array.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
    else if (value === '') {
      this.Dropdown_Value(type);
    }
    else {
      this.Dropdown_Value(type);
    }

  }









  open(content, Value: any, item: any, type: any) {
    this.image_URL = ''
    this.ID = null
    console.log(item);
    console.log(Value);
    console.log(type);

    if (type == 'pdt') {
      this.pdt_flag = true
    } else {
      this.pdt_flag = false
    }



    if (Value === 'add') {
      this.slider1Form.reset()

      this.slider1Form.patchValue({
        redirection_type: '',
        redirection_id: ''
      })

      // this.value_array = []
      this.add_Modal_Flag = true;
      // this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else if (Value === 'edit') {
      this.ID = item._id
      this.image_URL = item.image
      console.log(this.image_URL, "url image");

      this.dropDownChange(item.redirection_type)
      // this._type = type;
      // this.update_Modal_Flag = true;

      this.slider1Form.patchValue({
        redirection_type: item.redirection_type,
        redirection_id: item.redirection_id,
        image: item.image,
        // linkValue: item.redirection_type,
      })



      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });

      if (item.image) {
        this.image_URL = item.image
      }

    }

    else if (Value === '') {
      // this.update_Modal_Flag = false;
      // this.add_Modal_Flag = false;
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


  pop(res: any) {
    console.log(res, "in pop");
    if (res.error == false) {
      Swal.fire({
        text: res.message,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
      this.get_all_web_home()
      this.get_all_pdt_banners()
      this.modalService.dismissAll();
      this.pdt_flag = false
      this.attemptedSubmit = false
    } else {
      Swal.fire({
        text: res.message,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
    }
    this.addLoading = false;
    // this.InventoryListService.get_LIST_INVENTORY_PRODUCTS(this.List_Type).subscribe((res: any) => {
    //   console.log(res, "getting list res", this.List_Type);
    //   this.LIST_ARRAY = res.data;
    // })
  }


}
