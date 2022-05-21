import { Component, OnInit,ViewChild, Output } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MedArticleService } from 'src/app/services/med-article.service';
import * as $ from 'jquery';
import { MultiSelectComponent } from "@progress/kendo-angular-dropdowns";
import { environment } from 'src/environments/environment.prod';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { DialogComponent } from './dailog.component';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit {

  public pasteCleanupSettings = {
    convertMsLists: false,
    removeHtmlComments: true,
    // stripTags: ['span', 'h1'],
    // removeAttributes: ['lang'],
    removeMsClasses: false,
    removeMsStyles: false,
    removeInvalidHTML: false,
  };
  public API = environment.apiUrl;

 

  @ViewChild("multiselect") public multiselect: MultiSelectComponent;
  @ViewChild('upload') public dialog: DialogComponent;
  @Output() @ViewChild('editor') public editor: EditorComponent;

  //new variables
  public loading :boolean = false;
  public addLoading:boolean = false;
  public imageUploadLoading :boolean = false;
  public createArticleForm:FormGroup;
  public uploadImage:any;
  public image_URL:any;
  public attemptedSubmit: any;
  public articleCategoryList :any = [];
  public articleID:any;
  public editMode :boolean;
  public allList :any = [];
  public disabledFlag :boolean;
  public editorEnable :boolean ;
  
  public selectedArticle :any = [];
  public selectedProduct :any = [];
  public selectedTaggedCategory :any = [];

  public selectedArticleValues:any ;
  public selectedProductsValues:any ;
  public selectedCategoriesValues:any;
  public selectedSubCategoryValues:any;

  public selectedCategory :any = [];
  public productsList :any = [];
  public articleList :any = [];
  public taggedCategories :any = [];

  public listArticle: Array<string> = ['Artilce 1', 'Artilce 2', 'Artilce 3','Artilce 4'];
  public listProduct: Array<string> = ['FaceWash', 'ToothPaste', 'Panjaka Kasthuri','Face Mask'];


  public value = ``;

  constructor(private _router: Router,
    private formBuilder:FormBuilder,
    private _medarticleService:MedArticleService,
    public activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {

    
    this.createArticleForm = this.formBuilder.group({
      categoryname: ['',Validators.required],
      heading: ['',Validators.required],
      readtime: ['',Validators.required],
      verified: [false,Validators.required],
      metatitle: [''],
      metadescription: [''],
      image: ['',Validators.required],
      related_articles: [''],
      related_products: [''],
      categories: [''],
      reviewedby: [''],
      authorname: ['',Validators.required],
      designation: ['',Validators.required],
      trending: [false,Validators.required],
      newest: [false,Validators.required],
      homepage_main: [false,Validators.required],
      homepage_sub: [false,Validators.required],
      description: ['',Validators.required],
    })

    
    this.getAllArticleCategories();
    this.getInvetoryList();
    this.getArticleList();
    this.getTaggedCategories();

    this.activatedRoute.paramMap.subscribe(params => {
      this.articleID = params.get('articleID');
      let view = params.get('viewFlag');
      console.log(this.articleID);
      if(this.articleID){
        if(view === 'view'){
          this.editorEnable = true;
          this.disabledFlag = true;
          this.editMode = false;
          this.getSingle(this.articleID);
          this.disableForms();
        }
        else{
          this.editorEnable = false;
          this.editMode = true;
          this.getSingle(this.articleID);
        }
      }
      else{
        this.editorEnable = false;
        this.editMode = false;
      }
    });



    $(document).ready(function() {
      $(".tab").click(function () {
        $(".tab").removeClass("active");
        $(".tab").addClass("active"); 
      });
    });

  }



  getSingle(id:any){
    
    this.loading = true;
    let data:any = [];
    this._medarticleService.get_single_article_details(id).subscribe((res:any)=>{
      console.log(res);
      data = res.data.article;
      console.log(data);
      this.image_URL =  data.image;
      this.value = data.description;

   

      //value assign
      this.selectedArticle = data.related_articles;
      this.selectedProduct = data.related_products;
      this.selectedTaggedCategory = data.tagged_categories;
      this.selectedSubCategoryValues = data.categories;

      //value saving

      let listSelectCategory:any = [];
      data.categories.forEach((element,index) => {
        listSelectCategory.push(element._id);
      });
      this.selectedCategory = listSelectCategory;

      
      let listArticles:any = [];
      if(data.related_articles != []){
        data.related_articles.forEach((element,index) => {
          listArticles.push(element._id);
        });
        this.selectedArticleValues = listArticles;
      }
      else{
        this.selectedArticleValues = [{"heading":'',"_id":''}];
      }

      let listProducts:any = [];
      if(data.related_products != []){
        data.related_products.forEach((element,index) => {
          listProducts.push(element._id);
        });
        this.selectedProductsValues = listProducts;
      }
      else{
        this.selectedProductsValues = [{"name":'',"_id":''}];
      }

      let listCategory:any = [];
      if(data.tagged_categories != []){
        data.tagged_categories.forEach((element,index) => {
          listCategory.push(element._id);
        });
        this.selectedCategoriesValues = listCategory;
      }
      else{
        this.selectedCategoriesValues = [{"name":'',"_id":''}];
      }

      
      this.value = data.description;
     // this.f.description.setValue(data.description);
      this.f.heading.setValue(data.heading);
      this.f.readtime.setValue(data.readTime);
      this.f.verified.setValue(data.is_verified);
      
      this.f.metatitle.setValue(data.metaTitle ? data.metaTitle : '' );
      this.f.metadescription.setValue(data.metaDescription ? data.metaDescription : '');

      this.f.authorname.setValue(data.authorName);
      this.f.reviewedby.setValue(data.reviewedBy);
      this.f.trending.setValue(data.trending);
      this.f.newest.setValue(data.newest);
      this.f.homepage_main.setValue(data.homepageMain);
      this.f.homepage_sub.setValue(data.homepageSub);
      this.f.designation.setValue(data.designation);
     
      this.loading = false;
    });

  }



  get f(){
    return this.createArticleForm.controls;
  }

 
  disableForms(){
    this.createArticleForm.controls['categoryname'].disable();
    this.createArticleForm.controls['heading'].disable();
    this.createArticleForm.controls['readtime'].disable();
    this.createArticleForm.controls['verified'].disable();
    this.createArticleForm.controls['metatitle'].disable();
    this.createArticleForm.controls['metadescription'].disable();
    this.createArticleForm.controls['image'].disable();
    this.createArticleForm.controls['related_articles'].disable();
    this.createArticleForm.controls['related_products'].disable();
    this.createArticleForm.controls['categories'].disable();
    this.createArticleForm.controls['reviewedby'].disable();
    this.createArticleForm.controls['authorname'].disable();
    this.createArticleForm.controls['designation'].disable();
    this.createArticleForm.controls['trending'].disable();
    this.createArticleForm.controls['newest'].disable();
    this.createArticleForm.controls['homepage_main'].disable();
    this.createArticleForm.controls['homepage_sub'].disable();
  }



 
  getAllArticleCategories(){
    this._medarticleService.getArticleCategoriesDetails().subscribe((res:any)=>{
      console.log(res);
      this.articleCategoryList = res.data;
    })
  }

  getInvetoryList(){
    this._medarticleService.get_Inventory_List().subscribe((res:any)=>{
      console.log(res);
      this.productsList = res.data;
    })
  }

  getTaggedCategories(){
    this._medarticleService.get_Main_Article_Categories().subscribe((res:any)=>{
      console.log(res);
      this.taggedCategories = res.data;
    })
  }

  getArticleList(){
    this._medarticleService.get_Article_List().subscribe((res:any)=>{
      console.log(res);
      this.articleList = res.data;
    })
  }

  


  save(): void {
    
    if(this.createArticleForm.invalid){
      return;
    }
    this.addLoading = true;
    const formData = new FormData();
    if(this.selectedArticleValues != undefined && this.selectedProductsValues != undefined && this.selectedCategoriesValues != undefined){
          
      formData.append('heading',this.f.heading.value);
      formData.append('readTime',this.f.readtime.value);

      this.selectedCategory.forEach((element,index) => {
        formData.append('categories['+index+']',element);
      });

      if(this.f.metatitle.value !=''){
        formData.append('metaTitle',this.f.metatitle.value);
      }

      if(this.f.metadescription.value !=''){
        formData.append('metaDescription',this.f.metadescription.value);
      }

      formData.append('is_verified',this.f.verified.value);
      formData.append('image',this.uploadImage);

      this.selectedArticleValues.forEach((element,index) => {
        formData.append('related_articles['+index+']',element);
      });
      
      this.selectedProductsValues.forEach((element,index) => {
        formData.append('related_products['+index+']',element);
      });

      this.selectedCategoriesValues.forEach((element,index) => {
        formData.append('tagged_categories['+index+']',element);
      });
     
      // formData.append('related_products[0]',this.selectedProductsValues);
      // formData.append('tagged_categories[0]',this.selectedCategoriesValues);
      if(this.f.reviewedby.value != ''){
        formData.append('reviewedBy',this.f.reviewedby.value);
      }
      formData.append('authorName',this.f.authorname.value);
      formData.append('designation',this.f.designation.value);
      formData.append('trending',this.f.trending.value);
      formData.append('newest',this.f.newest.value);
      formData.append('homepageMain',this.f.homepage_main.value);
      formData.append('homepageSub',this.f.homepage_sub.value);
      formData.append('description',this.f.description.value);
    }
    else  if(this.selectedArticleValues == undefined && this.selectedProductsValues == undefined  && this.selectedCategoriesValues != undefined){
          
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);

        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        //formData.append('categories[0]',this.selectedCategory);

        if(this.f.metatitle.value !=''){
          formData.append('metaTitle',this.f.metatitle.value);
        }
  
        if(this.f.metadescription.value !=''){
          formData.append('metaDescription',this.f.metadescription.value);
        }


        formData.append('is_verified',this.f.verified.value);
        formData.append('image',this.uploadImage);

      
        this.selectedCategoriesValues.forEach((element,index) => {
          formData.append('tagged_categories['+index+']',element);
        });
       
        // formData.append('related_products[0]',this.selectedProductsValues);
        // formData.append('tagged_categories[0]',this.selectedCategoriesValues);
        if(this.f.reviewedby.value != ''){
          formData.append('reviewedBy',this.f.reviewedby.value);
        }
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }


      else  if(this.selectedArticleValues == undefined && this.selectedProductsValues != undefined  && this.selectedCategoriesValues == undefined){
          
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);

        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        //formData.append('categories[0]',this.selectedCategory);
        formData.append('is_verified',this.f.verified.value);

        if(this.f.metatitle.value !=''){
          formData.append('metaTitle',this.f.metatitle.value);
        }
  
        if(this.f.metadescription.value !=''){
          formData.append('metaDescription',this.f.metadescription.value);
        }

        formData.append('image',this.uploadImage);

        this.selectedProductsValues.forEach((element,index) => {
          formData.append('related_products['+index+']',element);
        });
       
        // formData.append('related_products[0]',this.selectedProductsValues);
        // formData.append('tagged_categories[0]',this.selectedCategoriesValues);
        if(this.f.reviewedby.value != ''){
          formData.append('reviewedBy',this.f.reviewedby.value);
        }
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }

      else  if(this.selectedArticleValues != undefined && this.selectedProductsValues == undefined  && this.selectedCategoriesValues == undefined){
          
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);

        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        //formData.append('categories[0]',this.selectedCategory);
        formData.append('is_verified',this.f.verified.value);

        if(this.f.metatitle.value !=''){
          formData.append('metaTitle',this.f.metatitle.value);
        }
  
        if(this.f.metadescription.value !=''){
          formData.append('metaDescription',this.f.metadescription.value);
        }


        formData.append('image',this.uploadImage);

        this.selectedArticleValues.forEach((element,index) => {
          formData.append('related_articles['+index+']',element);
        });
       
        // formData.append('related_products[0]',this.selectedProductsValues);
        // formData.append('tagged_categories[0]',this.selectedCategoriesValues);
        if(this.f.reviewedby.value != ''){
          formData.append('reviewedBy',this.f.reviewedby.value);
        }
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }

      else  if(this.selectedArticleValues != undefined  && this.selectedProductsValues == undefined  && this.selectedCategoriesValues != undefined){
          
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);

        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        //formData.append('categories[0]',this.selectedCategory);
        formData.append('is_verified',this.f.verified.value);

        if(this.f.metatitle.value !=''){
          formData.append('metaTitle',this.f.metatitle.value);
        }
  
        if(this.f.metadescription.value !=''){
          formData.append('metaDescription',this.f.metadescription.value);
        }

        formData.append('image',this.uploadImage);

        this.selectedArticleValues.forEach((element,index) => {
          formData.append('related_articles['+index+']',element);
        });


        this.selectedCategoriesValues.forEach((element,index) => {
          formData.append('tagged_categories['+index+']',element);
        });
       
        // formData.append('related_products[0]',this.selectedProductsValues);
        // formData.append('tagged_categories[0]',this.selectedCategoriesValues);
        if(this.f.reviewedby.value != ''){
          formData.append('reviewedBy',this.f.reviewedby.value);
        }
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }


      else  if(this.selectedArticleValues == undefined  && this.selectedProductsValues != undefined && this.selectedCategoriesValues != undefined){
          
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);

        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        //formData.append('categories[0]',this.selectedCategory);
        formData.append('is_verified',this.f.verified.value);

        if(this.f.metatitle.value !=''){
          formData.append('metaTitle',this.f.metatitle.value);
        }
  
        if(this.f.metadescription.value !=''){
          formData.append('metaDescription',this.f.metadescription.value);
        }


        formData.append('image',this.uploadImage);

        this.selectedProductsValues.forEach((element,index) => {
          formData.append('related_products['+index+']',element);
        });

        
        this.selectedCategoriesValues.forEach((element,index) => {
          formData.append('tagged_categories['+index+']',element);
        });
       
        // formData.append('related_products[0]',this.selectedProductsValues);
        // formData.append('tagged_categories[0]',this.selectedCategoriesValues);
        if(this.f.reviewedby.value != ''){
          formData.append('reviewedBy',this.f.reviewedby.value);
        }
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }


      else  if(this.selectedArticleValues != undefined  && this.selectedProductsValues != undefined  && this.selectedCategoriesValues == undefined){
          
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);

        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        //formData.append('categories[0]',this.selectedCategory);
        formData.append('is_verified',this.f.verified.value);

        if(this.f.metatitle.value !=''){
          formData.append('metaTitle',this.f.metatitle.value);
        }
  
        if(this.f.metadescription.value !=''){
          formData.append('metaDescription',this.f.metadescription.value);
        }

        formData.append('image',this.uploadImage);

        this.selectedArticleValues.forEach((element,index) => {
          formData.append('related_articles['+index+']',element);
        });


        this.selectedProductsValues.forEach((element,index) => {
          formData.append('related_products['+index+']',element);
        });

        
      
        // formData.append('related_products[0]',this.selectedProductsValues);
        // formData.append('tagged_categories[0]',this.selectedCategoriesValues);
        if(this.f.reviewedby.value != ''){
          formData.append('reviewedBy',this.f.reviewedby.value);
        }
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }

      else  if(this.selectedArticleValues === undefined  && this.selectedProductsValues === undefined  && this.selectedCategoriesValues === undefined){
          
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);

        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        //formData.append('categories[0]',this.selectedCategory);
        formData.append('is_verified',this.f.verified.value);

        if(this.f.metatitle.value !=''){
          formData.append('metaTitle',this.f.metatitle.value);
        }
  
        if(this.f.metadescription.value !=''){
          formData.append('metaDescription',this.f.metadescription.value);
        }


        formData.append('image',this.uploadImage);

      
        // formData.append('related_products[0]',this.selectedProductsValues);
        // formData.append('tagged_categories[0]',this.selectedCategoriesValues);
        if(this.f.reviewedby.value != ''){
          formData.append('reviewedBy',this.f.reviewedby.value);
        }
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }

      else{
        
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);

        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        this.selectedArticleValues.forEach((element,index) => {
          formData.append('related_articles['+index+']',element);
        });


        this.selectedProductsValues.forEach((element,index) => {
          formData.append('related_products['+index+']',element);
        });
        
        //formData.append('categories[0]',this.selectedCategory);
        formData.append('is_verified',this.f.verified.value);

        if(this.f.metatitle.value !=''){
          formData.append('metaTitle',this.f.metatitle.value);
        }
  
        if(this.f.metadescription.value !=''){
          formData.append('metaDescription',this.f.metadescription.value);
        }


        formData.append('image',this.uploadImage);

        // formData.append('related_products[0]',this.selectedProductsValues);
        // formData.append('tagged_categories[0]',this.selectedCategoriesValues);
        if(this.f.reviewedby.value != ''){
          formData.append('reviewedBy',this.f.reviewedby.value);
        }
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }

       
    
    this._medarticleService.add_article_details(formData).subscribe((res:any)=>{
      console.log(res);
      if(res.status === true){
          Swal.fire({
            text: 'New Article Added',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 50,
          });
          this.addLoading = false;
          this._router.navigate(['/explore/article'])
        }
      else{
        this.addLoading = false;
        Swal.fire({
          text: res.data,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
        this.f.heading.setValue('');
      }
    })


  }

  updateArticle(){



    const formData = new FormData();
    if(this.selectedArticleValues.length !=0 && this.selectedProductsValues.length !=0 && this.selectedCategoriesValues.length !=0){

      
          if(this.uploadImage != undefined){
            formData.append('articleId',this.articleID);
            formData.append('heading',this.f.heading.value);
            formData.append('readTime',this.f.readtime.value);


            this.selectedCategory.forEach((element,index) => {
              formData.append('categories['+index+']',element);
            });

            formData.append('is_verified',this.f.verified.value);

              formData.append('metaTitle',this.f.metatitle.value);
      
              formData.append('metaDescription',this.f.metadescription.value);

            formData.append('image',this.uploadImage);

            this.selectedArticleValues.forEach((element,index) => {
              formData.append('related_articles['+index+']',element);
            });
            
            this.selectedProductsValues.forEach((element,index) => {
              formData.append('related_products['+index+']',element);
            });

            this.selectedCategoriesValues.forEach((element,index) => {
              formData.append('tagged_categories['+index+']',element);
            });
          


            
          formData.append('reviewedBy',this.f.reviewedby.value);
            formData.append('authorName',this.f.authorname.value);
            formData.append('designation',this.f.designation.value);
            formData.append('trending',this.f.trending.value);
            formData.append('newest',this.f.newest.value);
            formData.append('homepageMain',this.f.homepage_main.value);
            formData.append('homepageSub',this.f.homepage_sub.value);
            formData.append('description',this.f.description.value);

          }

          else{
            formData.append('articleId',this.articleID);
            formData.append('heading',this.f.heading.value);
            formData.append('readTime',this.f.readtime.value);

            this.selectedCategory.forEach((element,index) => {
              formData.append('categories['+index+']',element);
            });


            formData.append('is_verified',this.f.verified.value);

              formData.append('metaTitle',this.f.metatitle.value);
      
              formData.append('metaDescription',this.f.metadescription.value);

            formData.append('image','null');

            this.selectedArticleValues.forEach((element,index) => {
              formData.append('related_articles['+index+']',element);
            });
            
            this.selectedProductsValues.forEach((element,index) => {
              formData.append('related_products['+index+']',element);
            });

            this.selectedCategoriesValues.forEach((element,index) => {
              formData.append('tagged_categories['+index+']',element);
            });
          


            
          formData.append('reviewedBy',this.f.reviewedby.value);
            formData.append('authorName',this.f.authorname.value);
            formData.append('designation',this.f.designation.value);
            formData.append('trending',this.f.trending.value);
            formData.append('newest',this.f.newest.value);
            formData.append('homepageMain',this.f.homepage_main.value);
            formData.append('homepageSub',this.f.homepage_sub.value);
            formData.append('description',this.f.description.value);

          }
    }


    else if(this.selectedArticleValues.length == 0 && this.selectedProductsValues.length == 0 && this.selectedCategoriesValues.length != 0){
      if(this.uploadImage != undefined){
      
            formData.append('articleId',this.articleID);
            formData.append('heading',this.f.heading.value);
            formData.append('readTime',this.f.readtime.value);


            this.selectedCategory.forEach((element,index) => {
              formData.append('categories['+index+']',element);
            });

            formData.append('is_verified',this.f.verified.value);
            
              formData.append('metaTitle',this.f.metatitle.value);
      
              formData.append('metaDescription',this.f.metadescription.value);

            formData.append('image',this.uploadImage);


            this.selectedCategoriesValues.forEach((element,index) => {
              formData.append('tagged_categories['+index+']',element);
            });
          


            
          formData.append('reviewedBy',this.f.reviewedby.value);
            formData.append('authorName',this.f.authorname.value);
            formData.append('designation',this.f.designation.value);
            formData.append('trending',this.f.trending.value);
            formData.append('newest',this.f.newest.value);
            formData.append('homepageMain',this.f.homepage_main.value);
            formData.append('homepageSub',this.f.homepage_sub.value);
            formData.append('description',this.f.description.value);
      }

      else{
        formData.append('articleId',this.articleID);
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);


        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        formData.append('is_verified',this.f.verified.value);

        formData.append('metaTitle',this.f.metatitle.value);
      
        formData.append('metaDescription',this.f.metadescription.value);



        formData.append('image','null');


        this.selectedCategoriesValues.forEach((element,index) => {
          formData.append('tagged_categories['+index+']',element);
        });
      


        
        formData.append('reviewedBy',this.f.reviewedby.value);
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }

    }


    else if(this.selectedArticleValues.length == 0 && this.selectedProductsValues.length != 0 && this.selectedCategoriesValues.length == 0){
      if(this.uploadImage != undefined){
      
            formData.append('articleId',this.articleID);
            formData.append('heading',this.f.heading.value);
            formData.append('readTime',this.f.readtime.value);


            this.selectedCategory.forEach((element,index) => {
              formData.append('categories['+index+']',element);
            });

            formData.append('is_verified',this.f.verified.value);

            formData.append('metaTitle',this.f.metatitle.value);
      
              formData.append('metaDescription',this.f.metadescription.value);


            formData.append('image',this.uploadImage);


            this.selectedProductsValues.forEach((element,index) => {
              formData.append('related_products['+index+']',element);
            });
          


           
          formData.append('reviewedBy',this.f.reviewedby.value);
            formData.append('authorName',this.f.authorname.value);
            formData.append('designation',this.f.designation.value);
            formData.append('trending',this.f.trending.value);
            formData.append('newest',this.f.newest.value);
            formData.append('homepageMain',this.f.homepage_main.value);
            formData.append('homepageSub',this.f.homepage_sub.value);
            formData.append('description',this.f.description.value);
      }

      else{
        formData.append('articleId',this.articleID);
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);


        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        formData.append('is_verified',this.f.verified.value);

        formData.append('metaTitle',this.f.metatitle.value);
      
        formData.append('metaDescription',this.f.metadescription.value);



        formData.append('image','null');

        this.selectedProductsValues.forEach((element,index) => {
          formData.append('related_products['+index+']',element);
        });


        
        formData.append('reviewedBy',this.f.reviewedby.value);
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }

    }


    else if(this.selectedArticleValues.length != 0 && this.selectedProductsValues.length == 0 && this.selectedCategoriesValues.length == 0){
      if(this.uploadImage != undefined){
      
            formData.append('articleId',this.articleID);
            formData.append('heading',this.f.heading.value);
            formData.append('readTime',this.f.readtime.value);


            this.selectedCategory.forEach((element,index) => {
              formData.append('categories['+index+']',element);
            });

            formData.append('is_verified',this.f.verified.value);

            formData.append('metaTitle',this.f.metatitle.value);
      
              formData.append('metaDescription',this.f.metadescription.value);


            formData.append('image',this.uploadImage);


            this.selectedArticleValues.forEach((element,index) => {
              formData.append('related_articles['+index+']',element);
            });
          


            formData.append('reviewedBy',this.f.reviewedby.value);
            formData.append('authorName',this.f.authorname.value);
            formData.append('designation',this.f.designation.value);
            formData.append('trending',this.f.trending.value);
            formData.append('newest',this.f.newest.value);
            formData.append('homepageMain',this.f.homepage_main.value);
            formData.append('homepageSub',this.f.homepage_sub.value);
            formData.append('description',this.f.description.value);
      }

      else{
        formData.append('articleId',this.articleID);
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);


        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        formData.append('is_verified',this.f.verified.value);

        formData.append('metaTitle',this.f.metatitle.value);
      
              formData.append('metaDescription',this.f.metadescription.value);



        formData.append('image','null');

        this.selectedArticleValues.forEach((element,index) => {
          formData.append('related_articles['+index+']',element);
        });

       
        formData.append('reviewedBy',this.f.reviewedby.value);
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }

    }


    
    else if(this.selectedArticleValues.length != 0 && this.selectedProductsValues.length == 0 && this.selectedCategoriesValues.length != 0){
      if(this.uploadImage != undefined){
      
            formData.append('articleId',this.articleID);
            formData.append('heading',this.f.heading.value);
            formData.append('readTime',this.f.readtime.value);


            this.selectedCategory.forEach((element,index) => {
              formData.append('categories['+index+']',element);
            });

            formData.append('is_verified',this.f.verified.value);

            formData.append('metaTitle',this.f.metatitle.value);
      
            formData.append('metaDescription',this.f.metadescription.value);


            formData.append('image',this.uploadImage);


            this.selectedArticleValues.forEach((element,index) => {
              formData.append('related_articles['+index+']',element);
            });
            
           

            this.selectedCategoriesValues.forEach((element,index) => {
              formData.append('tagged_categories['+index+']',element);
            });


           
          formData.append('reviewedBy',this.f.reviewedby.value);
            formData.append('authorName',this.f.authorname.value);
            formData.append('designation',this.f.designation.value);
            formData.append('trending',this.f.trending.value);
            formData.append('newest',this.f.newest.value);
            formData.append('homepageMain',this.f.homepage_main.value);
            formData.append('homepageSub',this.f.homepage_sub.value);
            formData.append('description',this.f.description.value);
      }

      else{
        formData.append('articleId',this.articleID);
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);


        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        formData.append('is_verified',this.f.verified.value);

        formData.append('metaTitle',this.f.metatitle.value);
      
              formData.append('metaDescription',this.f.metadescription.value);


        formData.append('image','null');

    

        this.selectedArticleValues.forEach((element,index) => {
          formData.append('related_articles['+index+']',element);
        });
        
       

        this.selectedCategoriesValues.forEach((element,index) => {
          formData.append('tagged_categories['+index+']',element);
        });


       
        formData.append('reviewedBy',this.f.reviewedby.value);
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }

    }


    else if(this.selectedArticleValues.length == 0 && this.selectedProductsValues.length != 0 && this.selectedCategoriesValues.length != 0){
      if(this.uploadImage != undefined){
      
            formData.append('articleId',this.articleID);
            formData.append('heading',this.f.heading.value);
            formData.append('readTime',this.f.readtime.value);


            this.selectedCategory.forEach((element,index) => {
              formData.append('categories['+index+']',element);
            });

            formData.append('is_verified',this.f.verified.value);

            formData.append('metaTitle',this.f.metatitle.value);
      
            formData.append('metaDescription',this.f.metadescription.value);


            formData.append('image',this.uploadImage);


            this.selectedProductsValues.forEach((element,index) => {
              formData.append('related_products['+index+']',element);
            });
            
           

            this.selectedCategoriesValues.forEach((element,index) => {
              formData.append('tagged_categories['+index+']',element);
            });


           
          formData.append('reviewedBy',this.f.reviewedby.value);
            formData.append('authorName',this.f.authorname.value);
            formData.append('designation',this.f.designation.value);
            formData.append('trending',this.f.trending.value);
            formData.append('newest',this.f.newest.value);
            formData.append('homepageMain',this.f.homepage_main.value);
            formData.append('homepageSub',this.f.homepage_sub.value);
            formData.append('description',this.f.description.value);
      }

      else{
        formData.append('articleId',this.articleID);
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);


        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        formData.append('is_verified',this.f.verified.value);

        formData.append('metaTitle',this.f.metatitle.value);
      
              formData.append('metaDescription',this.f.metadescription.value);


        formData.append('image','null');

    
        this.selectedProductsValues.forEach((element,index) => {
          formData.append('related_products['+index+']',element);
        });
       

        this.selectedCategoriesValues.forEach((element,index) => {
          formData.append('tagged_categories['+index+']',element);
        });


        
        formData.append('reviewedBy',this.f.reviewedby.value);
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }

    }


    else if(this.selectedArticleValues.length != 0 && this.selectedProductsValues.length != 0 && this.selectedCategoriesValues.length == 0){
      if(this.uploadImage != undefined){
      
            formData.append('articleId',this.articleID);
            formData.append('heading',this.f.heading.value);
            formData.append('readTime',this.f.readtime.value);


            this.selectedCategory.forEach((element,index) => {
              formData.append('categories['+index+']',element);
            });

            formData.append('is_verified',this.f.verified.value);

            formData.append('metaTitle',this.f.metatitle.value);
      
            formData.append('metaDescription',this.f.metadescription.value);

            formData.append('image',this.uploadImage);


            this.selectedArticleValues.forEach((element,index) => {
              formData.append('related_articles['+index+']',element);
            });
            
            this.selectedProductsValues.forEach((element,index) => {
              formData.append('related_products['+index+']',element);
            });


           
          formData.append('reviewedBy',this.f.reviewedby.value);
            formData.append('authorName',this.f.authorname.value);
            formData.append('designation',this.f.designation.value);
            formData.append('trending',this.f.trending.value);
            formData.append('newest',this.f.newest.value);
            formData.append('homepageMain',this.f.homepage_main.value);
            formData.append('homepageSub',this.f.homepage_sub.value);
            formData.append('description',this.f.description.value);
      }

      else{
        formData.append('articleId',this.articleID);
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);


        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });

        formData.append('is_verified',this.f.verified.value);

        formData.append('metaTitle',this.f.metatitle.value);
      
              formData.append('metaDescription',this.f.metadescription.value);



        formData.append('image','null');

    
        this.selectedArticleValues.forEach((element,index) => {
          formData.append('related_articles['+index+']',element);
        });
        
        this.selectedProductsValues.forEach((element,index) => {
          formData.append('related_products['+index+']',element);
        });


       
        formData.append('reviewedBy',this.f.reviewedby.value);
        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);
      }

    }




    else{
          if(this.uploadImage != undefined){
            formData.append('articleId',this.articleID);
            formData.append('heading',this.f.heading.value);
            formData.append('readTime',this.f.readtime.value);


            this.selectedCategory.forEach((element,index) => {
              formData.append('categories['+index+']',element);
            });


            formData.append('related_articles','');
            
            formData.append('related_products','');

            formData.append('tagged_categories','');

            formData.append('is_verified',this.f.verified.value);

            formData.append('metaTitle',this.f.metatitle.value);
      
            formData.append('metaDescription',this.f.metadescription.value);

            formData.append('image',this.uploadImage);

            
          formData.append('reviewedBy',this.f.reviewedby.value);
            formData.append('authorName',this.f.authorname.value);
            formData.append('designation',this.f.designation.value);
            formData.append('trending',this.f.trending.value);
            formData.append('newest',this.f.newest.value);
            formData.append('homepageMain',this.f.homepage_main.value);
            formData.append('homepageSub',this.f.homepage_sub.value);
            formData.append('description',this.f.description.value);

          }

      else{
        formData.append('articleId',this.articleID);
        formData.append('heading',this.f.heading.value);
        formData.append('readTime',this.f.readtime.value);

        this.selectedCategory.forEach((element,index) => {
          formData.append('categories['+index+']',element);
        });


        formData.append('related_articles','');
            
        formData.append('related_products','');

        formData.append('tagged_categories','');

        formData.append('is_verified',this.f.verified.value);

        formData.append('metaTitle',this.f.metatitle.value);
      
        formData.append('metaDescription',this.f.metadescription.value);


        formData.append('image','null');

          formData.append('reviewedBy',this.f.reviewedby.value);

        formData.append('authorName',this.f.authorname.value);
        formData.append('designation',this.f.designation.value);
        formData.append('trending',this.f.trending.value);
        formData.append('newest',this.f.newest.value);
        formData.append('homepageMain',this.f.homepage_main.value);
        formData.append('homepageSub',this.f.homepage_sub.value);
        formData.append('description',this.f.description.value);

      }
    }
   
    this._medarticleService.edit_article_details(formData).subscribe((res:any)=>{
      console.log(res);
      if(res.status === true){
        Swal.fire({
          text: 'Article Updated',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
        this._router.navigate(['/explore/article'])
      }
      else{
        Swal.fire({
          text: 'Something Went Wrong!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
      }
    })


  }


  onChangeCheckBox(value:any,type:any){
    if(type === 'verified_by'){
      this.f.verified.setValue(value);
    }
    else if(type === 'trending'){
      this.f.trending.setValue(value);
    }
    else if(type === 'newest'){
      this.f.newest.setValue(value);
    }
    else if(type === 'homepage_main'){
      this.f.homepage_main.setValue(value);
      Swal.fire({
        text: 'Only one article can be set as home page main, If you already selected any article as home page main it will be deactivated',
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 50,
      });
    }
    else if(type === 'homepage_sub'){
      this.f.homepage_sub.setValue(value);
    }
  }


   //Image Upload
   onChange(event:any,width:any,height:any){
    let setFlag :boolean = false;

    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file); 

    if (file.length === 0) return;
    var mimeType = file.type;
    // File type validation, Only Image file accepted
    if (mimeType.match(/image\/*/) == null) {
      // **** IMAGE ONLY ****
      Swal.fire({
        text: 'Invalid!!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 500,
      });
      this.image_URL = '';
      // console.log("Only images are supported.");
      return;
    }
    


      const Img = new Image();
      Img.src = URL.createObjectURL(file);
    
    
      Img.onload = (e: any) => {
        this.uploadImage = file;
        let content = reader.result as string;
        this.image_URL = content;
        // console.log(e.path[0].naturalHeight);
        // console.log(e.path[0].naturalWidth);
        // if(e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width) ){
        //   setFlag = true;
        //   this.uploadImage = file;
        //   let content = reader.result as string;
        //   this.image_URL = content;
        // }
        // else{
        //   setFlag = true;
        //   Swal.fire({
        //           text: 'Invalid Image Dimension - '+ width +'x' + height,
        //           icon: 'warning',
        //           showCancelButton: false,
        //           confirmButtonText: 'Ok',
        //           confirmButtonColor:  '#3085d6',
        //           imageHeight: 500,
        //         });
        // }
      }

   
  }

  selectChangeSubCategory(value){
    let list :any = [];
    for(let i=0;i<this.selectedSubCategoryValues.length;i++){
      list.push(this.selectedSubCategoryValues[i]['_id'])
    }
    
    this.selectedCategory = list;
    console.log(this.selectedCategory)
  }

  handleFilterSubCategory(value:any){
    if (value.length >= 1) {
      let data :any =[];
      data = this.articleCategoryList.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.articleCategoryList = data;
    }else if(value === ''){
      this.getAllArticleCategories();
    }
    else{
      this.getAllArticleCategories();
      this.articleCategoryList.toggle(false);
    }
  }


  onSelect(event){
    alert(event.target.value);
  }


  //Dropdown Events
 

  handleArticleChange(value:any) {
    let data :any = [];
    for(let i=0;i<this.selectedArticle.length;i++){
      data.push(this.selectedArticle[i]['_id'])
    }
    this.selectedArticleValues = data;
    console.log(this.selectedArticleValues)
    //let this.privilege=this.privileges[index];
    //this.privlgs.push({"privilage":this.privileges[index][0]});
    //this.createJSON(this.privlgs);
    
  }

  handleArticleFilter(value) {
    if (value.length >= 1) {
      let data :any =[];
      data = this.articleList.filter(
        (s) => s.heading.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.articleList = data;
    }else if(value === ''){
      this.getArticleList();
    }
    else{
      this.getArticleList();
      this.articleList.toggle(false);
    }
  }

  handleProductChange(value:any) {
    let data :any = [];
    for(let i=0;i<this.selectedProduct.length;i++){
      data.push(this.selectedProduct[i]['_id'])
    }
    this.selectedProductsValues = data;
    console.log(this.selectedProductsValues)
    //let this.privilege=this.privileges[index];
    //this.privlgs.push({"privilage":this.privileges[index][0]});
    //this.createJSON(this.privlgs);
    
  }

  handleProductFilter(value) {
    if (value.length >= 1) {
      let data :any =[];
      data = this.productsList.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.productsList = data;
    }else if(value === ''){
      this.getInvetoryList();
    }
    else{
      this.getInvetoryList();
      this.productsList.toggle(false);
    }
  }


  handleCategoryChange(value:any) { 
    let data :any = [];
    for(let i=0;i<this.selectedTaggedCategory.length;i++){
      data.push(this.selectedTaggedCategory[i]['_id'])
    }
    this.selectedCategoriesValues = data;
    console.log(this.selectedCategoriesValues)
    //let this.privilege=this.privileges[index];
    //this.privlgs.push({"privilage":this.privileges[index][0]});
    //this.createJSON(this.privlgs);
    
  }

  handleCategoryFilter(value) {
    if (value.length >= 3) {
      let data :any =[];
      data = this.taggedCategories.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.taggedCategories = data;
    }else if(value === ''){
      this.getTaggedCategories();
    }
    else{
      this.getTaggedCategories();
      this.taggedCategories.toggle(false);
    }
  }
  

  public open() {
    this.dialog.open();
  }
 

}
