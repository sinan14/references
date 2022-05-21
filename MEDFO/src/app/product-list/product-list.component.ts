import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductListService } from 'src/app/services/product-list.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Options } from '@angular-slider/ngx-slider';
import { async } from 'rxjs';
import { CartService } from '../services/cart.service';
import { Pipe, PipeTransform } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  
  
  minValue: number=0;
  maxValue: number = 5000;

  options: Options = {
    floor: 0,
   ceil: 5000
  };
  myModel: any;
  searchValue: boolean;
  customOptions: OwlOptions = {
    items: 3,
    loop: false,
    autoplay: false,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 4
      },
      400: {
        items: 4
      },
      740: {
        items: 4
      },
      940: {
        items: 6
      }
    },
    nav: false
  }

  cartbrandcustomOptions: OwlOptions = {
    items: 9,
    loop: false,
    autoplay: false,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 4
      },
      400: {
        items: 9
      },
      740: {
        items: 9
      },
      940: {
        items: 10
      }
    },
    nav: false
  }

  subcatFirstId: any
  mainCat: any
  brand: any
  banner: any
  bannerId: any
  bannerId1: any
  bannerCatId: any
  bannerType: any
  productlist: any
  productlist1: any
  productlist2: any
  productlist3: any
  cartByBrand: any
  suSubCategory: any;
  subcategoryData: any;
  brands: any;
  brands1: any
  subcategoryid: any = '';
  subCatIdDropDown:any
  box: any[] = [1, 2, 3, 4, 5];
  //sorting variables
  discount: string[] = ['10% and below', '10% or more', '20% or more', '30% or more', '40% or more', '50% or more'];
  discountTest = [
    { name: '10% and below', isChecked: false },
    { name: '10% or more', isChecked: false },
    { name: '20% or more', isChecked: false },
    { name: '30% or more', isChecked: false },
    { name: '40% or more', isChecked: false },
    { name: '50% or more', isChecked: false },
  ];
  brandListChecked = false;
  brandList: string[] = []
  discountList: string[] = []
  subCategoryList: string[] = []
  isInclude: boolean = false;
  minPrice = 0;
  maxPrice = 5000;
  sort = "newest";
  isDiscount: any
  brand1: string[] = []
  subCategory1: string[] = []
  discount1: string[] = []
  sortValue = "newest"
  brandView = "View More"
  selectedCategory: any
  subcatChecked: any
  brandChecked: any
  id: any
  routId: string
subId:string
subSubId:string
  public token: any = ''
public subCatId:any
public bannerProductTitle:any
public bannerProductId:any
public bannerProductbrandName:any
public bannerProductmetaTitle:any
  constructor(
   
    public _router: Router,
    public pro: ProductListService,
    public route: ActivatedRoute,
    private _cartService: CartService,
    public _toasterService: ToastrService) {
      this.route.paramMap.subscribe((params:ParamMap) => {
        this.routId = params.get('cat_id');
      
        this.subId=params.get('sub_id')

        this.subSubId=params.get('sub_sub_id')
        this.productListing(this.subId)
      })
     /* this.route.queryParams.subscribe(params => {
        this.subSubId=params.sub;
        this.productListing(this.subId)
        console.log(this.subSubId);
      })*/
      this.pro.getProduct(this.routId).subscribe((res: any) => {
        this.mainCat = res.data.mainCategory.title
        this.subcategoryData = res.data.category,
        this.subCatId=this.subcategoryData.map(e=>e._id)
        if(this.subId!="" && this.subCatId.includes(this.subId)){
          this.productListing(this.subId);
        }else{
          this.subcategoryid = res.data.category[0]._id,
          this.subcatFirstId = this.subcategoryData[0]._id;
        this.productListing(this.subcatFirstId);
      }
      })
      console.log("constructor called")
  }

  ngOnInit(): void {
   
/* if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }*/
    $(document).ready(function () {
      $(".product_filter_btn").click(function(){
      $(".product_mob_filter").show();
      });
      $(".product_mob_filter_pop_close").click(function(){
      $(".product_mob_filter").hide();
      });

      $(".flt_srch_ico").click(function(){
          $(".flt_brt_search").show();
      });
    });
    this.token = localStorage.getItem('token');
 
    /*   this.id = this.route.snapshot.paramMap;
       this.routId = this.id.get("cat_id");
       //sub category list
       this.pro.getProduct(this.routId).subscribe((res: any) => {
         this.mainCat = res.data.mainCategory.title
         this.subcategoryData = res.data.category,
           this.subcategoryid = res.data.category[0]._id,
           this.subcatFirstId = this.subcategoryData[0]._id;
         this.productListing(this.subcatFirstId);
   
       })*/


    const items = document.querySelectorAll('.accordion a');
    function toggleAccordion() {
      this.classList.toggle('active');
      // //console.log(' why class does not ins');
      this.nextElementSibling.classList.toggle('active');
    }
    items.forEach((item) => item.addEventListener('click', toggleAccordion));
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      //@ts-ignore
      $('#product-list-first').owlCarousel({
        items: 5,
        loop: false,
        pullDrag: true,
        dots: false,
        autoplay: false,
        margin: 0,
        mouseDrag: true,
        rewind: true,
        touchDrag: true,
        nav: false,
        responsive: {
          0: {
            items: 2,
            loop: false,
            
          },
          600: {
            items: 2,
            loop: false,
            
          },
          1000: {
            items: 7,
            loop: false, nav: false,
            
          },
        },
      });
    });

  }


  //product list
  productListing(id: any) {
    this.subcatFirstId = id;
    this.subcategoryid = id
    this.pro.productList(id).subscribe((res: any) => {

      this.banner = res.data.banner.image,
        this.bannerId = res.data.banner.redirection_id,
        this.bannerType = res.data.banner.redirection_type
        if(this.bannerType=="category"){
          this.bannerCatId = res.data.banner.categoryId
        }else if(this.bannerType=="product"){
          this.bannerProductTitle=res.data.banner.product.name
          this.bannerProductId=res.data.banner.product._id
          this.bannerProductbrandName=res.data.banner.product.brand.title
          this.bannerProductmetaTitle=res.data.banner.product.metaTitles
        }
        
        console.log("bannerid" + this.bannerCatId)
      this.productlist = res.data.newResult,
        this.cartByBrand = res.data.popularBrand,
        this.brand = res.data.newResult.brand,
        this.suSubCategory = res.data.subSubCategory,
        /*this.subCatIdDropDown=this.suSubCategory.map(item=>item._id)
        console.log("id list"+this.subCatIdDropDown)
        if(this.subCatIdDropDown.includes(this.subSubId)){
          console.log("its trueeeee")
        }*/
        this.suSubCategory.forEach(element => {
          if(element._id===this.subSubId){
            element.checkedFlag=true;
           
            this.sendData( element.checkedFlag, element._id)
       
          }
          
        });
        this.brands = res.data.brands,
        this.brands1 = this.brands.slice(0, 6);
      this.productlist1 = this.productlist.slice(0, 6);
      this.productlist2 = this.productlist.slice(6, 12);
      this.productlist3 = this.productlist.slice(12, this.productlist.length);
    })
  }

  viewMore() {
    if(this.brandView=="View More"){
    this.brands1 = this.brands.slice(0, this.brands.length);
    this.brandView = "View Less"
  }else{
    this.brands1 = this.brands.slice(0, 6);
    this.brandView = "View More"
  }
  }

  //sorting
  sendData(e: any, sub_id: any) {
   this.subcatChecked = e;
  console.log(this.subcatChecked)
    const isChecked = e;
    console.log(this.subcategoryid)
    if (isChecked === true) {
      this.subCategoryList.push(sub_id);

      this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
        this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
          this.productlist = res.data.newResult
          this.productlist1 = this.productlist.slice(0, 6);
          this.productlist2 = this.productlist.slice(6, 12);
          this.productlist3 = this.productlist.slice(12, this.productlist.length);
        })
    }
    else if (isChecked === false) {
      this.subCategoryList.forEach((e, index) => {
        if (e === sub_id) {
          this.subCategoryList.splice(index, 1)
        }
      })

      this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
        this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
          this.productlist = res.data.newResult
          this.productlist1 = this.productlist.slice(0, 6);
          this.productlist2 = this.productlist.slice(6, 12);
          this.productlist3 = this.productlist.slice(12, this.productlist.length);
        })
    }
  }

  //brand getting
  sendBrand(e: any, id: any) {
    window.scrollTo(0,400)
    const isChecked = e.target.checked;

    console.log(id);
    if (isChecked === true) {
      this.brandList.push(id);
      this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
        this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
          this.productlist = res.data.newResult
          this.productlist1 = this.productlist.slice(0, 6);
          this.productlist2 = this.productlist.slice(6, 12);
          this.productlist3 = this.productlist.slice(12, this.productlist.length);
        })
    }
    else if (isChecked === false) {
      this.brandList.forEach((e, index) => {
        if (e === id) {
          this.brandList.splice(index, 1)
        }
      })
      this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
        this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
          this.productlist = res.data.newResult

          this.productlist1 = this.productlist.slice(0, 6);
          this.productlist2 = this.productlist.slice(6, 12);
          this.productlist3 = this.productlist.slice(12, this.productlist.length);
        })
    }
  }

  //stock availability
  stockAvailable(e: any) {
    window.scrollTo(0,400)
    const isChecked = e.target.checked;
    if (isChecked === true) {
      this.isInclude = true;

      this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
        this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
          this.productlist = res.data.newResult
          this.productlist1 = this.productlist.slice(0, 6);
          this.productlist2 = this.productlist.slice(6, 12);
          this.productlist3 = this.productlist.slice(12, this.productlist.length);
        })
    }
    else if (isChecked === false) {
      this.isInclude = false;
      this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
        this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
          this.productlist = res.data.newResult
          this.productlist1 = this.productlist.slice(0, 6);
          this.productlist2 = this.productlist.slice(6, 12);
          this.productlist3 = this.productlist.slice(12, this.productlist.length);
        })
    }
  }


  //Discount
  sendDiscount1(i) {
    window.scrollTo(0,400)
    if (this.discountTest[i].name == '10% and below') {
      this.isDiscount = "1";
      console.log(this.isDiscount)
    } else if (this.discountTest[i].name == '10% or more') {
      this.isDiscount = "10";
    }
    else if (this.discountTest[i].name == '20% or more') {
      this.isDiscount = "20";
    }
    else if (this.discountTest[i].name == '30% or more') {
      this.isDiscount = "30";
    }
    else if (this.discountTest[i].name == '40% or more') {
      this.isDiscount = "40";
    }
    else if (this.discountTest[i].name == '50% or more') {
      this.isDiscount = "50";
    }
    if (this.discountTest[i].isChecked) {
      this.discount1.push(this.isDiscount)
      this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
        this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
          this.productlist = res.data.newResult
          this.productlist1 = this.productlist.slice(0, 6);
          this.productlist2 = this.productlist.slice(6, 12);
          this.productlist3 = this.productlist.slice(12, this.productlist.length);
        })

    } else {
      this.discount1.forEach((e, index) => {
        if (e === this.isDiscount) {
          this.discount1.splice(index, 1)
        }
      })
      this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
        this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
          this.productlist = res.data.newResult
          this.productlist1 = this.productlist.slice(0, 6);
          this.productlist2 = this.productlist.slice(6, 12);
          this.productlist3 = this.productlist.slice(12, this.productlist.length);
        })
    }

  }


  Add_To_Cart(productID, variantId, item) {

    console.log(item);



    if (this.token != null) {
      let data = {
        "product_id": productID,
        "variantId": variantId,
        "quantity": 1
      }
      this._cartService.add_To_Cart(data).subscribe((res: any) => {
        console.log(res);
        this._toasterService.info(res.message, '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true
        })
        // item.inCart = true
        this._cartService.get_Cart_Count_Only()
      })
    }
    else {

      let data = {
        "product_id": productID,
        "varient_id": variantId,
        // "qty": 1,
        "image": item.image,
        "title": item.title,
        "discount": item.discount,
        "price": item.price,
        "spl_price": item.spl_price,
        "brand": item.brand.title,
        "uomValue": item.uom,
        "IsPrescriptionRequired": item.prescription,

        "uom": item.uom,
      }

      this._cartService.Check_Cart_Item(productID)

      if (this._cartService.Item_Found_Flag == true) {
        this._toasterService.info('Product already exist in your cart.', '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true
        })
      } else if (this._cartService.Item_Found_Flag == false) {
        this._cartService.assignCartItem(data, 1)
        this._toasterService.info('Added to cart', '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true
        })
      }







      // console.log(this._cartService.assignCartItem(data, 1));

      // if(this._cartService.assignCartItem(data, 1)==false){

      // }else{
      // this._toasterService.info('Added to cart','',{
      //   timeOut :  10000,
      //   positionClass: 'toast-bottom-right',
      //   closeButton:true
      // })
      // }
      //sessionStorage.setItem('CartItem',JSON.stringify(array));
    }
  }


  //Sort lowToHigh - High to Low here
  lowToHigh(e: any) {
    console.log(e.target.value);
    this.sortValue = e.target.value;
    this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
      this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sortValue).subscribe((res: any) => {
        this.productlist = res.data.newResult
        this.productlist1 = this.productlist.slice(0, 6);
        this.productlist2 = this.productlist.slice(6, 12);
        this.productlist3 = this.productlist.slice(12, this.productlist.length);
      })
  }


  productDetails(data) {
    // let id='61719db09081670e5c4232f3';
    //  let p = encodeURIComponent("xyz manwal")
    //  console.log(data.title.replace(' ','/'));

    this._router.navigate(['/product-detail', data.title, data._id,data.brand, data.metaTitles])
  }

  transform(value: string, args?: any): string {
    return value.replace(/ /g, '');
  }

  bannerClick() {
    if (this.bannerType == "product") {
      this._router.navigate(['/product-detail/' + this.bannerProductbrandName,this.bannerId,this.bannerProductbrandName,this.bannerProductmetaTitle]);
    }
    else if (this.bannerType == "category") {
      
      this.redirectTo('/product-list/' + this.bannerCatId,'','');


    }
  }


  discountClick1(i: any) {
    window.scrollTo(0,400)

    this.discountTest[i].isChecked = !this.discountTest[i].isChecked;

    // this.searchValue=false

    if (this.discountTest[i].name == '10% and below') {
      this.isDiscount = "1";
      console.log(this.isDiscount)
    } else if (this.discountTest[i].name == '10% or more') {
      this.isDiscount = "10";
    }
    else if (this.discountTest[i].name == '20% or more') {
      this.isDiscount = "20";
    }
    else if (this.discountTest[i].name == '30% or more') {
      this.isDiscount = "30";
    }
    else if (this.discountTest[i].name == '40% or more') {
      this.isDiscount = "40";
    }
    else if (this.discountTest[i].name == '50% or more') {
      this.isDiscount = "50";
    }

    if (this.discountTest[i].isChecked) {
      this.discount1.push(this.isDiscount)
      this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
        this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
          this.productlist = res.data.newResult
          this.productlist1 = this.productlist.slice(0, 6);
          this.productlist2 = this.productlist.slice(6, 12);
          this.productlist3 = this.productlist.slice(12, this.productlist.length);
        })

    }

  }
  searchBrand(e) {
    const value = e.target.value;
    let listing: any = [];
    if (value.length > 0) {
      listing = this.brands.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1

      );
      this.brands1 = listing;
    }
    else if (value === '') {
      this.brands1 = this.brands.slice(0, 7);
    }
  }
  sliderValue() {
    this.minPrice = this.minValue
    this.maxPrice = this.maxValue
    console.log(this.minPrice)
    console.log(this.maxPrice)

    this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
      this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
        this.productlist = res.data.newResult
        this.productlist1 = this.productlist.slice(0, 6);
        this.productlist2 = this.productlist.slice(6, 12);
        this.productlist3 = this.productlist.slice(12, this.productlist.length);
      })
  }
  redirectTo(uri: string,i:string,s:string) {
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this._router.navigate([uri,i,s]));
  }
minValueSend(e){
 
    this.minPrice = e.target.value
   // this.maxPrice = this.maxValue
    console.log(this.minPrice)
    console.log(this.maxPrice)
    this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
      this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
        this.productlist = res.data.newResult
        this.productlist1 = this.productlist.slice(0, 6);
        this.productlist2 = this.productlist.slice(6, 12);
        this.productlist3 = this.productlist.slice(12, this.productlist.length);
      })
  

}
maxValueSend(e){

    this.maxPrice = e.target.value
  //  this.minPrice = this.minValue
    console.log(this.minPrice)
    console.log(this.maxPrice)
    this.pro.sortProduct1(this.subcategoryid, this.brandList, this.subCategoryList,
      this.discount1, this.isInclude, this.minPrice, this.maxPrice, this.sort).subscribe((res: any) => {
        this.productlist = res.data.newResult
        this.productlist1 = this.productlist.slice(0, 6);
        this.productlist2 = this.productlist.slice(6, 12);
        this.productlist3 = this.productlist.slice(12, this.productlist.length);
      })
  
}
refresh(e){
  console.log(e)
}

}
