import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorHandleService {

  constructor(private toastr: ToastrService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        if (error.status == 422) {
          // console.log("error.error.message : ",error.error.message);
          // console.log("error : ",error.error);
          // Swal
          // this.toastr.warning(error.error.error,'Oops!');
          // console.warn("1",error.error);
          // console.warn("2",error.error.error.errors[0]);
          // console.warn("3",Object.entries(error.error.error.errors)[0][1]['message']);
          
          if (error.error.error && error.error.error.errors) {
            let errorFinal:any = Object.entries(error.error.error.errors)[0][1]['message'];
            console.log("errorFinal",errorFinal);
            
           // Swal.fire('Oops!!!', errorFinal, 'warning');
            this.toastr.warning('Oops!!!', 'Something Went Wrong',{
              timeOut:2000,
              disableTimeOut:false
            });

          } else {
            if (error.error.error && typeof error.error.error.messages !== 'undefined' ) {
              //Swal.fire('Oops!', error.error.error.messages, 'warning');

              this.toastr.warning('Oops!!!',error.error.error.messages,{
                timeOut:2000,
                disableTimeOut:false
              });
  
            } else {
              if (error.error && error.error.result) {
                //Swal.fire('Oops', error.error.result, 'warning'); 
                this.toastr.warning('Oops!!!',  error.error.result,{
                  timeOut:2000,
                  disableTimeOut:false
                });
              }
            }
          }
          
        }
        if (error.status === 401) {
          let baseUrl = environment.apiUrl;
          let path = error.url.replace(baseUrl,'');
          console.log("CROPED", path);
          if (path != "/admin/login") {
            
            let userData = localStorage.getItem('userData');
            localStorage.removeItem('userData');
            window.location.href = '/auth/login';
          }
          
        }
        // window.alert(errorMessage);
        return throwError(errorMessage);
      })
    );
  }


}
