import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: any, next: any) {
    // let tokenizedReq = req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjYxY2VhNDEzZDIxOTFhZTVlNTg0NjQzNSJ9LCJpYXQiOjE2NDA5MzIzOTIsImV4cCI6MTY0MzUyNDM5Mn0.BIT96myW0XLN-Pry02jLfAuZB9ImI8LQFWnme_7pjRg`,
    //   },
    // });
    // return next.handle(tokenizedReq);

    let authService = this.injector.get(AuthService);
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return next.handle(tokenizedReq);
  }
}
