import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandListService {
  public API="http://143.110.240.107:8000"
  constructor(private http:HttpClient) { }

  getProductFromBrand(id:any):Observable<any>{
    
return this.http.post(`${this.API}/user/get_web_product_by_brand_id`,{brandId:id,page:1,limit:30});
  }
}
