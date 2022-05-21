import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { MasterSettingsBrandService } from 'src/app/services/master-settings-brand.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  public vendors = [
    {
      no: "1",
      brandname: "1 Minute Best",
      brandimage: "assets/images/electronics/product/facewash.png",
      brandbanner: "assets/images/electronics/product/facewash.png",
    },
    {
      no: "2",
      brandname: "24 Mantra Organic",
      brandimage: "assets/images/electronics/product/facewash.png",
      brandbanner: "assets/images/electronics/product/facewash.png",
    },
    {
      no: "3",
      brandname: "3 Roses",
      brandimage: "assets/images/electronics/product/facewash.png",
      brandbanner: "assets/images/electronics/product/facewash.png",
    },
    {
      no: "4",
      brandname: "5 Star",
      brandimage: "assets/images/electronics/product/facewash.png",
      brandbanner: "assets/images/electronics/product/facewash.png",
    },
    {
      no: "5",
      brandname: "7 Up",
      brandimage: "assets/images/electronics/product/facewash.png",
      brandbanner: "assets/images/electronics/product/facewash.png",
    },


  ];


  public settings = {
    mode: 'external',
    actions: {
      columnTitle: '',
      add: false,
      edit: "<button type='button' class='btn btn-dark btn-dark-rounded' data-toggle='modal' data-original-title='test' data-target='#exampleModal' (click)='open(content)' >EDIT</button>",
      position: 'right'
    },
    columns: {
      no: {
        title: 'No',
        filter: true
      },
      brandname: {
        title: 'Brand Name',
        filter: true
      },
      brandimage: {
        title: 'Brand Image',
        type: 'html',
        editor: {
          type: 'file'
        },
        filter: false
      },
      brandbanner: {
        title: 'Banner Image',
        type: 'html',
        filter: false
      },
    },
  };


  public closeResult: string;
  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public addFlag: boolean;
  public checkboxflag: boolean;


  public LIST_ALL_BRANDS: any = []
  public BRAND1: any = []
  public BRAND2: any = []
  public BRAND3: any = []
  public BRAND4: any = []

  public Brand_Form: FormGroup
  public Image_src = ''
  public banner_src = ''
  // public ID: any
  public addLoading: boolean = false;
  public attemptedSubmit: boolean = false;
  public uploadImage: any;
  public uploadBanner: any;

  public gridView: GridDataResult;
  public skip = 0;


  constructor(private _router: Router,
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private location: Location,
    public BRAND_SERVICE: MasterSettingsBrandService,
    public fb: FormBuilder) {
  }

  ngOnInit(): void {
    console.log(this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }

    this.get_ALL_BRANDS()


    this.Brand_Form = this.fb.group({
      title: ['', Validators.required],
      banner: [''],
      image: [''],
      isShop: [false],
      isTrending: [false],
      isFeatured: [false],
      isPromoted: [false],
      brandId: [null]
    })
  }

  get_ALL_BRANDS() {
    this.BRAND_SERVICE.get_ALL_BRANDS().subscribe((res: any) => {
      console.log(res, "brand res");
      this.LIST_ALL_BRANDS = []
      res.data.forEach((itm, index) => {
        let JSN = {
          "no": index + 1,
          "title": itm.title,
          "image": itm.image,
          "baner": itm.baner,
          "isFeatured": itm.isFeatured,
          "isPromoted": itm.isPromoted,
          "isShop": itm.isShop,
          "isTrending": itm.isTrending,
          "_id": itm._id,
        }
        this.LIST_ALL_BRANDS.push(JSN);
      })
      console.log(this.LIST_ALL_BRANDS, "all brand list");

    })
  }

  Brands(type: any) {
    console.log(type.nextId, "id click");
    if (type.nextId == 'all') {
      this.LIST_ALL_BRANDS = []
      this.skip = 0
      this.get_ALL_BRANDS()
    } else if (type.nextId == 'shop') {
      this.BRAND_SERVICE.get_BRANDS_BY_TYPE(type.nextId).subscribe((res: any) => {
        console.log(res);
        this.BRAND2 = []
        this.skip = 0
        res.data.forEach((itm, index) => {
          let JSN = {
            "no": index + 1,
            "title": itm.title,
            "image": itm.image,
            "baner": itm.baner,
            "isFeatured": itm.isFeatured,
            "isPromoted": itm.isPromoted,
            "isShop": itm.isShop,
            "isTrending": itm.isTrending,
            "_id": itm._id,
          }
          this.BRAND2.push(JSN);
        })

      })
    } else if (type.nextId == 'trending') {
      this.BRAND_SERVICE.get_BRANDS_BY_TYPE(type.nextId).subscribe((res: any) => {
        console.log(res);
        this.BRAND3 = []
        this.skip = 0
        res.data.forEach((itm, index) => {
          let JSN = {
            "no": index + 1,
            "title": itm.title,
            "image": itm.image,
            "baner": itm.baner,
            "isFeatured": itm.isFeatured,
            "isPromoted": itm.isPromoted,
            "isShop": itm.isShop,
            "isTrending": itm.isTrending,
            "_id": itm._id,
          }
          this.BRAND3.push(JSN);
        })

      })
    } else if (type.nextId == 'promoted') {
      this.BRAND_SERVICE.get_BRANDS_BY_TYPE(type.nextId).subscribe((res: any) => {
        console.log(res);
        this.BRAND1 = []
        this.skip = 0
        res.data.forEach((itm, index) => {
          let JSN = {
            "no": index + 1,
            "title": itm.title,
            "image": itm.image,
            "baner": itm.baner,
            "isFeatured": itm.isFeatured,
            "isPromoted": itm.isPromoted,
            "isShop": itm.isShop,
            "isTrending": itm.isTrending,
            "_id": itm._id,
          }
          this.BRAND1.push(JSN);
        })

      })
    } else if (type.nextId == 'featured') {
      this.BRAND_SERVICE.get_BRANDS_BY_TYPE(type.nextId).subscribe((res: any) => {
        console.log(res);
        this.BRAND4 = []
        this.skip = 0
        res.data.forEach((itm, index) => {
          let JSN = {
            "no": index + 1,
            "title": itm.title,
            "image": itm.image,
            "baner": itm.baner,
            "isFeatured": itm.isFeatured,
            "isPromoted": itm.isPromoted,
            "isShop": itm.isShop,
            "isTrending": itm.isTrending,
            "_id": itm._id,
          }
          this.BRAND4.push(JSN);
        })

      })
    }
  }


  Save() {
    this.attemptedSubmit = true
    if (this.Image_src === '') {
      Swal.fire({
        text: 'Please Add Image!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });

    } else if (this.banner_src === '') {
      Swal.fire({
        text: 'Please Add Banner!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });

    } else {
      if (this.Brand_Form.valid) {
        const formData = new FormData();
        this.checkboxflag = false
        this.addLoading = true;
        formData.append('title', this.Brand_Form.get('title').value)
        formData.append('image', this.uploadImage)
        formData.append('banner', this.uploadBanner)
        formData.append('isShop', this.Brand_Form.get('isShop').value)
        formData.append('isTrending', this.Brand_Form.get('isTrending').value)
        formData.append('isFeatured', this.Brand_Form.get('isFeatured').value)
        formData.append('isPromoted', this.Brand_Form.get('isPromoted').value)
        this.BRAND_SERVICE.add_BRAND(formData).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        })
      } else {
        this.checkboxflag = true
      }
    }
  }


  Update() {
    this.attemptedSubmit = true
    if (this.Image_src === '') {
      Swal.fire({
        text: 'Please Add Image!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });

    } else if (this.banner_src === '') {
      Swal.fire({
        text: 'Please Add Banner!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });

    } else {
      if (this.Brand_Form.valid) {
        const formData = new FormData();
        this.addLoading = true;
        this.checkboxflag = false
        if (this.uploadBanner == undefined && this.uploadImage == undefined) {
          formData.append('title', this.Brand_Form.get('title').value)
          formData.append('isShop', this.Brand_Form.get('isShop').value)
          formData.append('isTrending', this.Brand_Form.get('isTrending').value)
          formData.append('isFeatured', this.Brand_Form.get('isFeatured').value)
          formData.append('isPromoted', this.Brand_Form.get('isPromoted').value)
          formData.append('brandId', this.Brand_Form.get('brandId').value)
        } else if (this.uploadImage == undefined) {
          formData.append('title', this.Brand_Form.get('title').value)
          formData.append('banner', this.uploadBanner)
          formData.append('isShop', this.Brand_Form.get('isShop').value)
          formData.append('isTrending', this.Brand_Form.get('isTrending').value)
          formData.append('isFeatured', this.Brand_Form.get('isFeatured').value)
          formData.append('isPromoted', this.Brand_Form.get('isPromoted').value)
          formData.append('brandId', this.Brand_Form.get('brandId').value)
        } else if (this.uploadBanner == undefined) {
          formData.append('title', this.Brand_Form.get('title').value)
          formData.append('image', this.uploadImage)
          formData.append('isShop', this.Brand_Form.get('isShop').value,)
          formData.append('isTrending', this.Brand_Form.get('isTrending').value)
          formData.append('isFeatured', this.Brand_Form.get('isFeatured').value)
          formData.append('isPromoted', this.Brand_Form.get('isPromoted').value)
          formData.append('brandId', this.Brand_Form.get('brandId').value)
        } else {
          formData.append('title', this.Brand_Form.get('title').value)
          formData.append('image', this.uploadImage)
          formData.append('banner', this.uploadBanner)
          formData.append('isShop', this.Brand_Form.get('isShop').value)
          formData.append('isTrending', this.Brand_Form.get('isTrending').value)
          formData.append('isFeatured', this.Brand_Form.get('isFeatured').value)
          formData.append('isPromoted', this.Brand_Form.get('isPromoted').value)
          formData.append('brandId', this.Brand_Form.get('brandId').value)
        }

        this.BRAND_SERVICE.edit_BRAND(formData).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        })


      } else {
        this.checkboxflag = true
      }
    }
  }

  Delete(id: any) {

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
        this.BRAND_SERVICE.delete_BRAND(id).subscribe((res: any) => {
          console.log(res, "del res");
          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


  }



  disableTab(value) {
    let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
    this.addFlag = this.permissionService.addFlag;
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
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

  editRow(event, content, Value) {
    //console.log('event: ', event)
    if (Value === 'edit') {
      this.add_Modal_Flag = false;
      this.update_Modal_Flag = true;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }); this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }



  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;

  open(content, Value: any, item: any) {
    this.attemptedSubmit = false

    // this.ID = ''
    this.Image_src = ''
    this.banner_src = ''
    this.checkboxflag = false

    // console.log(item, "test item");


    if (Value === 'add') {
      this.Brand_Form.reset()
      this.Brand_Form.patchValue({
        isShop: false,
        isTrending: false,
        isFeatured: false,
        isPromoted: false,
      })

      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value === 'edit') {
      // this.ID = item._id
      this.banner_src = item.baner
      this.Image_src = item.image

      this.Brand_Form.patchValue({
        title: item.title,
        // banner: item.banner,
        // image: item.image,
        isShop: item.isShop,
        isTrending: item.isTrending,
        isFeatured: item.isFeatured,
        isPromoted: item.isPromoted,
        brandId: item._id
      })


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
        this.Image_src = content;

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

  onChangeBanner(event: any, width: any, height: any) {
    let setFlag: boolean = false;

    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);

    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      if (e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width)) {
        setFlag = true;
        this.uploadBanner = file;
        let content = reader.result as string;
        this.banner_src = content;

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


  pop(res: any) {

    console.log(res.data, "res data");
    console.log(res.status, "res status");
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
      this.skip = 0;
      this.LIST_ALL_BRANDS = []
      this.BRAND1 = []
      this.BRAND2 = []
      this.BRAND3 = []
      this.BRAND4 = []
      this.get_ALL_BRANDS()
      this.Brands({ activeId: 'all', nextId: 'promoted' })
      this.Brands({ activeId: 'all', nextId: 'shop' })
      this.Brands({ activeId: 'all', nextId: 'trending' })
      this.Brands({ activeId: 'all', nextId: 'featured' })
      this.uploadImage = undefined;
      this.uploadBanner = undefined;
      this.modalService.dismissAll();

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
    this.attemptedSubmit = false;
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    //  this.get_ALL_BRANDS()
    // this.Brands({ activeId: 'all', nextId: 'promoted' })
    // this.Brands({ activeId: 'all', nextId: 'shop' })
    // this.Brands({ activeId: 'all', nextId: 'trending' })
    // this.Brands({ activeId: 'all', nextId: 'featured' })
  }



}
