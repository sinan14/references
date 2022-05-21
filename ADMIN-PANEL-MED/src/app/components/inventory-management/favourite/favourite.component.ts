import { Component, OnInit } from '@angular/core';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FavouritesService } from 'src/app/services/favourites.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent implements OnInit {


  public listCategory: Array<string> = ['Category 1', 'Category 2', 'Category 3','Category 4'];

  
  public vendors = [
    {
      image:"assets/images/electronics/product/medical-mask.png",
      MedimallID : "36758",
      SKNNO : "254",
      Name: "Haire Oil",
      Categories:"baby Care",
      Brand:"Pathanjali",
      Price:"124",
      Quantity:"432",
      Status:"<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches1' checked><label class='custom-control-label' for='customSwitches1'></label></div> "
  },
  {
    image:"assets/images/electronics/product/facewash.png",
    MedimallID : "36758",
    SKNNO : "254",
    Name: "Haire Oil",
    Categories:"baby Care",
    Brand:"Pathanjali",
    Price:" 124",
    Quantity:"432",
    Status:"<div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches2' checked='true'><label class='custom-control-label' for='customSwitches2'></label></div> "
},
{
  image:"assets/images/electronics/product/medical-mask.png",
  MedimallID : "36758",
  SKNNO : "254",
  Name: "Haire Oil",
  Categories:"baby Care",
  Brand:"Pathanjali",
  Price:"124",
  Quantity:"432",
  Status:"<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches3' checked='true'><label class='custom-control-label' for='customSwitches3'></label></div> "
},
{
  image:"assets/images/electronics/product/facewash.png",
  MedimallID : "36758",
  SKNNO : "254",
  Name: "Haire Oil",
  Categories:"baby Care",
  Brand:"Pathanjali",
  Price:"124",
  Quantity:"432",
  Status:"<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches4' checked='true'><label class='custom-control-label' for='customSwitches4'></label></div> "
},
{
  image:"assets/images/electronics/product/medical-mask.png",
  MedimallID : "36758",
  SKNNO : "254",
  Name: "Haire Oil",
  Categories:"baby Care",
  Brand:"Pathanjali",
  Price:"124",
  Quantity:"432",
  Status:"<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches5' checked='true'><label class='custom-control-label' for='customSwitches5'></label></div> "
},
  
  ];

     //NEW VARIABLES

     public permissions :any = [];
     public user :any = [];
     public currentPrivilages :any = [];
     public aciveTagFlag :boolean = true;
     public editFlag :boolean;
     public deleteFlag :boolean;
     public viewFlag :boolean;

     public List_Type: any = ''
     public Favourites: any = [];
     public current_page: any;
     public hasNextPage: boolean;
     public total_page: any;
     public hasPrevPage: boolean;
     public Search_Key: any = ''

  constructor(
    private permissionService:PermissionService,
    private location: Location,
    private activated_router:ActivatedRoute,
    private Fav_Service:FavouritesService,
    private _router:Router) { }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    this.activated_router.paramMap.subscribe(params => {
      this.List_Type = params.get('type')
      console.log(this.List_Type)

      this.get_FAVOURITES_TABLE(1)

    })

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }
  }


  get_FAVOURITES_TABLE(pg){
    
    let body = {
      page:pg,
      type:this.List_Type
    }

this.Fav_Service.get_FAVOURITES_TABLE(body).subscribe((res:any)=>{
  console.log(res,"tfyvyvygygygyg");
  
    this.Favourites = []
    this.Favourites = res.data.response.products


    this.current_page = res.data.response.CurrentPage
    this.hasNextPage = res.data.response.hasNextPage
    this.total_page = res.data.response.totalPages
    this.hasPrevPage = res.data.response.hasPrevPage
})


  }


  Edit(id) {
    console.log(id, this.List_Type);

    if (this.List_Type == 'medicine') {
      this._router.navigate(['/inventory/edit-inventory/medicine/' + id])
    } else if (this.List_Type == 'healthcare') {
      this._router.navigate(['/inventory/edit-inventory/healthcare/' + id])
    }
  }

  Deactivate_FAVOURITES(event: any, id: any) {
    let status = {
      status: event.target.checked ? false : true
    }
    this.Fav_Service.act_dct_FAVOURITES(id, status).subscribe((res: any) => {
      console.log(res, "act/dct");
      this.pop(res)
    })
  }

  onPageChangeLow(pg) {
    console.log(this.Search_Key);

    if (this.Search_Key == '') {
      this.get_FAVOURITES_TABLE(pg)
    } else {

      this.search_FAVOURITES(pg, this.Search_Key)

    }
  }

  Search_Function(event) {
    console.log(event.target.value);
    this.Search_Key = event.target.value
    console.log(this.Search_Key);
    this.search_FAVOURITES(1, this.Search_Key)

  }


  search_FAVOURITES(pg, key_word) {
    let body = {
      page: pg,
      limit: 10,
      type: this.List_Type,
      keyword: key_word
    }
    this.Fav_Service.search_FAVOURITES(body).subscribe((res: any) => {
      console.log(res, "this is our search response");
      this.Favourites = []
      this.Favourites = res.data.response.products


      this.current_page = res.data.response.CurrentPage
      this.hasNextPage = res.data.response.hasNextPage
      this.total_page = res.data.response.totalPages
      this.hasPrevPage = res.data.response.hasPrevPage
    })
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

  pop(res: any) {
    if (res.status === true) {
      Swal.fire({
        text: res.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
    } else {
      Swal.fire({
        text: res.data,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
    }
    this.get_FAVOURITES_TABLE(this.current_page)
  }

}
