import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PermissionService } from 'src/app/permission.service';
import { Router } from '@angular/router';
import { Location, ViewportScroller } from '@angular/common';
import { FoliofitFitnessClubService } from 'src/app/services/foliofit-fitness-club.service';
import { FormGroup ,FormBuilder ,Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import { PageChangeEvent } from "@progress/kendo-angular-pager";

@Component({
  selector: 'app-fitness-club-tab',
  templateUrl: './fitness-club-tab.component.html',
  styleUrls: ['./fitness-club-tab.component.scss']
})
export class FitnessClubTabComponent implements OnInit {

  public pasteCleanupSettings = {
    convertMsLists: false,
    removeHtmlComments: true,
    // stripTags: ['span', 'h1'],
    // removeAttributes: ['lang'],
    removeMsClasses: false,
    removeMsStyles: false,
    removeInvalidHTML: false,
  };
  
  public pageSize = 5;
  public skip = 0;
  public pagedDestinations = [];

  name = "Angular";
  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;


   //NEW VARIABLES

   public permissions: any = [];
   public user: any = [];
   public currentPrivilages: any = [];
   public aciveTagFlag: boolean = true;
   public editFlag: boolean;
   public deleteFlag: boolean;
   public viewFlag: boolean; 
   public dataLoading :boolean = false;
   public selectedSubCategory :any = '';


   public fitnesClubAllVideos :any = [];
   public fitnesClubPopularVideos :any = [];
   public fitnesClubCategories :any = [];
   public videoForm:FormGroup;
   public addLoading :boolean = false;
   public image_URL :any = '';
   public gif_URL :any = '';
   public gifImg_URL :boolean = false;
   public video_URL :any = '';
   public uploadImage :any = '';
   public uploadGif :any ='';
   public uploadVideo :any =''; 
   public attemptedSubmit :boolean = false;
   public editMode :boolean = false;
   public selectedFitnessCategory :any = '';
   public ID :any;

   public editor_value = `
   <p style='color:white;opacity:0.5;font-weight:lighter;font-style:Poppins;'>
     
   </p>
 
 `;


  constructor(
    private _route: Router,
    private permissionService: PermissionService,
    private location: Location,
    private _foliofitFitnessClub: FoliofitFitnessClubService,
    private _formBuilder :FormBuilder,
    private viewScroller: ViewportScroller) { }

  ngOnInit(): void {
    
    this.editMode = false;
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    this.videoForm= this._formBuilder.group({
      title: ['',Validators.required],
      workout_time: ['',Validators.required],
      english_description: ['',Validators.required],
      malayalam_description: ['',Validators.required]
  })

    this.getAllVideos();
    this.getPopularVideos();
    this.getFitessClubCategories();
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

  getAllVideos(){
    this.dataLoading = true;
    this._foliofitFitnessClub.get_all_videos().subscribe((res:any)=>{
      this.fitnesClubAllVideos = res.data.reverse();
      this.dataLoading = false;
    })
  }

  getPopularVideos(){
    this._foliofitFitnessClub.get_popular_videos().subscribe((res:any)=>{
      this.fitnesClubPopularVideos = res.data.reverse();
    })
  }

  getFitessClubCategories(){
    this._foliofitFitnessClub.get_fitness_categories().subscribe((res:any)=>{
      this.fitnesClubCategories = res.data;
    })
  }

  upload(){
    if(this.videoForm.invalid || this.video_URL === '' || this.gif_URL === '' || this.image_URL === ''){
      return;
    }
    const formData = new FormData();
    this.addLoading = true;

      formData.append('title',this.videoForm.get('title').value);
      formData.append('workoutTime',this.videoForm.get('workout_time').value);
      formData.append('descriptionEnglish',this.videoForm.get('english_description').value);
      formData.append('descriptionMalayalam',this.videoForm.get('malayalam_description').value);
      formData.append('gif',this.uploadGif);
      formData.append('video',this.uploadVideo);
      formData.append('thumbnail',this.uploadImage);

      this._foliofitFitnessClub.add_videos(formData).subscribe((res:any)=>{
        if(res.status){
          Swal.fire({
            text:  'Successfully Added',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.attemptedSubmit = false;
          this.addLoading = false;
          this.editMode = false;
          this.videoForm.reset();
          this.getAllVideos();
          this.resetValues();
          this.ngOnInit();
        }
        else{
          this.addLoading = false;
          Swal.fire({
            text:  res.data,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
        }
      })


  }

  update(){
    if(this.videoForm.invalid || this.video_URL === '' || this.gif_URL === '' || this.image_URL === ''){
      return;
    }
    const formData = new FormData();
    this.addLoading = true;
    if(this.uploadGif != '' && this.uploadImage != '' && this.uploadVideo != ''){
      formData.append('title',this.videoForm.get('title').value);
      formData.append('workoutTime',this.videoForm.get('workout_time').value);
      formData.append('descriptionEnglish',this.videoForm.get('english_description').value);
      formData.append('descriptionMalayalam',this.videoForm.get('malayalam_description').value);
      formData.append('gif',this.uploadGif);
      formData.append('video',this.uploadVideo);
      formData.append('thumbnail',this.uploadImage);
    }
    else   if(this.uploadGif != ''){
      formData.append('title',this.videoForm.get('title').value);
      formData.append('workoutTime',this.videoForm.get('workout_time').value);
      formData.append('descriptionEnglish',this.videoForm.get('english_description').value);
      formData.append('descriptionMalayalam',this.videoForm.get('malayalam_description').value);
      formData.append('gif',this.uploadGif);
    }
    else   if(this.uploadImage != ''){
      formData.append('title',this.videoForm.get('title').value);
      formData.append('workoutTime',this.videoForm.get('workout_time').value);
      formData.append('descriptionEnglish',this.videoForm.get('english_description').value);
      formData.append('descriptionMalayalam',this.videoForm.get('malayalam_description').value);
      formData.append('thumbnail',this.uploadImage);
    }
    else   if(this.uploadVideo != ''){
      formData.append('title',this.videoForm.get('title').value);
      formData.append('workoutTime',this.videoForm.get('workout_time').value);
      formData.append('descriptionEnglish',this.videoForm.get('english_description').value);
      formData.append('descriptionMalayalam',this.videoForm.get('malayalam_description').value);
      formData.append('video',this.uploadVideo);
    }
    else{
      formData.append('title',this.videoForm.get('title').value);
      formData.append('workoutTime',this.videoForm.get('workout_time').value);
      formData.append('descriptionEnglish',this.videoForm.get('english_description').value);
      formData.append('descriptionMalayalam',this.videoForm.get('malayalam_description').value);
    }

      this._foliofitFitnessClub.update_videos(this.ID,formData).subscribe((res:any)=>{
        if(res.status){
          Swal.fire({
            text:  'Successfully Updated',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.videoForm.reset();
          this.attemptedSubmit = false;
          
          this.getAllVideos();
          this.ngOnInit();
          this.resetValues();
        }
        else{
          Swal.fire({
            text:  res.data,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
        }
      })

  }

  deleteVideo(id){
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
        this._foliofitFitnessClub.delete_videos(id).subscribe((res:any)=>{
          console.log(res);
          if(res && res.status === true){
            Swal.fire({
              text: 'Successfully Deleted',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            this.getAllVideos();
            this.ngOnInit();
          }
          else{
            Swal.fire({
              text: 'Can`t Delete this',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
          }
        
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  onChangeImage(event:any,width:any,height:any){
    let setFlag :boolean = false;
      const reader = new FileReader();
      const file = event.target.files[0];

      if (file.type.indexOf('image') != 0) {
        Swal.fire('Oops!', "Please  select a valid image file", 'warning');
        return false;
      }

      reader.readAsDataURL(file); 
      const Img = new Image();
      Img.src = URL.createObjectURL(file);
    
      Img.onload = (e: any) => {
        if(e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width) ){
          setFlag = true;
          this.uploadImage = file;
          let content = reader.result as string;
          this.image_URL = content;
         
        }
        else{
          setFlag = true;
          Swal.fire({
                  text: 'Invalid Image Dimension - '+ width +'x' + height,
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor:  '#3085d6',
                  imageHeight: 500,
                });
        }
      }

   
  }

  onVideoChange(event: any) {

    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.type.indexOf('video') != 0) {
        Swal.fire('Oops!', "Please select a valid video file", 'warning');
        return false;
      }
      this.uploadVideo = file;
      this.video_URL = file.name;
      // this.uploadedVideoFileName = file.name;

      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   let content = reader.result as string;
      //   this.uploadedThumbnailImagePreview = content;
      // };
    }
  }

  onChangeGif(event: any) {

    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      // if (file.type != 'image/gif') {
      //   Swal.fire('Oops!', "Please select a valid gif file", 'warning');
      //   return false;
      // }
      if (file.type === 'image/gif'){
        this.gifImg_URL = false;
        this.uploadGif = file;
        this.gif_URL = file.name;
      }
      else if(file.type.indexOf('video') != 0){

          this.gifImg_URL = true;
          reader.readAsDataURL(file); 
          const Img = new Image();
          Img.src = URL.createObjectURL(file);

          Img.onload = (e: any) => {
            let imgWidth = '539';
            let imgHeight = '333';
            if(e.path[0].naturalHeight === parseInt(imgHeight) && e.path[0].naturalWidth === parseInt(imgWidth) ){
              let content = reader.result as string;
              this.uploadGif = file;
              this.gif_URL = content;
            
            }
            else{
              Swal.fire({
                      text: 'Invalid Image Dimension - '+ imgWidth +'x' + imgHeight,
                      icon: 'warning',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
            }
          }
    
      }
      else{
        this.gifImg_URL = false;
        this.uploadGif = file;
        this.gif_URL = file.name;
      }
      // this.uploadedVideoFileName = file.name;

      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   let content = reader.result as string;
      //   this.uploadedThumbnailImagePreview = content;
      // };
    }
  }



  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  resetValues(){
    this.image_URL = '';
    this.video_URL = '';
    this.gif_URL = '';
    this.uploadImage = '';
    this.uploadGif = '';
    this.uploadVideo = '';
  }


  clickToEdit(id:any){
    this._foliofitFitnessClub.get_fitness_club_by_id(id).subscribe((res:any)=>{
      this.viewScroller.scrollToPosition([0, 0]);
      this.ID = id;
      this.editMode = true;
      console.log(res.data);
      this.image_URL = res.data.thumbnail;
     
      this.gif_URL =res.data.gif.type === 1 ?  res.data.gif.gifImage : res.data.gif.gifVideo;
      
      this.video_URL = res.data.video;

      this.videoForm.patchValue({
        title:res.data.title,
        workout_time : res.data.workoutTime,
        english_description : res.data.descriptionEnglish,
        malayalam_description : res.data.descriptionMalayalam,
      })
    })
  }
  normalClick(){
    this.editMode = false;
    this.attemptedSubmit = false;
    this.image_URL = '';
    this.video_URL = '';
    this.gif_URL = '';
    this.videoForm.reset();
  }

  selectChangeCategory(val){

  }

  ChangeFitnessCategory(val){
    this.selectedFitnessCategory = val;
  }

  searchFilter(val){
    
    this.dataLoading = true;
    let input ={
      "keyword":val
    }
    this._foliofitFitnessClub.search_all_videos(input).subscribe((res:any)=>{
      console.log(res.data)
      if(res.status){
        this.fitnesClubAllVideos = res.data;
        this.dataLoading = false;
      }
      else{
        this.getAllVideos();
        this.dataLoading = false;
      }
    })
  }

  changeMainCategory(type:any){

    this.selectedSubCategory = '';
    this.dataLoading = true;
    if(type === 'all'){
      this.getAllVideos();
      this.getFitessClubCategories();
      this.dataLoading = false;
      this.selectedSubCategory = '';
    }
    else{
      this._foliofitFitnessClub.get_fitness_club_categories_by_type(type).subscribe((res:any)=>{
        this.fitnesClubCategories = res.data;
        this.dataLoading = false;
      })

      this._foliofitFitnessClub.get_fitness_club_videos_by_type(type).subscribe((res:any)=>{
        this.fitnesClubAllVideos = res.data;
        this.dataLoading = false;
      })
    }
  }

  selectFoliofitSubCategory(id:any){
    this.dataLoading = true;
    this.selectedSubCategory = id;
    this._foliofitFitnessClub.get_fitness_club_category_by_id(id).subscribe((res:any)=>{
      this.fitnesClubAllVideos = res.data;
      this.dataLoading = false;
    })
  }

  getFitnessClubVideos(){
    this.selectedSubCategory = '';
    this.dataLoading = true;
    this.getAllVideos();
    this.dataLoading = false;
  }

  searchPopularVideos(val){
    this.dataLoading = true;
    let listing :any =[];
    if(val != ''){
      listing = this.fitnesClubPopularVideos.filter((i:any)=>i.title.toLowerCase().indexOf(val.toLowerCase()) !== -1);
      this.fitnesClubPopularVideos = listing;
      this.dataLoading = false;
    }
    else{
      this.getPopularVideos();
      this.fitnesClubPopularVideos = this.fitnesClubPopularVideos;
      this.dataLoading = false;
    }
    // let input ={
    //   "keyword":val
    // }
    // this._foliofitFitnessClub.search_popular_videos(input).subscribe((res:any)=>{
    //   if(res.status){
    //     this.fitnesClubPopularVideos = res.data;
    //     this.dataLoading = false;
    //   }
    //   else{
    //     this.getPopularVideos();
    //     this.dataLoading = false;
    //   }
    // })
  }

  //pagination

  // itemsPerPage: number = 10;
  // allPages: number;

  // onPageChange(page: number = 1): void {
  //   const startItem = (page - 1) * this.itemsPerPage;
  //   const endItem = page * this.itemsPerPage;
  //   this.fitnesClubAllVideos = this.fitnesClubAllVideos.slice(startItem, endItem);
  // }
  
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.getAllVideos();
  }

}
