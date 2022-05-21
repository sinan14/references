import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from 'src/app/services/header.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2';
import { OrderMedicineService } from '../services/order-medicine.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  hambergerStatus: boolean = false;
  toggleHamberger() {
    this.hambergerStatus = !this.hambergerStatus;
  }
  searchResult: any;
  productList: any;
  productId: any;
  searchWord: string = '';
  Search_Box_Flag: boolean = false;
  public cartCount: any = 0;
  medicineName: any;
  resultArray: any;
  categoryList: any;
  subCategoryList: any;
  subSubCategoryList: any;
  mainCatId: any;
  logout() {
    this._auth.logout();
    window.location.reload();
  }
  // searchResult: any;
  // productList: any;
  // productId: any;
  // searchWord: any;
  // public cartCount: any = 0;

  constructor(
    private fb: FormBuilder,
    private Header_Service: HeaderService,
    public _auth: UserAuthService,
    public _cartService: CartService,
    public _router: Router,
    public shared: SharedService,
    public orderMedi: OrderMedicineService
  ) {
    this.shared.recieveMessage().subscribe((res) => {
      this.searchWord = res;
      //console.log('search word' + this.searchWord);
    });
  }

  public Suggest_Product_Form: FormGroup;
  private token: any;
  public Login_Flag: boolean = false;
  public Sucess_Pop_Flag: boolean = false;

  public userName: any;
  public userImage: any;

  ngOnInit(): void {
    this._auth.loginStatusChanged.subscribe((data: any) => {
      if (data === true) {
        //console.log('status changed');
        this.ngOnInit();
      }
    });

    this.token = localStorage.getItem('token');

    //cart Count
    this.get_Cart_Count();

    if (this.token != null) {
      this._cartService.get_Cart_Count().subscribe((res: any) => {
        this.cartCount = res.data.cartItemsCount;
      });
    } else {
      this._cartService.getLocalCart();
      this.cartCount = this._cartService.cartCount;
    }

    this.get_User_details();
    this.initForms();
    this.get_category_list();
    this.Search_Box_Flag = false;
    this.Sucess_Pop_Flag = false;
    this.attemptedSubmit = false;
  }

  initForms() {
    this.Suggest_Product_Form = this.fb.group({
      Product_Name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  get_Cart_Count() {
    if (this.token != null) {
      this._cartService.get_Cart_Count_Only();

      this.Login_Flag = true;

      // this._cartService.get_Cart_Count().subscribe((res: any) => {
      //   this._cartService.cartCount = res.data.cartItemsCount;

      //     this.cartCount = res.data.cartItemsCount;
      //   });
      // //console.log(
      //   this._cartService.cartCount
      // );
    } else {
      this._cartService.getLocalCart();
      this.cartCount = this._cartService.cartCount;
      this.Login_Flag = false;
    }
  }

  get_User_details() {
    this.Header_Service.get_User_details().subscribe((res: any) => {
      //console.log(res.data);
      sessionStorage.setItem('userDetails', JSON.stringify(res.data));
      this.userName = res.data.userName;
      this.userImage = res.data.userImage;
    });
  }

  Suggest_Pdt_Link_Clik() {
    this.get_User_details();

    this.token = localStorage.getItem('token');
    //console.log('token', this.token);
    if (this.token == '' || this.token == null) {
      //console.log('please login', this.token);
      this.Login_Flag = false;
    } else {
      //console.log(this.token);

      this.Login_Flag = true;
    }
  }

  Not_Login_PopClk() {
    // this.Suggest_Pdt_Link_Clik()
    document.getElementById('modal_close_button').click();
    // document.getElementById('exampleModal')!.style.display = 'none';
    //  document.getElementById('exampleModal').close()
    // window.close()
  }

  // Search_Box_Flag: boolean = false;
  Searching(event: any) {
    this.searchWord = event.target.value;
    this.Search_Box_Flag = true;
    //console.log(event.target.value);
    this.Header_Service.searchSuggestion(this.searchWord).subscribe(
      (res: any) => {
        this.searchResult = res.data.result;
        //console.log(this.searchResult.length);
      }
    );

    if (event.key == 'Enter' && this.searchWord != '') {
      this._router.navigate(['/search-product'], {
        queryParams: { key: this.searchWord },
      });
      this.Search_Box_Flag = false;
    }
    if (event.target.value == '' || event.target.value == null) {
      this.Search_Box_Flag = false;
    }
  }
  // Sucess_Pop_Flag: boolean = false
  attemptedSubmit: boolean = false;
  Submit_Product_Form() {
    //console.log(this.Suggest_Product_Form.get('Product_Name').value);

    //console.log('Form Submit Function Called');
    //console.log(this.Suggest_Product_Form.get('Product_Name').value);

    this.attemptedSubmit = true;
    if (this.Suggest_Product_Form.valid) {
      //console.log('valid form');

      let body = {
        title: this.Suggest_Product_Form.get('Product_Name').value,
      };
      //console.log(body, 'passing obj');

      this.Header_Service.post_suggest_a_pdt(body).subscribe((res: any) => {
        //console.log(res);
        if (res.message == 'Product requested') {
          this.Suggest_Product_Form.reset();
          document.getElementById('pop').click();
          this.Not_Login_PopClk();
          this.attemptedSubmit = false;
        } else {
          // this.pop(res);
          Swal.fire({
            text: res.message,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 500,
          });
          this.attemptedSubmit = false;
          this.Suggest_Product_Form.reset();
          this.Not_Login_PopClk();
        }

        // Swal.fire({
        //   text: "We have successfully added your suggestion",
        //   icon: 'success',
        //   showCancelButton: false,
        //   confirmButtonText: 'Ok',
        //   confirmButtonColor: '#3085d6',
        //   imageHeight: 500,
        // })
      });
    } else {
      // this.Sucess_Pop_Flag = false
    }
  }

  pop(res: any) {
    //console.log(res.data, 'res data');
    //console.log(res.error, 'res status');
    // this.attemptedSubmit = false
    if (res.error == false) {
      Swal.fire({
        text: res.message,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });
      this.attemptedSubmit = false;
      this.Suggest_Product_Form.reset();
      this.Not_Login_PopClk();
      // data-dismiss="modal" aria-label="Close"
      // this.modalService.close()
    } else {
      Swal.fire({
        text: res.message,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });
      // this.updateFlag = false
    }
    // this.addLoading = false;
    // this.attemptedSubmit = false;
  }
  findProduct(key) {
    this._router.navigate(['/search-product'], { queryParams: { key: key } });

    this.Search_Box_Flag = false;
  }
  searchIcon() {
    if (this.Search_Box_Flag) {
      this._router.navigate(['/search-product'], {
        queryParams: { key: this.searchWord },
      });
    }
    this.Search_Box_Flag = false;
  }
  orderMedicine() {
    this.orderMedi.getActiveMedicine().subscribe((res) => {
      this.medicineName = res.data;
    });
  }
  orderMedicineRoute() {
    document.getElementById('dismiss-refund').click();
    this._router.navigate(['/order']);
  }
  get_category_list() {
    this.Header_Service.categoryListDropDown().subscribe((res: any) => {
      //this.categoryList=res.data.category.map(item=>item.title);
      this.categoryList = res.data.category;
      //console.log(this.categoryList);
    });
  }
  get_sub_category_list(id: any) {
    this.mainCatId = id;
    this.Header_Service.subCategoryListDropDown(id).subscribe((res: any) => {
      //this.categoryList=res.data.category.map(item=>item.title);
      this.resultArray = res.data.sub_category;
      // this.subCategoryList=this.resultArray.filter(item=>item.categoryId)
      // this.subSubCategoryList=this.resultArray.filter(item=>item.subCategoryId)
      this.subCategoryList = this.resultArray.subSubCategorys;

      //console.log(this.subCategoryList);
    });
  }
  get_sub_sub_category_list(id: any) {
    this.Header_Service.subSubCategoryListDropDown(id).subscribe((res: any) => {
      //this.categoryList=res.data.category.map(item=>item.title);
      this.subSubCategoryList = res.data.sub_sub_category;
      //console.log(this.subSubCategoryList);
    });
  }
  toCategoryPage(id: any) {
    this._router.navigate(['/product-list/' + this.mainCatId, id, '']);
  }
  toCategoryPage1(id: any, subId: any) {
    this._router.navigate(['/product-list/' + this.mainCatId, id, subId]);
    /* if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }*/
  }
  example() {
    //console.log('halooooooooooooooooooooooooo');
  }

  redrectionToInnerPage(type: any) {
    if (type === 'healthcare') {
      this._router.navigate(['/category-list']);
    } else if (type === 'medpride') {
      this._router.navigate(['/medpride-membership']);
    }
  }

  logToConsole() {
    //console.log('you click me');
    this._router.navigate(['/offers']);
  }
}
