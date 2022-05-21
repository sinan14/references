import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderMedicineService {
  public API="http://143.110.240.107:8000"
  constructor(private http:HttpClient) { }

  getActiveMedicine():Observable<any>{
       const httpHeader=new HttpHeaders({
      'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTAxYjE1NmYwYmM1MmI4MTUzNTRiZiIsImlhdCI6MTYzNzkwNjk2MiwiZXhwIjoxNjQwNDk4OTYyfQ.WkuonFCZUY_5RW3stprISPJczEFo4783RJNyqiOkWuU'
    })
return this.http.get(`${this.API}/user/get_active_medicine_categories`,{headers:httpHeader});
  }
  getOrderMedicine():Observable<any>{
    const httpHeader=new HttpHeaders({
   'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTYyNTg1N2NiYTMyM2Y4NTk1YzExMCIsImlhdCI6MTYzNzkyMTAwNCwiZXhwIjoxNjQwNTEzMDA0fQ.9EijjOQrfK_wvoClGacU74f74x6ZfyZglohSPVtKX0o'
 })
return this.http.get(`${this.API}/user/get_web_order_medicine_online`,{headers:httpHeader});
}
}