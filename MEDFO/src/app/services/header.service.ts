import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  public API = environment.baseUrl

  public POST_SUGGEST_A_PDT = this.API + '/user/suggest_product'
  public GET_USER_DETAILS = this.API + '/user/user_suggest_product'
  public SEARCH_PRODUCT = this.API +'/user/search_inventory'
  public SEARCH_SUGESTION = this.API +'/user/search_inventory_suggestion'
  public MOST_SEARCHED_PRODUCT = this.API +'/user/add_most_searched_product'
  public CATEGORY_DROP_DOWN=this.API+'/user/get_categories_for_web'
  public SUB_CATEGORY_DROP_DOWN=this.API+'/user/get_subcategories_for_web'
  public SUB_SUB_CATEGORY_DROP_DOWN=this.API+'/user/get_sub_subcategories_for_web'
  constructor(private http:HttpClient) { }

post_suggest_a_pdt(data:any){
return this.http.post(this.POST_SUGGEST_A_PDT,data)
}

get_User_details(){
  return this.http.get(this.GET_USER_DETAILS)

}
  searchProduct(key: any): Observable<any>{
  return this.http.post(this.SEARCH_PRODUCT, { keyword: key, page: 1, limit: 100 })
}
  searchSuggestion(key: any): Observable<any> {
    return this.http.post(this.SEARCH_SUGESTION, { keyword: key, page: 1, limit: 100 })
  }
  mostSearchedProduct(id:any):Observable<any> {
    return this.http.post(this.MOST_SEARCHED_PRODUCT, {productId:id});
  }
  categoryListDropDown(){
     const httpHeader=new HttpHeaders({
     'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTAxYjE1NmYwYmM1MmI4MTUzNTRiZiIsImlhdCI6MTYzOTQ1NTA3NiwiZXhwIjoxNjQyMDQ3MDc2fQ.3WFdWkkBVmTaTzSDt0OoshdU7LcopVDqlMzA6xJQq9k'
   
    })
    return this.http.get(this.CATEGORY_DROP_DOWN);
  }
  subCategoryListDropDown(id:any){
    const httpHeader=new HttpHeaders({
    'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTAxYjE1NmYwYmM1MmI4MTUzNTRiZiIsImlhdCI6MTYzOTQ1NTA3NiwiZXhwIjoxNjQyMDQ3MDc2fQ.3WFdWkkBVmTaTzSDt0OoshdU7LcopVDqlMzA6xJQq9k'
  
   })
   return this.http.post(this.SUB_CATEGORY_DROP_DOWN,{cat_id:id});
 }
 subSubCategoryListDropDown(id:any){
  const httpHeader=new HttpHeaders({
  'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTAxYjE1NmYwYmM1MmI4MTUzNTRiZiIsImlhdCI6MTYzOTQ1NTA3NiwiZXhwIjoxNjQyMDQ3MDc2fQ.3WFdWkkBVmTaTzSDt0OoshdU7LcopVDqlMzA6xJQq9k'

 })
 return this.http.post(this.SUB_SUB_CATEGORY_DROP_DOWN,{cat_id:id});
}
}
