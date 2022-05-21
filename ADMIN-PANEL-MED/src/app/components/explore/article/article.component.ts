import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { IntlService } from '@progress/kendo-angular-intl';
import * as $ from 'jquery';
import { ActivatedRoute, Router, ParamMap }  from '@angular/router';
import { MedArticleService } from 'src/app/services/med-article.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  
  public API = environment.apiUrl;

  //new variables
  public loading :boolean = false;
  public isCollapsed1 = true;
  public articleList:any = [];
  public mostViewedList:any = [];
  public mostSharedList:any = [];
  public newestList:any = [];
  public trendingList:any = [];
  public homePageMainList:any = [];
  public homePageSubList:any = [];
  public dataLoading :boolean =false;

  public articleMainCategoryList :any = ['All'];
  public subarticleCategoryList :any = [];
  public selectedSubCategory :any;

  public scrollItems = [
    'Headache',
    'Virus Diseases',
    'Cardiac',
    'Back Pain',
    'Mental Health',
    'Kidney',
    'Headache',
    'Virus Diseases',
    'Cardiac',
    'Headache',
    'Virus Diseases',
    'Cardiac',

  ];


  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;
  public addFlag :boolean;


  public closeResult: string;
  constructor(private modalService: NgbModal,
    private _route:Router,
    private intl: IntlService,public activatedRoute: ActivatedRoute,
    private _medarticleService:MedArticleService,
    private permissionService:PermissionService,
    private location: Location,) {
      this.loadDetailsList(); }

  ngOnInit(): void {


    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }


    this.getAllArticleDetails();
    this.getAllArticleCategories();
    this.getAllSubArticleCategories();
    this.getMostViewedList();
    this.getMostSharedList();
    this.getnewestList();
    this.get_trendingList();
    this.gethomepageMainList();
    this.gethomepageSubList();

  }


  
  disableTab(value){
    if(this.user.isAdmin === true){
      let flag = this.permissionService.setPrivilages(value,this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
    else   if(this.user.isStore === true){
      let flag = this.permissionService.setPrivilages(value,this.user.isStore);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
    else{
      let flag = this.permissionService.setPrivilages(value,this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
  }


  loadDetailsList(){
    this.getAllArticleDetails();
    this.getAllArticleCategories();
    this.getAllSubArticleCategories();
    this.getMostViewedList();
    this.getMostSharedList();
    this.getnewestList();
    this.get_trendingList();
    this.gethomepageMainList();
    this.gethomepageSubList();
  }

  getAllArticleCategories(){
    this._medarticleService.get_Main_Article_Categories().subscribe((res:any)=>{
      console.log(res);
      this.articleMainCategoryList = res.data;
    })
  }

  getAllSubArticleCategories(){
    this._medarticleService.get_Sub_Article_Categories_list().subscribe((res:any)=>{
      console.log(res);
      this.subarticleCategoryList = res.data;
    })
    
  }

  //Listing

  getAllArticleDetails(){
    this._medarticleService.get_all_article_details().subscribe((res:any)=>{
      console.log(res);
      this.articleList = res.data.reverse();
    })
  }

  getMostViewedList(){
    this._medarticleService.get_most_viewed_details().subscribe((res:any)=>{
      console.log(res);
      this.mostViewedList = res.data.most_viewed_articles.reverse();
    })
  }

  getMostSharedList(){
    this._medarticleService.get_most_shared_details().subscribe((res:any)=>{
      console.log(res);
      this.mostSharedList = res.data.most_shared_articles.reverse();
    })
  }

  getnewestList(){
    this._medarticleService.get_newest_details().subscribe((res:any)=>{
      console.log(res);
      this.newestList = res.data.reverse();
    })
  }

  get_trendingList(){
    this._medarticleService.get_trending_details().subscribe((res:any)=>{
      console.log(res);
      this.trendingList = res.data.reverse();
    })
  }

  gethomepageMainList(){
    this._medarticleService.get_home_page_main_details().subscribe((res:any)=>{
      console.log(res);
      this.homePageMainList = res.data.reverse();
    })
  }

  gethomepageSubList(){
    this._medarticleService.get_home_page_sub_details().subscribe((res:any)=>{
      console.log(res);
      this.homePageSubList = res.data.reverse();
    })
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  

  newArticle(){
    this._route.navigate(['/explore/create-article'])
  }

  editArticle(id){
    this.loading = true;
    this._route.navigate(['/explore/edit-article', id])
    this.loading = false;
  }

  viewArticle(id){
    if(this.viewFlag){
      this._route.navigate(['/explore/view-article', id , 'view'])
    }
  }

  searchArticleFilter(value:any){
      if(value != ''){
        let input={
          'keyword':value
        }

        this._medarticleService.search_article_detaisl(input).subscribe((res:any)=>{
          console.log(res);
          this.articleList = res.data.article_list;
          this.mostViewedList = res.data.article_list;
          this.mostSharedList = res.data.article_list;
          this.newestList = res.data.article_list;
          this.trendingList = res.data.article_list;
          this.homePageMainList = res.data.article_list;
          this.homePageSubList = res.data.article_list;
        })
      }
      else{
        this.getAllArticleDetails();
        this.getMostViewedList();
        this.getMostSharedList();
        this.getnewestList();
        this.get_trendingList();
        this.gethomepageMainList();
        this.gethomepageSubList();
      }
  }

  selectChangeCategory(value){
    if(value != 'all'){
      this.getArticleByMainCategory(value);
      this._medarticleService.get_single_sub_article_category(value).subscribe((res:any)=>{
        console.log(res);
        if(res){
          this.subarticleCategoryList = res.data;
        }
        else{
          this.subarticleCategoryList = [];
          this.selectedSubCategory = '';
        }
      })
    }
    else if(value === 'all'){
      this.getAllSubArticleCategories();
      this.getAllArticleDetails();
      this.selectedSubCategory = '';
    }
    else{
      this.subarticleCategoryList = [];
      this.ngOnInit();
      this.selectedSubCategory = '';
    }
  }


  getArticleByMainCategory(id){
    this._medarticleService.get_article_by_category(id).subscribe((res:any)=>{
      console.log(res);
      this.articleList = res.data;
      this.mostViewedList = res.data;
      this.mostSharedList = res.data;
      this.newestList = res.data;
      this.trendingList = res.data;
      this.homePageMainList = res.data;
      this.homePageSubList = res.data;
    })
  }

  deleteArticle(id){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor:  '#d33',
      cancelButtonColor:'#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this._medarticleService.delete_article_details(id).subscribe((res)=>{
          console.log(res);
          Swal.fire({
            text: ' Article  Deleted',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 50,
        });
          this.loadDetailsList();
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


    
  }

  selectSubCategory(val){
    this.dataLoading = true;
    this.selectedSubCategory = val;
    let input={
      'categories':val
    }
    this._medarticleService.get_article_by_subcategory(input).subscribe((res:any)=>{
      console.log(res)
      this.articleList = res.data;
      this.dataLoading = false;
    })
  }

}
