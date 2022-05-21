import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { vendorsDB } from '../../../shared/tables/vendor-list';
import { Router, ActivatedRoute } from '@angular/router';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { InventoryListingService } from 'src/app/services/inventory-listing.service';
// import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {


  public listCategory: Array<string> = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  public temp = [];


  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;



  // public vendors = [
  //   {
  //     image: "assets/images/electronics/product/medical-mask.png",
  //     MedimallID: "36758",
  //     SKNNO: "254",
  //     Name: "Haire Oil",
  //     Categories: "baby Care",
  //     Brand: "Pathanjali",
  //     Price: "124",
  //     Quantity: "432",
  //     Status: "<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches1' checked><label class='custom-control-label' for='customSwitches1'></label></div> "
  //   },
  //   {
  //     image: "assets/images/electronics/product/facewash.png",
  //     MedimallID: "36758",
  //     SKNNO: "254",
  //     Name: "Haire Oil",
  //     Categories: "baby Care",
  //     Brand: "Pathanjali",
  //     Price: " 124",
  //     Quantity: "432",
  //     Status: "<div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches2' checked='true'><label class='custom-control-label' for='customSwitches2'></label></div> "
  //   },
  //   {
  //     image: "assets/images/electronics/product/medical-mask.png",
  //     MedimallID: "36758",
  //     SKNNO: "254",
  //     Name: "Haire Oil",
  //     Categories: "baby Care",
  //     Brand: "Pathanjali",
  //     Price: "124",
  //     Quantity: "432",
  //     Status: "<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches3' checked='true'><label class='custom-control-label' for='customSwitches3'></label></div> "
  //   },
  //   {
  //     image: "assets/images/electronics/product/facewash.png",
  //     MedimallID: "36758",
  //     SKNNO: "254",
  //     Name: "Haire Oil",
  //     Categories: "baby Care",
  //     Brand: "Pathanjali",
  //     Price: "124",
  //     Quantity: "432",
  //     Status: "<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches4' checked='true'><label class='custom-control-label' for='customSwitches4'></label></div> "
  //   },
  //   {
  //     image: "assets/images/electronics/product/medical-mask.png",
  //     MedimallID: "36758",
  //     SKNNO: "254",
  //     Name: "Haire Oil",
  //     Categories: "baby Care",
  //     Brand: "Pathanjali",
  //     Price: "124",
  //     Quantity: "432",
  //     Status: "<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches5' checked='true'><label class='custom-control-label' for='customSwitches5'></label></div> "
  //   },

  // ];


  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public addFlag: boolean;


  public DropDown: FormGroup
  public List_Type: any
  public LIST_ARRAY: any = []
  public CAT_DROP_ARRAY: any = []


  // public total: any
  public pageSize: any
  // public skip: any

  constructor(private _router: Router,
    private permissionService: PermissionService,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private InventoryListService: InventoryListingService,
    private fb: FormBuilder) {
    // this.vendors = vendorsDB.data;
  }


  public CurrentPage: any
  public PageSize: any
  public TotalRecords: any
  public hasNextPage: boolean
  public hasPrevPage: boolean
  public pagingCounter: 1
  public totalPages: any

  public searchFlag: boolean;
  public SearchPage: any
  public Searchval: any

  // products: (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]









  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }
    this.searchFlag = false

    this.activatedRoute.paramMap.subscribe(params => {
      this.List_Type = params.get('type');

      let page = 1
      this.get_LIST_INVENTORY_PRODUCTS(page)

      // this.InventoryListService.get_LIST_INVENTORY_PRODUCTS(this.List_Type).subscribe((res: any) => {
      //   this.LIST_ARRAY = []
      //   console.log(res, "getting list res", this.List_Type);
      //   this.LIST_ARRAY = res.data;

      //   let mappedData = res.data.map(itm => {
      //     return {
      //       _id: itm._id,
      //       productId: itm.productId,
      //       categories: itm.categories.map(cat => { return cat }).toString(),
      //       isDisabled: itm.isDisabled,
      //       name: itm.name,
      //       brand: itm.brand,
      //       image: itm.image,
      //     }
      //   });
      //   this.LIST_ARRAY = mappedData
      // })


      this.InventoryListService.get_INVENTORY_CATEGORY_LISTING(this.List_Type).subscribe((res: any) => {
        console.log(res, "getting catlist res", this.List_Type);
        this.CAT_DROP_ARRAY = res.data.categories;
        // console.log(this.CAT_DROP_ARRAY, "catlist _ARRAY");
        let cat = {
          title: "All",
          _id: "all"
        }
        this.CAT_DROP_ARRAY.push(cat)
        this.CAT_DROP_ARRAY = this.CAT_DROP_ARRAY.reverse()
        console.log(this.CAT_DROP_ARRAY, "catlist _ARRAY");
      })

      this.DropDown = this.fb.group({
        drop: [null]
      })

      this.DropDown.patchValue({
        drop: 'all'
      })


    });
  }


  get_LIST_INVENTORY_PRODUCTS(pg) {

    this.searchFlag = false

    let body = {
      type: this.List_Type,
      page: pg
    }

    this.InventoryListService.get_LIST_INVENTORY_PRODUCTS(body).subscribe((res: any) => {
      this.LIST_ARRAY = []
      console.log(res, "getting list res", this.List_Type);
      this.pageSize = res.data.PageSize.toString()
      this.totalPages = res.data.totalPages
      this.CurrentPage = res.data.CurrentPage
      this.hasNextPage = res.data.hasNextPage
      this.hasPrevPage = res.data.hasPrevPage

      // this.skip = res.data.CurrentPage
      this.LIST_ARRAY = res.data.products;
      console.log(this.LIST_ARRAY, "LIST_ARRAY");

      // let mappedData = res.data.map(itm => {
      //   return {
      //     _id: itm._id,
      //     productId: itm.productId,
      //     categories: itm.categories.map(cat => { return cat }).toString(),
      //     isDisabled: itm.isDisabled,
      //     name: itm.name,
      //     brand: itm.brand,
      //     image: itm.image,
      //   }
      // });
      // this.LIST_ARRAY = mappedData
    })

  }





  onChangeList(event: any) {
    console.log(event._id, "cat id");

    let body = {
      type: this.List_Type,
      category: event._id,
    }
    console.log(body, "body", this.List_Type, "type");

    if (event._id == 'all') {

      this.get_LIST_INVENTORY_PRODUCTS(1)

    } else {
      this.InventoryListService.get_LIST_INVENTORY_PRODUCTS_BY_CAT(body).subscribe((res: any) => {
        this.LIST_ARRAY = []
        console.log(res, "res after cat id pass");
        this.LIST_ARRAY = res.data;

        let mappedData = res.data.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            categories: itm.categories.map(cat => { return cat }).toString(),
            isDisabled: itm.isDisabled,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
          }
        });
        this.LIST_ARRAY = mappedData
      })
    }



  }

  searchInventory(val: any) {
    // this.dataLoading = true;
    if (val != '') {
      this.searchFlag = true
      this.Searchval = ''
      this.Searchval = val
      this.SearchPage = 1

      let input = {
        "type": this.List_Type,
        "page": this.SearchPage,
        "limit": 10,
        "keyword": this.Searchval
      }

      this.search(input)

    } else if (val == '') {
      this.searchFlag = false

    }
  }

  search(val: any) {
    this.InventoryListService.search_INVENTORY_LIST(val).subscribe((res: any) => {
      console.log(res);

      if (res.status == true) {
        // this.LIST_ARRAY = res.data;
        // this.dataLoading = false;

        this.LIST_ARRAY = []
        this.LIST_ARRAY = res.data.result;

        let mappedData = res.data.result.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            categories: itm.categories.map(cat => { return cat }).toString(),
            isDisabled: itm.isDisabled,
            name: itm.name,
            brand: itm.brand.title,
            image: itm.image,
          }
        });
        this.LIST_ARRAY = mappedData

      }
      else {
        this.LIST_ARRAY = []
        this.get_LIST_INVENTORY_PRODUCTS(1)
        this.searchFlag = false
        // this.get_yoga_vid()
        // // this.dataLoading = false;
      }
    })
  }


  Deactivate_INVENTORY_PRODUCTS(event: any, id: any) {
    let status = {
      status: event.target.checked ? false : true
    }
    this.InventoryListService.act_dct_INVENTORY_PRODUCTS(id, status).subscribe((res: any) => {
      console.log(res, "act/dct");
      this.pop(res)
    })
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

  // public settings = {
  //   actions: {
  //     add: false,
  //     edit: false,
  //     delete: false,
  //     position: 'right'
  //   },
  //   columns: {
  //     image: {
  //       type: 'html',
  //       filter: false
  //     },
  //     MedimallID: {
  //       title: 'Medimall ID',
  //       type: 'html',
  //     },
  //     SKNNO: {
  //       title: 'SKN NO'
  //     },
  //     Name: {
  //       title: 'Name'
  //     },
  //     Categories: {
  //       title: 'Categories'
  //     },
  //     Brand: {
  //       title: 'Brand',
  //     },
  //     Price: {
  //       title: 'Price',
  //       type: 'html',
  //     },
  //     Quantity: {
  //       title: 'Quantity',
  //     },
  //     Status: {
  //       title: 'Action',
  //       type: 'html',
  //       filter: false
  //     }
  //   },
  // };

  addnewProduct() {
    if (this.List_Type == 'medicine') {
      this._router.navigate(['/inventory/add-inventory/medicine'])
    } else if (this.List_Type == 'healthcare') {
      this._router.navigate(['/inventory/add-inventory/healthcare'])
    }
  }

  Edit(id) {
    console.log(id, this.List_Type);

    if (this.List_Type == 'medicine') {
      this._router.navigate(['/inventory/edit-inventory/medicine/' + id])
    } else if (this.List_Type == 'healthcare') {
      this._router.navigate(['/inventory/edit-inventory/healthcare/' + id])
    }
  }

  onPageChange(data) {
    console.log(data);
    this.get_LIST_INVENTORY_PRODUCTS(data)

    // if (this.searchFlag = false) {
    //   this.get_LIST_INVENTORY_PRODUCTS(data)
    // } else if (this.searchFlag = true) {
    //   let input = {
    //     "type": this.List_Type,
    //     "page": data,
    //     "limit": 10,
    //     "keyword": this.Searchval
    //   }
    //   this.search(input)
    // }
  }




  FilterDrop(value) {
    console.log(this.CAT_DROP_ARRAY);
    if (value.length >= 1) {
      this.CAT_DROP_ARRAY = this.CAT_DROP_ARRAY.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.InventoryListService.get_INVENTORY_CATEGORY_LISTING(this.List_Type).subscribe((res: any) => {
        console.log(res, "getting catlist res", this.List_Type);
        this.CAT_DROP_ARRAY = res.data.categories;
        // console.log(this.CAT_DROP_ARRAY, "catlist _ARRAY");
        let cat = {
          title: "All",
          _id: "all"
        }
        this.CAT_DROP_ARRAY.push(cat)
        this.CAT_DROP_ARRAY = this.CAT_DROP_ARRAY.reverse()
        console.log(this.CAT_DROP_ARRAY, "catlist _ARRAY");
      })
    }

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
    this.InventoryListService.get_LIST_INVENTORY_PRODUCTS(this.List_Type).subscribe((res: any) => {
      console.log(res, "getting list res", this.List_Type);
      this.LIST_ARRAY = res.data;
    })
  }






}
