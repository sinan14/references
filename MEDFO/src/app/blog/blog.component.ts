import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ApiService} from '../../app/services/api.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  
  public closeResult: string;

  main_catgeories: any = [];
  article_list: any = [];
  article_list_length: any = [];
  newestArticles: any = [];
  newestArticles_length: any = 0;
  newestArticles_copy: any = [];
  catid:any=0;
  mySlideOptions = {
    items: 1,
    dots: false,
    nav: false,
    autoplay: true,
    stopOnHover : false,
    transitionStyle: 'fadeUp',
    autoplayTimeout: 10000,
    autoplayHoverPause: true,
    autoplaySpeed: 10000,
    navSpeed: 10000,
    loop: true,
    rewind : true,
    scroll: {
      pauseOnHover: true,
      onBefore: function() {
        $(this).children().removeClass( 'hover' );
      }
    },
  };
  constructor( private api: ApiService,
    private activatedRoute: ActivatedRoute, 
    private http: HttpClient, 
    public  router: Router,) { }

  ngOnInit() {
    window.scroll(0, 0);
    const slider:HTMLElement  = document.querySelector('.tabscroll');

     let isDown = false;

     let startX;

     let scrollLeft;

     

     slider.addEventListener('mousedown', (e:MouseEvent) => {

       isDown = true;

       slider.classList.add('active');

       startX = e.pageX - slider.offsetLeft;

       scrollLeft = slider.scrollLeft;

     });

     slider.addEventListener('mouseleave', () => {

       isDown = false;

       slider.classList.remove('active');

     });

     slider.addEventListener('mouseup', () => {

       isDown = false;

       slider.classList.remove('active');

     });

     slider.addEventListener('mousemove', (e:MouseEvent) => {

       if(!isDown) return;

       e.preventDefault();
       const x = e.pageX - slider.offsetLeft;

       const walk = (x - startX) * 3; //scroll-fast

       slider.scrollLeft = scrollLeft - walk;

       console.log(walk);

     });
    this.activatedRoute.paramMap.subscribe(paramMap => {
      
		    this.catid = paramMap.get('id');
        $("#description-tab-"+this.catid).addClass('active');
        if(!this.catid){
          this.catid = 0;
        }
        this.view_article_list(this.catid);
        document.getElementById('productContent').scrollIntoView();
      });
   
    return this.http.get(this.api.BASEURL+'get_article_categories')
      .subscribe(
        (res: any)  => {
          let result = res;
          for(let i=0;i<result.data.category.length;i++){
            this.main_catgeories = this.main_catgeories.concat(result.data.category[i]);
          }
          //this.main_catgeories= result.data.category[0];
          this.newestArticles= result.data.newestArticles;
          this.newestArticles_length= result.data.newestArticles.length;
          this.newestArticles_copy= result.data.newestArticles;
          //this.view_article_list(this.main_catgeories[0]._id);         
        }, error => {
          console.log('There was an error: ', error);
        });
        
  }
  search_term(){
      $(".tabh").removeClass('active');
      $("#description-tab-0").addClass('active');
      $("#recent").addClass('show active');      
      $("#selfcare").removeClass('show active');
      this.newestArticles = [];
    let search_filed: any = $("#search_filed").val();
    if(search_filed){
      let body_info = {"keyword":search_filed};
      
      return this.http.post( this.api.BASEURL+'searchArticle', body_info,  )
        .subscribe(
          (res: any)  => {
            console.log(res);
            let result = res;
            
            this.newestArticles= result.data.article_list;
          }, error => {
            console.log('There was an error: ', error);
          });
    } else{
      this.newestArticles = this.newestArticles_copy;
    }
    return true;
    
  }
  view_article_list(cid:any){
    
    $(".tabh").removeClass('active');
    $("#description-tab-"+cid).addClass('active');
    if(cid!=0) {
      $("#recent").removeClass('show active');      
      $("#selfcare").addClass('show active');

      let body_info = {"category_id":cid,"page":1,"limit":20};
  
      return this.http.post( this.api.BASEURL+'get_article_listing', body_info  )
        .subscribe(
          (res: any)  => {
            let result = res;
            this.article_list = [];
            this.article_list= result.data.article;
            this.article_list_length= result.data.article.length;
          }, error => {
            console.log('There was an error: ', error);
          });
    }
      $("#recent").addClass('show active');      
      $("#selfcare").removeClass('show active');
      
    return true;
    }
    subcateview(sid){
      $(".tab-subc").removeClass("show active");
      $("#"+sid).addClass("show active");
    } 

    clickShare(){
    }


    // private getDismissReason(reason: any): string {
    //   if (reason === ModalDismissReasons.ESC) {
    //     return 'by pressing ESC';
    //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //     return 'by clicking on a backdrop';
    //   } else {
    //     return `with: ${reason}`;
    //   }
    // }
  
    // open(content) {
    
    //     this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    //       this.closeResult = `Closed with: ${result}`;
    //     }, (reason) => {
    //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //     });
  
  
      
      
    // }
    substr(des){
      des = des.substr(0,10)+'...';
    }

}
