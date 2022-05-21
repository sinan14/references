import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FoliofitServiceService {

  public API = environment.apiUrl;

  //VARIABLES
  public GET_FOLIOFIT_TESTIMONIALS = this.API + '/foliofit/get_all_foliofit_testimonials'
  public UPDATE_FOLIOFIT_TESTIMONIALS = this.API + '/foliofit/edit_foliofit_testimonial'
  public POST_FOLIOFIT_TESTIMONIALS = this.API + '/foliofit/add_foliofit_testimonial'
  public DELETE_FOLIOFIT_TESTIMONIALS = this.API + '/foliofit/delete_foliofit_testimonial/'


  public GET_YOGA_TESTIMONIALS = this.API + '/foliofit/get_all_yoga_testimonials'
  public UPDATE_YOGA_TESTIMONIALS = this.API + '/foliofit/edit_foliofit_testimonial'
  public POST_YOGA_TESTIMONIALS = this.API + '/foliofit/add_yoga_testimonial'
  public DELETE_YOGA_TESTIMONIALS = this.API + '/foliofit/delete_yoga_testimonial/'


  public GET_WEB_TESTIMONIALS = this.API + '/foliofit/get_all_web_testimonials'
  public UPDATE_WEB_TESTIMONIALS = this.API + '/foliofit/edit_web_testimonial'
  public POST_WEB_TESTIMONIALS = this.API + '/foliofit/add_web_testimonial'
  public DELETE_WEB_TESTIMONIALS = this.API + '/foliofit/delete_web_testimonial/'

  public GET_BMI = this.API + '/foliofit/get_health_calculator'
  public GET_BMI_DT = this.API + '/foliofit/get_date_health_calculator'

  public GET_HEALTH_REMINDER = this.API + '/foliofit/get_health_reminder'
  public GET_HEALTH_REMINDER_DT = this.API + '/foliofit/get_date_health_reminder'

  
  constructor(private http: HttpClient) { }


  //API'S
  GetFoliofitTestimonial() {
    return this.http.get(this.GET_FOLIOFIT_TESTIMONIALS)
  }
  UpdateFoliofitTestimonial(data) {
    return this.http.put(this.UPDATE_FOLIOFIT_TESTIMONIALS, data)
  }
  PostFoliofitTestimonial(data) {
    return this.http.post(this.POST_FOLIOFIT_TESTIMONIALS, data)
  }
  DeleteFoliofitTestimonial(id) {
    return this.http.delete(this.DELETE_FOLIOFIT_TESTIMONIALS + id)
  }



  GetYogaTestimonial() {
    return this.http.get(this.GET_YOGA_TESTIMONIALS)
  }
  UpdateYogaTestimonial(data) {
    return this.http.put(this.UPDATE_FOLIOFIT_TESTIMONIALS, data)
  }
  PostYogaTestimonial(data) {
    return this.http.post(this.POST_YOGA_TESTIMONIALS, data)
  }
  DeleteYogaTestimonial(id) {
    return this.http.delete(this.DELETE_YOGA_TESTIMONIALS + id)
  }



  GetWebTestimonial() {
    return this.http.get(this.GET_WEB_TESTIMONIALS)
  }
  UpdateWebTestimonial(data) {
    return this.http.put(this.UPDATE_WEB_TESTIMONIALS, data)
  }
  PostWebTestimonial(data) {
    return this.http.post(this.POST_WEB_TESTIMONIALS, data)
  }
  DeleteWebTestimonial(id) {
    return this.http.delete(this.DELETE_WEB_TESTIMONIALS + id)
  }



  GetBMI() {
    return this.http.get(this.GET_BMI)
  }
  PostBMI_dt(dt) {
    return this.http.post(this.GET_BMI_DT, dt)
  }


  GetMed(body) {
    return this.http.get(this.GET_HEALTH_REMINDER,body)
  }
  PostMed_dt(dt) {
    return this.http.post(this.GET_HEALTH_REMINDER_DT, dt)
  }

  
}

