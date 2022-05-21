import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import * as $ from 'jquery';
import {ApiService} from '../../app/services/api.service'
import {ActivatedRoute, Params, Router, NavigationEnd} from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {

  metatitle :any;
  metadescription :any;
  likeFlag :boolean = false;
  ad: any = [];
  trendingArticles: any = [];
  main_catgeories: any = [];
  newestArticles: any = [];
  article_id:any = '';
  myCarouselOptions = {
    items: 3,
     loop: true,
     margin: 30,
     nav: true,
     autoplay: true,
    stopOnHover : false,
    paginationSpeed : 5000,
    transitionStyle: 'fadeUp',
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    autoplaySpeed: 2000,
    navSpeed: 2000,
    rewind : true,
     dots:false,
     smartSpeed: 900,
     navText: ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
     responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },

  };
  constructor(private api: ApiService,private activatedRoute: ActivatedRoute, private http: HttpClient, public  router: Router,
    private titleService: Title, private metaService: Meta,public sanitizer: DomSanitizer) { }

  ngOnInit() {

    // this.router.events.subscribe((event: NavigationEnd) => {
    //   window.scroll(0, 0);

    // });
    this.activatedRoute.paramMap.subscribe(paramMap => {
      
		  this.article_id = paramMap.get('id');
      let body_info = {"article_id":this.article_id};
    
      this.http.post( this.api.BASEURL+'get_article_detail', body_info  )
        .subscribe(
          (res: any)  => {
            this.ad = [];
            let result = res;

             //meta title and description
            if(result.data.article_detail.metaTitle != undefined){
              this.titleService.setTitle(result.data.article_detail.metaTitle === undefined ? 'Medimall - Blog' : result.data.article_detail.metaTitle);
              this.metaService.addTag(
                {name: 'description', content: result.data.article_detail.metaDescription === undefined ? 'Medimall - Blog' : result.data.article_detail.metaDescription},
              );
 
            }
           

            this.metatitle = result.data.article_detail.metaTitle;
            this.metadescription = result.data.article_detail.metaDescription;
            if(result.data.article_detail.is_liked ===0){
              this.likeFlag = true;
            }
            else{
              this.likeFlag = false;
            }
            this.ad=result.data.article_detail;

          }, error => {
            console.log('There was an error: ', error);
          });
      });
    
      //get articles
      this.get_articles();
     
  }
  get_articles(){
    
    this.http.get( this.api.BASEURL+'get_article_categories'  )
    .subscribe(
      (res: any)  => {
        let result = res;
        for(let i=0;i<result.data.category.length;i++){
          this.main_catgeories = this.main_catgeories.concat(result.data.category[i]);
        }
        this.trendingArticles= result.data.trendingArticles;
        this.newestArticles= result.data.newestArticles;
        //this.view_article_list(this.main_catgeories[0]._id);
      }, error => {
        console.log('There was an error: ', error);
      });
     // $(".owl-prev").html('<i class="fa fa-chevron-left"></i>');
//$(".owl-next").html('<i class="fa fa-chevron-right"></i>');
  }
  update_like_status(){
  
    let body_info = {"id":this.article_id,"type":this.ad.type};console.log(body_info);
      this.http.post( this.api.BASEURL+'like_unlike' , body_info  )
      .subscribe(
        (res: any)  => {
          let result = res;
          console.log(res);
          this.ngOnInit();
        }, error => {
          console.log('There was an error: ', error);
        });
  }
  share_now(){
   
     let body_info = {"id":this.article_id,"type":this.ad.type};
      this.http.post( this.api.BASEURL+'share' , body_info )
      .subscribe(
        (res: any)  => {
          
        }, error => {
          console.log('There was an error: ', error);
        });
  }

  likeButton(i){
    if(this.likeFlag){
      this.likeFlag = false;
      this.update_like_status();
    }
    else{
      this.likeFlag = true;
      this.update_like_status();
    }
  }

  redirectToProductDetail(prod){
    this.router.navigate(['/product-detail/',prod.title, prod._id, prod.brand , prod.brand])
  }

}
