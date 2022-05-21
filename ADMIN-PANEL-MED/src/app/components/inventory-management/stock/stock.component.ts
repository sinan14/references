import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { StockListService } from 'src/app/services/stock-list.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  public listCategory: Array<string> = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  public closeResult: string;


  public vendors = [
    {
      image: "assets/images/electronics/product/medical-mask.png",
      MedimallID: "36758",
      SKNNO: "254",
      sku: "2343",
      Name: "Haire Oil",
      Categories: "baby Care",
      Brand: "Pathanjali",
      Price: "124",
      Quantity: "432",
      stock: "100",
      Status: "<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches1' checked><label class='custom-control-label' for='customSwitches1'></label></div> "
    },
    {
      image: "assets/images/electronics/product/facewash.png",
      MedimallID: "36758",
      SKNNO: "254",
      sku: "2343",
      Name: "Haire Oil",
      Categories: "baby Care",
      Brand: "Pathanjali",
      Price: " 124",
      Quantity: "432",
      stock: "100",
      Status: "<div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches2' checked='true'><label class='custom-control-label' for='customSwitches2'></label></div> "
    },
    {
      image: "assets/images/electronics/product/medical-mask.png",
      MedimallID: "36758",
      SKNNO: "254",
      sku: "2343",
      Name: "Haire Oil",
      Categories: "baby Care",
      Brand: "Pathanjali",
      Price: "124",
      Quantity: "432",
      stock: "100",
      Status: "<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches3' checked='true'><label class='custom-control-label' for='customSwitches3'></label></div> "
    },
    {
      image: "assets/images/electronics/product/facewash.png",
      MedimallID: "36758",
      SKNNO: "254",
      sku: "2343",
      Name: "Haire Oil",
      Categories: "baby Care",
      Brand: "Pathanjali",
      Price: "124",
      Quantity: "432",
      stock: "100",
      Status: "<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches4' checked='true'><label class='custom-control-label' for='customSwitches4'></label></div> "
    },
    {
      image: "assets/images/electronics/product/medical-mask.png",
      MedimallID: "36758",
      SKNNO: "254",
      sku: "2343",
      Name: "Haire Oil",
      Categories: "baby Care",
      Brand: "Pathanjali",
      Price: "124",
      Quantity: "432",
      stock: "100",
      Status: "<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches5' checked='true'><label class='custom-control-label' for='customSwitches5'></label></div> "
    },

  ];

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  public List_Type: any
  public CAT_DROP_ARRAY: any = []
  public Stock_List_Array: any = []
  public DropDown: FormGroup
  public Out_Stock_List_Array = []
  public Low_Stock_List_Array = []
  public med_flag: boolean = false
  public Med_Stock_form: FormGroup
  public Health_Stock_form: FormGroup
  public attemptedSubmit: boolean = false;
  public addLoading: boolean = false;
  public Tab_Event: any


  public Store_Stock_List_Array: any = []


  public ID: any
  public VAR_ID: any

  public PRICE_VAR: any
  public S_PRICE_VAR: any
  public price_flag: boolean = false;
  public temp: any;

  public CurrentPage: any
  public nextPage: boolean
  public totalPage: any
  public SearchAllval: any
  public SearchAllPage: any

  public CurrentPageLow: any
  public nextPageLow: boolean
  public totalPageLow: any
  public SearchLowval: any
  public SearchLowPage: any


  public CurrentPageOut: any
  public nextPageOut: boolean
  public totalPageOut: any
  public SearchOutval: any
  public SearchOutPage: any
  public selectedTab: any;

  public Max_Val: any

  constructor(private _router: Router,
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private location: Location,
    private activated_router: ActivatedRoute,
    private Stock_Service: StockListService,
    public fb: FormBuilder) {

    this.get_INVENTORY_VARIENTS(this.VAR_ID);
    this.selectedTab = 'all';
  }

  ngOnInit(): void {

    this.selectedTab = 'all';
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    // if (this.user != '') {
    //   this.permissionService.canActivate(this.location.path().split('/').pop())
    // }


    this.activated_router.paramMap.subscribe(res => {
      this.List_Type = res.get('type')
      console.log(this.List_Type, "list type");
      if (this.List_Type == 'medicine') {
        this.med_flag = true
      }
    })

    this.CurrentPage = 1
    this.CurrentPageLow = 1
    this.CurrentPageOut = 1
    this.VAR_ID = 'all'
    this.get_INVENTORY_VARIENTS('all')
    console.log(this.List_Type, "type");

    this.Stock_Service.get_INVENTORY_CATEGORY(this.List_Type).subscribe((res: any) => {
      console.warn(res, "getting catlist res", this.List_Type);
      this.CAT_DROP_ARRAY = res.data.categories;
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


    this.Med_Stock_form = this.fb.group({
      hsn: ['', [Validators.required]],
      price: ['', [Validators.required]],
      sprice: ['', [Validators.required]],
      exp: ['', [Validators.required]],
      stock: ['', [Validators.required]],
    })

    this.Health_Stock_form = this.fb.group({
      hsn: ['', [Validators.required]],
      price: ['', [Validators.required]],
      sprice: ['', [Validators.required]],
      stock: ['', [Validators.required]],
    })
    this.temp = new Date().toISOString().split('T')[0];



    //In case of store login
    if (this.user.isStore) {
      this.getOurStoreInventoryList('all');
      this.get_INVENTORY_VARIENTS(this.VAR_ID)
    }

  }


  //Store Login - our inventory variants
  getOurStoreInventoryList(id) {
    let data = {
      categoryId: id,
      type: this.List_Type,
      page: this.CurrentPage,
      limit: 10
    }
    console.log(data, "inventory data");

    this.Stock_Service.get_our_store_product_listing(data).subscribe((res: any) => {
      this.nextPage = res.data.nextPage
      this.totalPage = res.data.totalPage

      this.Stock_List_Array = []
      console.log(res);
      this.Store_Stock_List_Array = res.data.product_varients
      if (this.List_Type == 'medicine') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice,
            expiryDate: itm.expiryDate
          }
        });
        this.Store_Stock_List_Array = mappedData
      } else if (this.List_Type == 'healthcare') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice
          }
        });
        this.Store_Stock_List_Array = mappedData
      }

    })
  }


  get_INVENTORY_VARIENTS(id: any) {
    // this.CurrentPage = 1
    let data = {
      categoryId: id,
      type: this.List_Type,
      page: this.CurrentPage,
      limit: 10
    }
    console.log(data, "inventory data");

    this.Stock_Service.get_INVENTORY_VARIENTS(data).subscribe((res: any) => {
      this.nextPage = res.data.nextPage
      this.totalPage = res.data.totalPage

      this.Stock_List_Array = []
      console.log(res);
      this.Stock_List_Array = res.data.product_varients
      if (this.List_Type == 'medicine') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice,
            expiryDate: itm.expiryDate
          }
        });
        this.Stock_List_Array = mappedData
      } else if (this.List_Type == 'healthcare') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice
          }
        });
        this.Stock_List_Array = mappedData
      }

    })

  }

  get_OUT_OF_STOCK_INVENTORY_VARIENTS(id: any) {

    let data = {
      categoryId: id,
      type: this.List_Type,
      page: this.CurrentPageOut,
      limit: 10
    }

    this.Stock_Service.get_OUT_OF_STOCK_INVENTORY_VARIENTS(data).subscribe((res: any) => {

      this.nextPageOut = res.data.nextPage
      this.totalPageOut = res.data.totalPage

      this.Out_Stock_List_Array = []
      console.log(res);
      this.Out_Stock_List_Array = res.data.product_varients
      if (this.List_Type == 'medicine') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice,
            expiryDate: itm.expiryDate
          }
        });
        this.Out_Stock_List_Array = mappedData
      } else if (this.List_Type == 'healthcare') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice
          }
        });
        this.Out_Stock_List_Array = mappedData
      }
    })

  }

  get_LOW_STOCK_INVENTORY_VARIENTS(id: any) {

    let data = {
      categoryId: id,
      type: this.List_Type,
      page: this.CurrentPageLow,
      limit: 10
    }

    this.Stock_Service.get_LOW_STOCK_INVENTORY_VARIENTS(data).subscribe((res: any) => {

      this.nextPageLow = res.data.nextPage
      this.totalPageLow = res.data.totalPage

      this.Low_Stock_List_Array = []
      console.log(res);
      this.Low_Stock_List_Array = res.data.product_varients

      if (this.List_Type == 'medicine') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice,
            expiryDate: itm.expiryDate
          }
        });
        this.Low_Stock_List_Array = mappedData
      } else if (this.List_Type == 'healthcare') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice
          }
        });
        this.Low_Stock_List_Array = mappedData
      }
    })

  }


  //In the case of store login

  get_STORE_OUT_OF_STOCK_INVENTORY_VARIENTS(id: any) {

    let data = {
      categoryId: id,
      type: this.List_Type,
      page: this.CurrentPageOut,
      limit: 10
    }

    this.Stock_Service.get_store_out_of_stock(data).subscribe((res: any) => {

      this.nextPageOut = res.data.nextPage
      this.totalPageOut = res.data.totalPage

      this.Out_Stock_List_Array = []
      console.log(res);
      this.Out_Stock_List_Array = res.data.product_varients
      if (this.List_Type == 'medicine') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice,
            expiryDate: itm.expiryDate
          }
        });
        this.Out_Stock_List_Array = mappedData
      } else if (this.List_Type == 'healthcare') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice
          }
        });
        this.Out_Stock_List_Array = mappedData
      }
    })

  }

  get_STORE_LOW_STOCK_INVENTORY_VARIENTS(id: any) {

    let data = {
      categoryId: id,
      type: this.List_Type,
      page: this.CurrentPageLow,
      limit: 10
    }

    this.Stock_Service.get_store_low_stock(data).subscribe((res: any) => {

      this.nextPageLow = res.data.nextPage
      this.totalPageLow = res.data.totalPage

      this.Low_Stock_List_Array = []
      console.log(res);
      this.Low_Stock_List_Array = res.data.product_varients

      if (this.List_Type == 'medicine') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice,
            expiryDate: itm.expiryDate
          }
        });
        this.Low_Stock_List_Array = mappedData
      } else if (this.List_Type == 'healthcare') {
        let mappedData = res.data.product_varients.map(itm => {
          return {
            _id: itm._id,
            productId: itm.productId,
            category: itm.category.map(cat => { return cat }).toString(),
            price: itm.price,
            name: itm.name,
            brand: itm.brand,
            image: itm.image,
            sku: itm.sku,
            skuOrHsnNo: itm.skuOrHsnNo,
            stock: itm.stock,
            specialPrice: itm.specialPrice
          }
        });
        this.Low_Stock_List_Array = mappedData
      }
    })

  }



  Update() {
    this.attemptedSubmit = true

    if (this.List_Type == 'medicine') {
      console.log("MEDICINE");
      if (this.Med_Stock_form.valid) {
        console.log("form valid");
        this.addLoading = true
        this.price_flag = false

        let bdy = {
          price: this.Med_Stock_form.get('price').value,
          specialPrice: this.Med_Stock_form.get('sprice').value,
          stock: this.Med_Stock_form.get('stock').value,
          expiryDate: this.Med_Stock_form.get('exp').value,
          skuOrHsnNo: this.Med_Stock_form.get('hsn').value,
        }
        this.Stock_Service.update_LOW_STOCK_INVENTORY_VARIENTS(this.ID, bdy).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        })

      } else {
        this.price_flag = true
      }

    } else if (this.List_Type == 'healthcare') {
      console.log("HEALTH CARE");
      if (this.Health_Stock_form.valid) {
        console.log("form valid");
        this.price_flag = false
        this.addLoading = true
        let bdy = {
          price: this.Health_Stock_form.get('price').value,
          specialPrice: this.Health_Stock_form.get('sprice').value,
          stock: this.Health_Stock_form.get('stock').value,
          skuOrHsnNo: this.Health_Stock_form.get('hsn').value,
        }
        this.Stock_Service.update_LOW_STOCK_INVENTORY_VARIENTS(this.ID, bdy).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        })

      } else {
        this.price_flag = true
      }

    }
  }

  //Store Stock Update

  StoreStockUpdate() {
    //alert("store update")
    this.attemptedSubmit = true

    if (this.List_Type == 'medicine') {
      console.log("MEDICINE");
      if (this.Med_Stock_form.valid) {
        console.log("form valid");
        this.addLoading = true
        this.price_flag = false

        let bdy = {
          id: this.ID,
          price: this.Med_Stock_form.get('price').value,
          specialPrice: this.Med_Stock_form.get('sprice').value,
          stock: this.Med_Stock_form.get('stock').value,
          expiryDate: this.Med_Stock_form.get('exp').value,
          skuOrHsnNo: this.Med_Stock_form.get('hsn').value,
          type: "medicine"
        }
        this.Stock_Service.update_Store_login_stock_inventory_invarients(bdy).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
          this.getOurStoreInventoryList(this.VAR_ID);
        })

      } else {
        this.price_flag = true
      }

    } else if (this.List_Type == 'healthcare') {
      console.log("HEALTH CARE");
      if (this.Health_Stock_form.valid) {
        console.log("form valid");
        this.price_flag = false
        this.addLoading = true
        let bdy = {
          id: this.ID,
          price: this.Health_Stock_form.get('price').value,
          specialPrice: this.Health_Stock_form.get('sprice').value,
          stock: this.Health_Stock_form.get('stock').value,
          skuOrHsnNo: this.Health_Stock_form.get('hsn').value,
          type: "healthcare"
        }
        this.Stock_Service.update_Store_login_stock_inventory_invarients(bdy).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
          this.getOurStoreInventoryList(this.VAR_ID);
        })

      } else {
        this.price_flag = true
      }

    }
  }


  searchAll(val: any) {
    // this.dataLoading = true;
    if (val != '') {
      // this.searchFlag = true
      this.SearchAllval = ''
      this.SearchAllval = val
      this.SearchAllPage = 1

      let input = {
        "type": this.List_Type,
        "page": this.SearchAllPage,
        "limit": 10,
        "keyword": this.SearchAllval
      }

      this.search_All(input)


    } else if (val == '') {
      console.log("no val in search");
      this.Stock_List_Array = []
      this.get_INVENTORY_VARIENTS(this.VAR_ID)
      // this.searchFlag = false

    }
  }

  search_All(val: any) {
    this.Stock_Service.search_STOCK_LIST(val).subscribe((res: any) => {
      console.log(res);

      if (res.status == true) {
        // this.LIST_ARRAY = res.data;
        // this.dataLoading = false;

        this.Stock_List_Array = []
        this.Stock_List_Array = res.data.result;

        if (this.List_Type == 'medicine') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice,
              expiryDate: itm.expiryDate
            }
          });
          this.Stock_List_Array = mappedData
        } else if (this.List_Type == 'healthcare') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice
            }
          });
          this.Stock_List_Array = mappedData
        }
      }
      else {
        this.Stock_List_Array = []
        // this.get_INVENTORY_VARIENTS(this.VAR_ID)
        // this.searchFlag = false
        // this.get_yoga_vid()
        // // this.dataLoading = false;
      }
    })
  }





  searchLow(val: any) {
    // this.dataLoading = true;
    if (val != '') {
      // this.searchFlag = true
      this.SearchLowval = ''
      this.SearchLowval = val
      this.SearchLowPage = 1

      let input = {
        "type": this.List_Type,
        "page": this.SearchLowPage,
        "limit": 10,
        "keyword": this.SearchLowval
      }
      if (this.user.isAdmin) {
        this.search_Low(input)
      }
      else if (this.user.isStore) {
        this.store_search_Low(input)
      }

    } else if (val == '') {
      console.log("no val in search");
      this.Low_Stock_List_Array = []
      if (this.user.isAdmin) {
        this.get_LOW_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
      }
      else if (this.user.isStore) {
        this.get_STORE_LOW_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
      }
      // this.searchFlag = false

    }
  }

  search_Low(val: any) {
    this.Stock_Service.search_LOW_STOCK(val).subscribe((res: any) => {
      console.log(res);

      if (res.status == true) {
        // this.LIST_ARRAY = res.data;
        // this.dataLoading = false;

        this.Low_Stock_List_Array = []
        console.log(res);
        this.Low_Stock_List_Array = res.data.result

        if (this.List_Type == 'medicine') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice,
              expiryDate: itm.expiryDate
            }
          });
          this.Low_Stock_List_Array = mappedData
        } else if (this.List_Type == 'healthcare') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice
            }
          });
          this.Low_Stock_List_Array = mappedData
        }
      }
      else {
        this.Low_Stock_List_Array = []
        // this.get_LOW_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
        // this.searchFlag = false
        // this.get_yoga_vid()
        // // this.dataLoading = false;
      }
    })
  }


  store_search_Low(val: any) {
    this.Stock_Service.search_low_stock_store_inventory(val).subscribe((res: any) => {
      console.log(res);

      if (res.status == true) {
        // this.LIST_ARRAY = res.data;
        // this.dataLoading = false;

        this.Low_Stock_List_Array = []
        console.log(res);
        this.Low_Stock_List_Array = res.data.result

        if (this.List_Type == 'medicine') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice,
              expiryDate: itm.expiryDate
            }
          });
          this.Low_Stock_List_Array = mappedData
        } else if (this.List_Type == 'healthcare') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice
            }
          });
          this.Low_Stock_List_Array = mappedData
        }
      }
      else {
        this.Low_Stock_List_Array = []
        // this.get_LOW_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
        // this.searchFlag = false
        // this.get_yoga_vid()
        // // this.dataLoading = false;
      }
    })
  }


  //In case of store Login

  searchOurInventory(val: any) {
    // this.dataLoading = true;
    if (val != '') {
      // this.searchFlag = true
      this.SearchAllval = ''
      this.SearchAllval = val
      this.SearchAllPage = 1

      let input = {
        "type": this.List_Type,
        "page": this.SearchAllPage,
        "limit": 10,
        "keyword": this.SearchAllval
      }

      this.store_search_All(input)


    } else if (val == '') {
      console.log("no val in search");
      this.Stock_List_Array = []
      this.getOurStoreInventoryList(this.VAR_ID)
      // this.searchFlag = false

    }
  }

  //store search 

  store_search_All(val: any) {
    this.Stock_Service.search_all_store_inventory(val).subscribe((res: any) => {
      console.log(res);

      if (res.status == true) {
        // this.LIST_ARRAY = res.data;
        // this.dataLoading = false;

        this.Store_Stock_List_Array = []
        this.Store_Stock_List_Array = res.data.result;

        if (this.List_Type == 'medicine') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice,
              expiryDate: itm.expiryDate
            }
          });
          this.Store_Stock_List_Array = mappedData
        } else if (this.List_Type == 'healthcare') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice
            }
          });
          this.Store_Stock_List_Array = mappedData
        }
      }
      else {
        this.Store_Stock_List_Array = []
        // this.get_INVENTORY_VARIENTS(this.VAR_ID)
        // this.searchFlag = false
        // this.get_yoga_vid()
        // // this.dataLoading = false;
      }
    })
  }






  searchOut(val: any) {
    // this.dataLoading = true;
    if (val != '') {
      // this.searchFlag = true
      this.SearchOutval = ''
      this.SearchOutval = val
      this.SearchOutPage = 1

      let input = {
        "type": this.List_Type,
        "page": this.SearchOutPage,
        "limit": 10,
        "keyword": this.SearchOutval
      }
      if (this.user.isAdmin) {
        this.search_Out(input)
      }
      else if (this.user.isStore) {
        this.store_search_Out(input)
      }

    } else if (val == '') {
      console.log("no val in search");
      this.Out_Stock_List_Array = []
      if (this.user.isAdmin) {
        this.get_OUT_OF_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
      }
      else if (this.user.isStore) {
        this.get_STORE_OUT_OF_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
      }
      // this.searchFlag = false

    }
  }


  search_Out(val: any) {
    this.Stock_Service.search_OUT_STOCK(val).subscribe((res: any) => {
      console.log(res);

      if (res.status == true) {
        // this.LIST_ARRAY = res.data;
        // this.dataLoading = false;

        this.Out_Stock_List_Array = []

        this.Out_Stock_List_Array = res.data.result
        if (this.List_Type == 'medicine') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice,
              expiryDate: itm.expiryDate
            }
          });
          this.Out_Stock_List_Array = mappedData
        } else if (this.List_Type == 'healthcare') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice
            }
          });
          this.Out_Stock_List_Array = mappedData
        }
      }
      else {
        this.Out_Stock_List_Array = []
        // this.get_OUT_OF_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
        // this.searchFlag = false
        // this.get_yoga_vid()
        // // this.dataLoading = false;
      }
    })
  }


  store_search_Out(val: any) {
    this.Stock_Service.search_out_of_stock_store_inventory(val).subscribe((res: any) => {
      console.log(res);

      if (res.status == true) {
        // this.LIST_ARRAY = res.data;
        // this.dataLoading = false;

        this.Out_Stock_List_Array = []

        this.Out_Stock_List_Array = res.data.result
        if (this.List_Type == 'medicine') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice,
              expiryDate: itm.expiryDate
            }
          });
          this.Out_Stock_List_Array = mappedData
        } else if (this.List_Type == 'healthcare') {
          let mappedData = res.data.result.map(itm => {
            return {
              _id: itm._id,
              productId: itm.productId,
              category: itm.category.map(cat => { return cat }).toString(),
              price: itm.price,
              name: itm.name,
              brand: itm.brand,
              image: itm.image,
              sku: itm.sku,
              skuOrHsnNo: itm.skuOrHsnNo,
              stock: itm.stock,
              specialPrice: itm.specialPrice
            }
          });
          this.Out_Stock_List_Array = mappedData
        }
      }
      else {
        this.Out_Stock_List_Array = []
        // this.get_OUT_OF_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
        // this.searchFlag = false
        // this.get_yoga_vid()
        // // this.dataLoading = false;
      }
    })
  }








  onPageChangeAll(pg) {
    console.log(pg, "all");
    this.CurrentPage = pg
    this.get_INVENTORY_VARIENTS(this.VAR_ID)
  }

  onPageChangeLow(pg) {
    console.log(pg, "low");
    this.CurrentPageLow = pg
    this.get_LOW_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
  }

  onPageChangeOut(pg) {
    console.log(pg, "out");
    this.CurrentPageOut = pg
    this.get_OUT_OF_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
  }


  disableTab(value) {
    if (this.user.isAdmin === true) {
      let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
    else if (this.user.isStore === true) {
      let flag = this.permissionService.setBoxPrivilegesStore(value, this.user.isStore);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
    else {
      let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
  }

  onChangeList(val) {
    this.VAR_ID = val._id
    console.log("onchange with", this.VAR_ID, "this id");
    if(this.user.isAdmin){
      this.get_INVENTORY_VARIENTS(this.VAR_ID)
      this.get_OUT_OF_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
      this.get_LOW_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
    }
    else if(this.user.isStore){
      this.get_INVENTORY_VARIENTS(this.VAR_ID)
      this.getOurStoreInventoryList(this.VAR_ID);
      this.get_STORE_OUT_OF_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
      this.get_STORE_LOW_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
    }
  }

  tabChangeFn(event) {
    this.Tab_Event = null
    this.Tab_Event = event
    this.CurrentPage = 1
    this.CurrentPageLow = 1
    this.CurrentPageOut = 1
    this.VAR_ID = 'all'
    console.log(event.nextId);
    this.DropDown.patchValue({
      drop: null
    })
    if (event.nextId == 'all') {
      this.Stock_List_Array = []
      this.get_INVENTORY_VARIENTS(this.VAR_ID)
    } else if (event.nextId == 'outOfStock') {
      this.Out_Stock_List_Array = []
      if (this.user.isStore === true) {
        this.get_STORE_OUT_OF_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
      }
      else {
        this.get_OUT_OF_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
      }
    } else if (event.nextId == 'LowStock') {
      this.Low_Stock_List_Array = []
      if (this.user.isStore === true) {
        this.get_STORE_LOW_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
      }
      else {
        this.get_LOW_STOCK_INVENTORY_VARIENTS(this.VAR_ID)
      }

    } else if (event.nextId == 'Our Inventory') {
      this.Store_Stock_List_Array = []
      this.getOurStoreInventoryList(this.VAR_ID)
    }
  }

  open(content, itm: any) {

    this.Max_Val = null

    this.price_flag = false
    this.PRICE_VAR = null


    console.log(itm);

    this.ID = itm._id

    this.attemptedSubmit = false
    this.addLoading = false
    this.Med_Stock_form.reset()
    this.Health_Stock_form.reset()

    // brand: "614d9d4de61f77e457fbcca0"
    // category: "Sanitizer"
    // image: "http://143.110.240.107:8000/inventory/image_1632999998132.jpg"
    // name: "Lifebouy"
    // : 500
    // productId: "KDWI2"
    // sku: "6152fc413aa62332f616f7ad"
    // : "F3SW3"
    // : 46
    // _id: "61559a829f2ac6ef94cb17ec"



    if (this.List_Type == 'medicine') {
      this.price_flag = false
      this.PRICE_VAR = null
      this.Med_Stock_form.patchValue({
        hsn: itm.skuOrHsnNo,
        price: itm.price,
        sprice: itm.specialPrice,
        exp: itm.expiryDate,
        stock: itm.stock,
      })
      this.Max_Val = this.Med_Stock_form.get('price').value
      this.Price_Med()
      // if (itm.specialPrice > itm.price) {
      //   this.price_flag = true
      // }

      // this.PRICE_VAR = itm.price
      // this.S_PRICE_VAR = itm.specialPrice
      // console.log(this.PRICE_VAR, "neew price var");

    } else if (this.List_Type == 'healthcare') {
      this.price_flag = false

      this.Health_Stock_form.patchValue({
        hsn: itm.skuOrHsnNo,
        price: itm.price,
        sprice: itm.specialPrice,
        stock: itm.stock,
      })
      this.Max_Val = this.Health_Stock_form.get('price').value
      this.Price_Hel()
      // if (itm.specialPrice > itm.price) {
      //   this.price_flag = true
      // }
      // this.PRICE_VAR = itm.price
      // this.S_PRICE_VAR = itm.specialPrice
      // console.log(this.PRICE_VAR, "neew price var");
    }


    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
    if (res.status === true) {
      Swal.fire({
        text: res.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
      this.modalService.dismissAll();
      this.get_INVENTORY_VARIENTS('all')
      this.tabChangeFn(this.Tab_Event)
      this.Med_Stock_form.reset()
      this.Health_Stock_form.reset()
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
    this.attemptedSubmit = false
    this.addLoading = false
    // this.InventoryListService.get_LIST_INVENTORY_PRODUCTS(this.List_Type).subscribe((res: any) => {
    //   console.log(res, "getting list res", this.List_Type);
    //   this.LIST_ARRAY = res.data;
    // })
  }

  // PriceFunction(val) {
  //   console.log(val, "keyup val");
  //   console.log(this.S_PRICE_VAR, "special price");

  //   this.price_flag = false
  //   if (this.PRICE_VAR > this.S_PRICE_VAR) {
  //     this.price_flag = true
  //   } else {
  //     this.price_flag = false
  //   }
  // }

  // Price_Flag(event) {
  //   this.price_flag = false

  //   this.Max_Val = event.target.value

  //   this.Med_Stock_form.

  // }








  // Price_Flag_Med(event: any) {
  //   console.log(event.target.value, "event");
  //   this.Max_Val = null
  //   this.Max_Val = event.target.value
  //   console.log(this.Max_Val);

  // }

  Price_Med() {
    this.Max_Val = null
   this.Max_Val = this.Med_Stock_form.get('price').value
    console.log(this.Max_Val);

    // this.Pur_Amt = null
    // this.Pur_Amt = event.target.value
    this.Med_Stock_form.controls['sprice'].setValidators([Validators.max(this.Max_Val)]);
    this.Med_Stock_form.controls['sprice'].updateValueAndValidity()
  }



  // Price_Flag_Hel(event: any) {
  //   console.log(event.target.value, "event");
  //   this.Max_Val = null
  //   this.Max_Val = event.target.value
  //   console.log(this.Max_Val);

  // }

  Price_Hel() {
  this.Max_Val = null
   this.Max_Val = this.Health_Stock_form.get('price').value
    console.log(this.Max_Val);

    // this.Pur_Amt = null
    // this.Pur_Amt = event.target.value
    this.Health_Stock_form.controls['sprice'].setValidators([Validators.max(this.Max_Val)]);
    this.Health_Stock_form.controls['sprice'].updateValueAndValidity()
  }







  FilterDrop(value) {
    console.log(this.CAT_DROP_ARRAY);
    if (value.length >= 1) {
      this.CAT_DROP_ARRAY = this.CAT_DROP_ARRAY.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.Stock_Service.get_INVENTORY_CATEGORY(this.List_Type).subscribe((res: any) => {
        console.warn(res, "getting catlist res", this.List_Type);
        this.CAT_DROP_ARRAY = res.data.categories;
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


}
