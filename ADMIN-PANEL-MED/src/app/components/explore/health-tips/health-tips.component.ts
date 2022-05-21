import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { HealthTipService } from 'src/app/services/health-tip.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-health-tips',
  templateUrl: './health-tips.component.html',
  styleUrls: ['./health-tips.component.scss']
})
export class HealthTipsComponent implements OnInit ,OnDestroy{

  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;
  public addFlag :boolean;

  public categories: any = [];
  public selectedCategoryId: any = "";

  public healthTips: any = [];
  public healthTipsCount = {
    allHealthTip:0,
    mostViewed:0,
    mostShared:0,
    newest:0,
    trending:0
  }

  public mostSharedHealthTips: any = [];
  public mostViewedHealthTips: any = [];
  public homePageMainHealthTips: any = [];
  public homePageSubHealthTips: any = [];
  public loading: boolean = false;


  public selectedHealthTip: any = null;
  public selectedTab: any = "all";

  public searchMode: boolean = false;
  public searchQuery: string = null;

  public uploadedThumbnailImage: any = null;
  public uploadedThumbnailImagePreview: any = null;

  searchTerm$ = new Subject<string>();

  public closeResult: string;
  constructor(
    private modalService: NgbModal,
    private _route: Router,
    private healthTipService: HealthTipService,
    private permissionService:PermissionService,
    private location: Location,
    // private intl: IntlService
    
  ) { 
    this.healthTipService.search(this.searchTerm$).subscribe(res => {
      this.healthTips = res.data
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }


    this.loadTips();
    this.loadCategories();
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

  

  ngOnDestroy() {
    this.searchTerm$.unsubscribe()
}

  loadTips() {
    this.loading = true;
    console.log(this.selectedTab);

    this.loadCount();

    switch (this.selectedTab) {
      case "all":
        this.healthTipService.getAll(this.selectedCategoryId).subscribe(res => {
          this.healthTips = res.data;
          this.loading = false;
        });
        break;
      case "mostViewed":
        this.healthTipService.getMostViewed(this.selectedCategoryId).subscribe(res => {
          this.healthTips = res.data;
          this.loading = false;
        });
        break;
      case "mostShared":
        this.healthTipService.getMostShared(this.selectedCategoryId).subscribe(res => {
          this.healthTips = res.data;
          this.loading = false;
        });
        break;
      case "newest":
        this.healthTipService.getNewest(this.selectedCategoryId).subscribe(res => {
          this.healthTips = res.data;
          this.loading = false;
        });
        break;
      case "trending":
        this.healthTipService.getTrending(this.selectedCategoryId).subscribe(res => {
          this.healthTips = res.data;
          this.loading = false;
        });
        break;
    }
    
    
    // this.healthTipService.getAll(this.selectedCategoryId).subscribe( res => {
    //   this.healthTips = res.data;
    // });
  }

  loadCount(){
    this.healthTipService.getCounts().subscribe(res => {
      this.healthTipsCount = res.data;
    })
  }

  loadCategories() {
    this.healthTipService.getCategories().subscribe(res => {
      this.categories = res.data.health_category;
    });
  }


  onTabChange(event) {
    // console.log(event);
    this.selectedTab = event.nextId;
    this.loadTips();
  }

  open(content, selectedHealthTip = null) {
    this.selectedHealthTip = selectedHealthTip;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onchangeCategory(event) {
    // console.log("CategoryChangeEvent",event,event.target.value);
    this.selectedCategoryId = event.target.value;
    this.loadTips();
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

  newHealthTips() {
    this._route.navigate(['/explore/create-health-tips'])
  }

  edit(id) {
    this._route.navigate(['/explore/edit-health-tips/' + id])
  }

  delete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this.healthTipService.delete(id).subscribe((res) => {
          this.loadTips();
          Swal.fire({
            text: 'Health Tip Deleted Successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 50,
          });
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  search() {
    if (this.searchQuery) {
      this.searchMode = true;
      this.loading = true;
      this.healthTips = [];
      this.searchTerm$.next(this.searchQuery);
    } else {
      this.searchMode = false;
      this.loadTips();
    }
  }

  clearSearch() {
    this.searchQuery = null;
    this.search();
  }

  shortDescriptionFromHtmlContent(content:string){
    return content.replace(/(<([^>]+)>)/gi, "").slice(0, 352);
  }

}
