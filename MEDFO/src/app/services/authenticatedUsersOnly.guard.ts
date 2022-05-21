import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserAuthService } from './user-auth.service';
// import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedUsersOnlyGuard implements CanActivate {
  constructor(private _auth: UserAuthService, private _router: Router) {}
  canActivate(): boolean {
    if (this._auth.loggedIn()) {
      // Swal.fire('Are You Sure').then(() => {});
      return true;
    } else {
      //   Swal.fire({
      //     icon: 'warning',
      //     text: 'you are not allowed to do that',
      //     timer: 1500,
      //     showConfirmButton: false,
      //   }).then(() => {
      //     this._router.navigate(['/']);

      //   });
      this._router.navigate(['/']);
      document.getElementById('login-button').click();

      return false;
    }
  }
}
