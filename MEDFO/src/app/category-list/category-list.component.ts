import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryListService } from 'src/app/services/category-list.service';
import { textChangeRangeIsUnchanged } from 'typescript';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  metatitle: any;
  metadescription: any;

  public Category_List_Array: any = []
  public bannerType: any
  public bannerId: any
  public Cat_Id: any

  
  constructor(private Category_List_Service: CategoryListService,
    private http: HttpClient,
    private router: Router,
    private titleService: Title,
    private metaService: Meta) { }

  ngOnInit(): void {
    this.metatitle = "Medimall Categories";
    // this.metadescription = ;
    this.titleService.setTitle(this.metatitle);
    this.get_web_categories()

    const items = document.querySelectorAll('.accordion a');
    function toggleAccordion() {
      this.classList.toggle('active');
      // //console.log(' why class does not ins');
      this.nextElementSibling.classList.toggle('active');
    }
    items.forEach((item) => item.addEventListener('click', toggleAccordion));



  }
  ngAfterViewInit() {
    this.titleService.setTitle("Medimall");
  }


  public Banner_Image: any = ''

  get_web_categories() {
    console.log("its called");
    this.Category_List_Service.get_web_categories().subscribe((res: any) => {
      console.log(res);
      this.Category_List_Array = []
      this.Banner_Image = ''
      this.bannerId = ''
      this.Cat_Id = ''

      
      this.bannerType = ''
      // console.log(res, "res cat");
      this.Category_List_Array = res.data
      this.Banner_Image = res.banner.image
      this.bannerType = res.banner.redirection_type
      this.bannerId = res.banner.redirection_id
      this.Cat_Id = res.banner.categoryId

    })
  }

  Sub_Category(id) {
    console.log(id);
    this.router.navigate(['/product-list/' + id ,'',''])
    // this.titleService.setTitle("Medimall");
  }


  bannerClick() {
    if (this.bannerType == "product") {
      this.router.navigate(['/product-detail/' + this.bannerId]);
      // this.titleService.setTitle("Medimall");
    }
    else if (this.bannerType == "category") {
      this.Sub_Category(this.Cat_Id);
      // this.pro.getProduct(this.bannerCatId).subscribe((res:any)=>{
      //   const categoryArray=res.data.category;
      //   const categoryItem=categoryArray.map((item:any)=>item._id);
      //   this.bannerId1=categoryItem.find((item:any)=>item==this.bannerId)

      //   console.log(this.bannerId1);
      //   this.productListing(this.bannerId1);
    }

  }





}






