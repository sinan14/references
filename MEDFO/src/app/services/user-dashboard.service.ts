import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDashboardService {
  public hrefBeforeGoingToReferAndEarn: string =
    '/dashboard-order-details/profile';
  familyMemberChanged = new EventEmitter<any>();
  familyUpdated = new EventEmitter<boolean>();
  personalUpdated = new EventEmitter<boolean>();
  public familyMemberId: any = 'false';
  clickedFamilyMember(id) {
    this.familyMemberId = id;
    this._router.navigate(['/dashboard-order-details/add-family']);
    if (id !== 'false') {
      this.getOneUserFamilyDetails(id).subscribe(
        (res: any) => {
          console.log(res.data);
          if (res.error === false) {
            this.familyMemberChanged.emit(JSON.parse(JSON.stringify(res.data)));
          } else {
          }
        },
        (err: any) => {}
      );
    } else {
      this.familyMemberChanged.emit(false);
    }
  }
  refreshFamily() {
    this.familyUpdated.emit(true);
  }
  refreshPerson() {
    this.personalUpdated.emit(true);
  }

  public API = environment.baseUrl;
  public personal_info: any = {};
  familyMembers: any = {};

  constructor(private http: HttpClient, private _router: Router) {}

  getPersonalInfo() {
    return this.http.get(`${this.API}/user/get_user_personal_details`);
  }
  getPersonalDetails() {
    this.getPersonalInfo().subscribe(
      (res: any) => {
        console.log(res);
        console.log('hoooooooooooooo');
        if (res.error == false) {
          this.personal_info = JSON.parse(JSON.stringify(res.data));
          console.log(this.personal_info);
        } else {
          console.log('onh no error');
        }
      },
      (error: any) => {
        console.log('oh no error occure from server');
        console.log(error);
      }
    );
  }
  getFamilyMembers() {
    this.getUserFamilyDetails().subscribe(
      (res: any) => {
        console.log(res);

        if (res.error === false) {
          this.familyMembers = JSON.parse(JSON.stringify(res.data));
        } else {
          console.log(res);
          this.familyMembers = [];
        }
      },
      (err: any) => {
        console.log('server refused to connect');
      }
    );
  }
  addPersonalInfo(data) {
    return this.http.post(`${this.API}/user/add_user_personal_details`, data);
  }
  getMedicalInfo() {
    return this.http.get(`${this.API}/user/get_user_medical_details`);
  }
  addMedicalInfo(data) {
    return this.http.post(`${this.API}/user/add_user_medical_details`, data);
  }

  updateUserImage(image) {
    return this.http.post(`${this.API}/user/update_user_image`, image);
  }
  changeUserPassword(newPassword) {
    return this.http.post(`${this.API}/user/change_user_password`, newPassword);
  }
  uploadReasonForNotCompletingPersonalForm(reason) {
    return this.http.post(`${this.API}/user/add_user_profile_feedback`, reason);
  }
  getUserFamilyDetails() {
    return this.http.get(`${this.API}/user/get_user_family`);
  }
  addUserFamilyDetails(details) {
    return this.http.post(`${this.API}/user/add_user_family`, details);
  }
  editUserFamilyDetails(details) {
    return this.http.put(`${this.API}/user/edit_user_family`, details);
  }
  getOneUserFamilyDetails(id) {
    return this.http.post(`${this.API}/user/get_user_family_by_id/`, {
      id: id,
    });
  }
  deleteOneUserFamilyDetails(details_id) {
    return this.http.delete(
      `${this.API}/user/delete_user_family/${details_id}`
    );
  }

  //refer-and-earn modal api

  fetchReferraldetails() {
    return this.http
      .get(`${this.API}/user/get_referral_details`)
      .pipe(catchError(this.handleError));
  }

  exitFromReferAndEarn() {
    this._router.navigate([this.hrefBeforeGoingToReferAndEarn]);
  }
  openReferAndEarn() {
    this.hrefBeforeGoingToReferAndEarn = this._router.url;
    console.log(this.hrefBeforeGoingToReferAndEarn);
    console.log(this._router.url);
    if (
      this.hrefBeforeGoingToReferAndEarn ==
      '/dashboard-order-details/refer-and-earn'
    ) {
      document.getElementById('open-modal').click();
    } else {
      this._router.navigate(['/dashboard-order-details/refer-and-earn']);
    }
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  public referalData: any = '';
  fetchReferAndEarn() {
    this.fetchReferraldetails().subscribe(
      (res: any) => {
        console.log(res);
        if (res.error === false) {
          this.referalData = JSON.parse(JSON.stringify(res.data));
        } else {
          //
        }
      },
      (err: any) => {
        console.log('server refused to connect');
      }
    );
  }
}
