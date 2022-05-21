import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { UserAuthService } from './user-auth.service';
@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: any, next: any) {
    let authService = this.injector.get(UserAuthService);

    // let tokenizedReq = req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTYyNTg1N2NiYTMyM2Y4NTk1YzExMCIsImlhdCI6MTYzNTU3NTg3MiwiZXhwIjoxNjM4MTY3ODcyfQ.GqpXuiPw-vo64jHNReJZJ0l4Jf3nyayuyW08tFr4Glc`,
    //   },
    // });
    // return next.handle(tokenizedReq);

    if (authService.isHaveToken()) {
      let tokenizedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      });
      return next.handle(tokenizedReq);
    } else {
      let tokenizedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authService.getGuestToken()}`,
        },
      });
      return next.handle(tokenizedReq);
    }
  }
}

//
