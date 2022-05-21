import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {

 
  
//Api for sub category;
 
public API = environment.baseUrl;
public GET_SEARCH_PRODUCTS = this.API + '/customer/get_user_details';
constructor(private http: HttpClient) { }
getProduct(id:any):Observable<any>{
  //  const httpHeader=new HttpHeaders({
  //  'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNmRhZmJlZDQxY2EyNDU0MTQ5NWNmOSIsImlhdCI6MTYzNDcyMDI4MCwiZXhwIjoxNjM3MzEyMjgwfQ.Sytbym-_iGqfKkEJl17zMVEBKxRS_ov3_2czEdmAwtw'
  //   })

    return this.http.post(`${this.API}/user/get_web_subcategories`,{cat_id:id});
  
    }
    productList(id:string):Observable<any>{
      // const httpHeader=new HttpHeaders({
      //   'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNmRhZmJlZDQxY2EyNDU0MTQ5NWNmOSIsImlhdCI6MTYzNDcyMDI4MCwiZXhwIjoxNjM3MzEyMjgwfQ.Sytbym-_iGqfKkEJl17zMVEBKxRS_ov3_2czEdmAwtw'
      // })
      return this.http.post(`${this.API}/user/get_web_products`,{
        "sub_id":id,
        "page":1,
        "limit":100
    });
  
    
    }
       /////////////  check box  ////////////////
  /*********************************************/
 
 sortProduct1(id:any,brand:any,subCategory:any,discount:any,isInclude:any,min:any,max:any,sort:any):Observable<any>{
  const httpHeader=new HttpHeaders({
    'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNmRhZmJlZDQxY2EyNDU0MTQ5NWNmOSIsImlhdCI6MTYzNDcyMDI4MCwiZXhwIjoxNjM3MzEyMjgwfQ.Sytbym-_iGqfKkEJl17zMVEBKxRS_ov3_2czEdmAwtw'
  })
  return this.http.post(`${this.API}/user/sort_products`,{
  "sub_id":id,
  "brands":brand,
  "subCategories":subCategory,
  "discounts":discount,
  "isIncludeOutOfStock":isInclude,
  "minPrice":min,
  "maxPrice":max,
  "sort":sort,
  "page":1,
  "limit":100
},{headers:httpHeader});


}
}
