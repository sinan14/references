import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { HealthCareVideoService } from 'src/app/services/health-care-video.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-healthvedios',
  templateUrl: './healthvedios.component.html',
  styleUrls: ['./healthvedios.component.scss']
})
export class HealthvediosComponent implements OnInit {
  showScroll: boolean;
  public res = [];
  public ids = [];
  public Id;

  public categories: any = [];
  public subCategories: any = [];
  public allSubCategories: any = [];
  public selectedSubCategoryId: any = null;
  public selectedCategoryId: any = "";
  public videos: any = [];
  public mostSharedVideos: any = [];
  public mostViewedVideos: any = [];
  public homePageMainVideos: any = [];
  public homePageSubVideos: any = [];
  public videosLoading: boolean = false;
  public loading: boolean = false;
  public updating: boolean = false;

  public editMode: boolean = false;
  public selectedVideo: any = null;
  public videoLink: any = null;

  public searchMode: boolean = false;
  public searchQuery: string = null;

  public uploadedVideo: any = null;
  public uploadedVideoPreview: any = null;
  public uploadedVideoFileName: any = null;
  public uploadedThumbnailImage: any = null;
  public uploadedThumbnailImagePreview: any = null;

  public closeResult: string;
  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;

  public apiUrl: any = environment.apiUrl;

  public subCategoryImageFlag: boolean = false;


  public healthCareForm: FormGroup;

  searchTerm$ = new Subject<string>();

  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;
  public addFlag :boolean;

  public multiSelectData: Array<{ name: string; _id: number }>;

  constructor(private modalService: NgbModal,
    private _route: Router,
    public activatedRoute: ActivatedRoute,
    public healthCateVideoService: HealthCareVideoService,
    private formBuilder: FormBuilder,
    private permissionService:PermissionService,
    private location: Location,
  ) { }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }


    this.multiSelectData = this.allSubCategories
    this.initHealthCareForm();
    this.Id = this.activatedRoute.snapshot.paramMap.get('_');
    this.loadCategories();
    this.loadAllSubCategories();

    this.loadAllVideos();

    this.healthCateVideoService.search(this.searchTerm$).subscribe(res => {
      this.videos = res.data
      this.videosLoading = false;
    }, error => {
      this.videosLoading = false;
    });
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


  loadAllVideos(){
    let data = {
      "page": 1,
      "limit": 50
    }
    this.healthCateVideoService.getAllVideosList().subscribe((res:any) => {
      this.videos = res.data;
      console.log("this.videos", res);

      this.videosLoading = false;
      this.mostSharedVideos = this.videos.filter(el => { return el.mostShared == true })
      this.mostViewedVideos = this.videos.filter(el => { return el.mostViewed == true })
      this.homePageMainVideos = this.videos.filter(el => { return el.homepageMain == true })
      this.homePageSubVideos = this.videos.filter(el => { return el.homepageSub == true })
    }, error => {
      this.loading = false;
      console.log("Error", error);
      // Swal.fire('Oops! Server Error', error.message, 'error');
    });
  }

  loadCategories() {
    this.healthCateVideoService.getCategories().subscribe(res => {
      this.categories = res.data;
      this.loadSubCategories();
    });
  }

  loadSubCategories(parentCategoryId: any = null) {
    this.healthCateVideoService.getSubCategories(parentCategoryId).subscribe(res => {
      this.subCategories = res.data;
     // this.selectedSubCategoryId = this.subCategories.length ? this.subCategories[0]._id : null;
      // if (this.selectedSubCategoryId) {
      //   this.loadVideos(this.selectedSubCategoryId);
      // }
    });
  }

  loadAllSubCategories() {
    this.healthCateVideoService.getSubCategories(null).subscribe(res => {
      this.allSubCategories = res.data;
    });
  }

  loadVideos(subCategoryId: any = null) {
    this.videosLoading = true;
    let data = {
      "page": 1,
      "limit": 50
    }
    this.healthCateVideoService.getVideos(subCategoryId, data).subscribe(res => {
      this.videos = res.data.healthcare_video;
      // console.log("this.videos", this.videos);

      this.videosLoading = false;
      this.mostSharedVideos = this.videos.filter(el => { return el.mostShared == true })
      this.mostViewedVideos = this.videos.filter(el => { return el.mostViewed == true })
      this.homePageMainVideos = this.videos.filter(el => { return el.homepageMain == true })
      this.homePageSubVideos = this.videos.filter(el => { return el.homepageSub == true })
    }, error => {
      this.loading = false;
      console.log("Error", error);
      // Swal.fire('Oops! Server Error', error.message, 'error');
    });
  }

  onChangeCategory(event) {
    let categoryId = event.target.value;
    this.loadSubCategories(categoryId);
  }

  onChangeModalSubCategory(event) {
    console.log("event", event);
  }

  onClickSubCategory(subCategoryId) {
    this.selectedSubCategoryId = subCategoryId;
    this.loadVideos(this.selectedSubCategoryId);
  }

  open(content, Value: any, video = null) {
    this.multiSelectData = this.allSubCategories;
    if (Value === 'edit') {
      console.log("video", video);

      let filteredSubCategories = this.allSubCategories.filter(res => {
        return video.subCategories.includes(res._id)
      })

      this.editMode = true;
      this.resetForm();
      this.selectedVideo = video;

      this.healthCareForm.patchValue({
        name: video.name,
        duration: video.duration,
        subCategories: filteredSubCategories,
        homePageMain: video.homepageMain,
        homePageSub: video.homepageSub,

        video: null,
        thumbnailImage: null,
      });

      this.uploadedVideoFileName = video.video;
      this.uploadedThumbnailImagePreview = video.thumbnail;


    } else {
      this.editMode = false;
      this.resetForm();
    }
    this.add_Modal_Flag = true;
    this.update_Modal_Flag = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  initHealthCareForm() {
    this.healthCareForm = this.formBuilder.group({
      name: ["",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255)
        ])
      ],
      duration: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])
      ],
      subCategories: ["",
        Validators.compose([
          Validators.required,
        ])
      ],
      // subCategories: [""],
      homePageMain: [false],
      homePageSub: [false],
      video: [""],
      thumbnailImage: [""],
    });
  }

  onThumbnailChange(event: any) {

    let form = this.healthCareForm;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // console.log("FILE", file);
      // console.log("FILE.type", file.type);
      // console.log("FILE.size == ", file.type == 405 * 192);
      // console.log("FILE.type.indexOf", file.type.indexOf('image'), !file.type.indexOf('image'));
      // console.log("FILE.type.indexOfvIDEO", file.type.indexOf('video'));
      if (file.type.indexOf('image') != 0) {
        Swal.fire('Oops!', "Please image select a valid image file", 'warning');
        return false;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const height = img.naturalHeight;
          const width = img.naturalWidth;
          if (width == 405 && height == 192) {
            this.uploadedThumbnailImagePreview = img.src;
            this.uploadedThumbnailImage = file;
            console.log('Width and Height', width, height);
          } else {
            Swal.fire('Oops!', "Please select image with width of 405px and height 192px", 'warning');
            return false;
          }
        };
      };




      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   let img = reader.result as string;
      //   img.onload = () => {
      //     const height = img.naturalHeight;
      //     const width = img.naturalWidth;
      //     console.log('Width and Height', width, height);
      //   };
      //   this.uploadedThumbnailImage = file;
      //   this.uploadedThumbnailImagePreview = img;
      // };
    }



  }

  onVideoChange(event: any) {
    let form = this.healthCareForm;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.type.indexOf('video') != 0) {
        Swal.fire('Oops!', "Please image select a valid video file", 'warning');
        return false;
      }
      this.uploadedVideo = file;
      this.uploadedVideoFileName = file.name;

      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   let content = reader.result as string;
      //   this.uploadedThumbnailImagePreview = content;
      // };
    }
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

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.healthCareForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
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
        this.healthCateVideoService.delete(id).subscribe((res) => {
          //this.loadVideos(this.selectedSubCategoryId);
          this.loadAllVideos();
          Swal.fire({
            text: 'Video Deleted Successfully',
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

  update() {
    this.generateFormData();
    const controls = this.healthCareForm.controls;
    /** check form */
    if (this.healthCareForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return false;
    }

    this.updating = true;
    console.log("Form Values", this.healthCareForm.value);
    let formData = this.generateFormData();
    this.healthCateVideoService.update(this.selectedVideo._id, formData).subscribe(
      res => {
        //this.loadVideos(this.selectedSubCategoryId);
        this.loadAllVideos();
        Swal.fire('', res.data, 'success');
        this.updating = false;
        this.resetForm();
        this.modalService.dismissAll();
      }, error => {
        // this.updating = false;
        // alert("rror");
        // console.log(error);

        // alert("rror");
        // // this.serverErrors = error.error.msg;
        // // console.log("Error",this.serverErrors);
      });
  }

  save() {
    this.generateFormData();
    const controls = this.healthCareForm.controls;
    /** check form */
    if (this.healthCareForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return false;
    }

    if (!this.uploadedThumbnailImage) {
      return false;
    }

    if (!this.uploadedThumbnailImage) {
      return false;
    }

    this.loading = true;
    console.log("Form Values", this.healthCareForm.value);
    let formData = this.generateFormData();
    this.healthCateVideoService.save(formData).subscribe(res => {
      //this.loadVideos(this.selectedSubCategoryId);
      this.loadAllVideos();
      Swal.fire('', res.data, 'success');
      this.loading = false;
      this.healthCareForm.markAsPristine();
      this.healthCareForm.markAsUntouched();
      this.modalService.dismissAll();
    }, error => {
      this.loading = false;
      // this.serverErrors = error.error.msg;
      // console.log("Error",this.serverErrors);
    });
  }

  search(val) {
    if (val != '') {
      this.searchMode = true;
      this.videosLoading = true;
      this.videos = [];
      this.searchTerm$.next(val);
      
    } else {
      this.searchMode = false;
      //this.loadVideos(this.selectedSubCategoryId);
      this.loadAllVideos();
    }
  }

  clearSearch() {
    // this.searchQuery = null;
    // this.search(val);
    this.loadAllVideos();
  }

  generateFormData() {
    const formData = new FormData();

    formData.append('video', this.uploadedVideo);
    formData.append('thumbnail', this.uploadedThumbnailImage);
    formData.append('name', this.healthCareForm.get('name').value);
    formData.append('duration', this.healthCareForm.get('duration').value);
    formData.append('homepageMain', this.healthCareForm.get('homePageMain').value);
    formData.append('homepageSub', this.healthCareForm.get('homePageSub').value);

    if (this.healthCareForm.get('subCategories').value) {
      this.healthCareForm.get('subCategories').value.forEach((subcategory, index) => {
        formData.append('subCategories[' + index + ']', subcategory._id);
      });
    }


    // this.logFormData(formData);
    return formData;
  }

  logFormData(formData) {
    let data = formData.entries();
    var obj = data.next();
    var retrieved = {};
    while (undefined !== obj.value) {
      retrieved[obj.value[0]] = obj.value[1];
      obj = data.next();
    }
    console.log('FORM DATA CONTENT : ', retrieved);
    return retrieved;
  }

  resetForm() {
    this.healthCareForm.reset();
    this.healthCareForm.patchValue({
      homePageMain: false,
      homePageSub: false,
    });
    this.uploadedThumbnailImagePreview = null;
    this.uploadedThumbnailImage = null;
    this.uploadedVideo = null;
    this.uploadedVideoFileName = null;
    this.selectedVideo = null;
    // this.healthCareForm.markAsPristine();
    // this.healthCareForm.markAsUntouched();
  }

  onHomeMainChange(event) {
    // console.log("Event",event.target.checked);
    if (event.target.checked) {
      Swal.fire({
        text: 'Only one video can be set as home page main, If you already selected any video as home page main it will be deactivated',
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 50,
      });
    }
  }

  handleFilter(value){
    // console.log("Filter EV : ",value);
    if (value.length >= 1) {
      this.multiSelectData = this.allSubCategories.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.multiSelectData = this.allSubCategories
    }
  }


  selectMainCategory(value){
    if(value==='all'){
      this.videosLoading = true;
      this.selectedSubCategoryId = '';
      this.loadCategories();
      this.loadAllVideos();
      this.videosLoading = false;
    }
    else{
      this.getVideosByCategory(value);
    }
  }

  getVideosByCategory(id){
    this.videosLoading = true;
    this.healthCateVideoService.getVideosByMainCategory(id).subscribe((res)=>{
      this.videos = res.data;
      this.videosLoading = false;
    })
  
  }


}
