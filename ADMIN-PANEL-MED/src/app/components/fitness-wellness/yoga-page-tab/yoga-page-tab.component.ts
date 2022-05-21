import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PermissionService } from 'src/app/permission.service';
import { Location , ViewportScroller} from '@angular/common';
import { YogaPageTabService } from 'src/app/services/yoga-page-tab.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-yoga-page-tab',
  templateUrl: './yoga-page-tab.component.html',
  styleUrls: ['./yoga-page-tab.component.scss']
})
export class YogaPageTabComponent implements OnInit {


  public permissions: any = [];
  public user: any = [];
  selectedTab = '';
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  public addLoading: boolean = false;
  // public add_Modal_Flag: boolean = false;
  // public update_Modal_Flag: boolean = false;


  public image_URL: any = ''
  public uploadImage: any = '';
  public uploadedVideo: any = '';
  public vid_src: any = '';
  public Item_Id: any = '';
  public attemptedSubmit: boolean = false;
  
  public updateFlag: boolean = false
  public saveFlag: boolean = true


  public Temp_GET_YOGA_VID_ARRAY: any = []
  public GET_YOGA_VID_ARRAY: any = []
  public GET_POPULAR_YOGA_VID_ARRAY: any = []
  public Main_Categories_Array: any = []
  public Sub_Categories_Array: any = []
  public Popular_Vid_Search_Temp_Array: any = []

  public selectedSubCat :any = '';
  // public selectedSubCategory: any = []
  public Yoga_Form: FormGroup;

  constructor(
    private location: Location,
    private permissionService: PermissionService,
    private YOGA_SERVICE: YogaPageTabService,
    public formBuilder: FormBuilder,
    private modalService: NgbModal,
    public viewScroller : ViewportScroller,
  ) { }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }


    let tabselected = localStorage.getItem("TabID");
    if (tabselected != '') {
      if (tabselected == 'tab-selectbyid3') {
        this.selectedTab = 'tab-selectbyid3';
      }
      else if (tabselected == 'tab-selectbyid5') {
        this.selectedTab = 'tab-selectbyid5';
      }
    }
    else {
      localStorage.clear();
      this.selectedTab = '';
    }

    this.Main_Categories_Array = [
      { value: 1, title: "Main Category" },
      { value: 2, title: "Weekly Workout" },
      { value: 3, title: "Recommend" },
      { value: 4, title: "Start Your Healthy" },]

    this.get_categories()
    this.get_yoga_vid()
    this.get_Popular_yoga_vid()

    this.Yoga_Form = this.formBuilder.group({
      title: ['', Validators.required],
      workoutTime: ['', Validators.required],
      thumbnail: [''],
      video: [''],
    })

  }


  get_categories() {
    this.YOGA_SERVICE.get_categories().subscribe((res: any) => {
      console.log(res);
      this.Sub_Categories_Array = res.data
      console.log(this.Sub_Categories_Array)
    })
  }


  get_yoga_vid() {
    console.log("inside this function");
    this.selectedSubCat = '';
    this.YOGA_SERVICE.get_yoga_vid().subscribe((res: any) => {
      console.log(res);
      
      this.Temp_GET_YOGA_VID_ARRAY = res.data
      console.log(this.Temp_GET_YOGA_VID_ARRAY,"real");

      this.GET_YOGA_VID_ARRAY = this.Temp_GET_YOGA_VID_ARRAY.reverse()
      console.log(this.GET_YOGA_VID_ARRAY,"rev by concept");

    }, (err) => {
      console.log(err);

    })
  }

  get_Popular_yoga_vid() {
    this.selectedSubCat = '';
    this.YOGA_SERVICE.get_Popular_yoga_vid().subscribe((res: any) => {
      this.GET_POPULAR_YOGA_VID_ARRAY = res.data
      console.log(res);

    })

  }

  Save() {
    console.log(this.updateFlag);
    
    console.log("inside save");
    this.attemptedSubmit = true
    if (this.Yoga_Form.valid) {
      const formData = new FormData()
      this.addLoading = true;
      // this.add_Modal_Flag = true;
      // this.update_Modal_Flag = false;
      formData.append('title', this.Yoga_Form.get('title').value);
      formData.append('workoutTime', this.Yoga_Form.get('workoutTime').value);
      formData.append('video', this.uploadedVideo);
      formData.append('thumbnail', this.uploadImage);
      console.log(this.Yoga_Form.get('title').value);
      console.log(this.Yoga_Form.get('workoutTime').value);
      console.log(this.uploadedVideo);
      console.log(this.uploadImage);
      this.YOGA_SERVICE.add_yoga_vids(formData).subscribe((res: any) => {
        console.log(res);
        // this.saveFlag = true
        this.pop(res)
        // this.get_yoga_vid()
      })
    } else {
      this.addLoading = false;
    }

  }

  Update() {
    console.log("u r in update");
    this.attemptedSubmit = true

    if (this.Yoga_Form.valid) {
      const formData = new FormData();
      if (this.uploadImage == undefined && this.uploadedVideo == undefined) {
        formData.append('title', this.Yoga_Form.get('title').value);
        formData.append('workoutTime', this.Yoga_Form.get('workoutTime').value);
      } else if (this.uploadedVideo == undefined) {
        formData.append('title', this.Yoga_Form.get('title').value);
        formData.append('workoutTime', this.Yoga_Form.get('workoutTime').value);
        formData.append('thumbnail', this.uploadImage);
      } else if (this.uploadImage == undefined) {
        formData.append('title', this.Yoga_Form.get('title').value);
        formData.append('workoutTime', this.Yoga_Form.get('workoutTime').value);
        formData.append('video', this.uploadedVideo);
      } else {
        formData.append('title', this.Yoga_Form.get('title').value);
        formData.append('workoutTime', this.Yoga_Form.get('workoutTime').value);
        formData.append('video', this.uploadedVideo);
        formData.append('thumbnail', this.uploadImage);
      }

      this.addLoading = true;
      // this.update_Modal_Flag = true;
      // this.add_Modal_Flag = false;
      this.YOGA_SERVICE.update_yoga_vids(this.Item_Id, formData).subscribe((res: any) => {
        console.log(res);
        this.pop(res)
      })
    }
    else {
      this.addLoading = false;
      this.uploadImage = undefined;
      this.uploadedVideo = undefined;
    }
  }

  delete(id) {
    console.log(id, "delete clicked")


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
        this.YOGA_SERVICE.delete_yoga_vids(id).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  searchAllVideos(val:any) {
    // this.dataLoading = true;
    let input = {
      "keyword": val
    }
    this.YOGA_SERVICE.search_all_videos(input).subscribe((res: any) => {
      console.log(res);

      if (res.status == true) {
        this.GET_YOGA_VID_ARRAY = res.data;
        // this.dataLoading = false;
      }
      else {
        this.get_yoga_vid()
        // this.dataLoading = false;
      }
    })
  }


  Search_Popular_Vids(val) {
    console.log(val);
    // this.Popular_Vid_Search_Temp_Array = []


    let listing: any = [];
    if (val != '') {
      listing = this.Popular_Vid_Search_Temp_Array.filter((i: any) => i.title.toLowerCase().indexOf(val.toLowerCase()) !== -1);
      this.Popular_Vid_Search_Temp_Array = listing;
      // this.dataLoading = false;
    }
    else {
      this.get_Popular_yoga_vid();
      this.Popular_Vid_Search_Temp_Array = this.Popular_Vid_Search_Temp_Array;
      // this.dataLoading = false;
    }

    // if (val != '') {
    //   this.GET_POPULAR_YOGA_VID_ARRAY.find((data) => {
    //     if(data.title == val){
    //       this.Popular_Vid_Search_Temp_Array.push(data)
    //       console.log(this.Popular_Vid_Search_Temp_Array,"res array");
    //       this.GET_POPULAR_YOGA_VID_ARRAY = this.Popular_Vid_Search_Temp_Array
    //       console.log(this.GET_POPULAR_YOGA_VID_ARRAY);
    //       return this.GET_POPULAR_YOGA_VID_ARRAY
    //     }else{
    //       this.get_Popular_yoga_vid()
    //     }
    //   })
    // } else {
    //   this.get_Popular_yoga_vid()
    // }
  }


  selectChangeCategory(val) {
    this.selectedSubCat = '';
    if (val == "0") {
      console.log("all");
      this.YOGA_SERVICE.get_categories().subscribe((res: any) => {
        this.Sub_Categories_Array = res.data
      })
      this.GET_YOGA_VID_ARRAY = []
    this.selectedSubCat = '';
      this.get_categories()
      this.get_yoga_vid()
      console.log(this.Sub_Categories_Array, "all");
    } else if (val == '1') {
      this.selectedSubCat = val;
      this.YOGA_SERVICE.get_categories_type("main").subscribe((res: any) => {
        this.Sub_Categories_Array = res.data
      })
      this.GET_YOGA_VID_ARRAY = []
      console.log(this.Sub_Categories_Array, "Main Category");
      this.YOGA_SERVICE.get_yoga_vid_by_Maincat("main").subscribe((res: any) => {
        console.log(res, "main array res");

        this.GET_YOGA_VID_ARRAY = res.data
      })

    } else if (val == '2') {
      this.YOGA_SERVICE.get_categories_type("weekly").subscribe((res: any) => {
        this.Sub_Categories_Array = res.data
      })
      this.GET_YOGA_VID_ARRAY = []
      console.log(this.Sub_Categories_Array, "weekly");
      this.YOGA_SERVICE.get_yoga_vid_by_Maincat("weekly").subscribe((res: any) => {
        this.GET_YOGA_VID_ARRAY = res.data
      })


    } else if (val == '3') {
      this.YOGA_SERVICE.get_categories_type("recommended").subscribe((res: any) => {
        this.Sub_Categories_Array = res.data
      })
      this.GET_YOGA_VID_ARRAY = []
      console.log(this.Sub_Categories_Array, "recommended");
      this.YOGA_SERVICE.get_yoga_vid_by_Maincat("recommended").subscribe((res: any) => {
        this.GET_YOGA_VID_ARRAY = res.data
      })


    } else if (val == '4') {
      this.YOGA_SERVICE.get_categories_type("healthy").subscribe((res: any) => {
        this.Sub_Categories_Array = res.data
      })
      this.GET_YOGA_VID_ARRAY = []
      console.log(this.Sub_Categories_Array, "healthy");
      this.YOGA_SERVICE.get_yoga_vid_by_Maincat("healthy").subscribe((res: any) => {
        this.GET_YOGA_VID_ARRAY = res.data
      })

    } else {
      console.log("not at all");
      this.get_categories()
      this.get_yoga_vid()
    }

  }

  selectSubCategory(id) {
    this.selectedSubCat = id;
    console.log(id);
    if (id != '') {
      this.YOGA_SERVICE.get_yoga_vid_by_Subcat(id).subscribe((res: any) => {
        console.log(res, "by sub cat");
        this.GET_YOGA_VID_ARRAY = res.data
        console.log(this.GET_YOGA_VID_ARRAY, "res attached sub cat arr");

      })
    } else {
      this.get_yoga_vid()
    }


  }

  Img_Click(item) {
    console.log(this.updateFlag);
    this.saveFlag = false
    
    this.viewScroller.scrollToPosition([0, 0]);
    this.updateFlag = true
    console.log(item, "tab clik");
    this.Item_Id = item._id

    this.image_URL = item.thumbnail
    this.vid_src = item.video

    this.Yoga_Form.patchValue({
      title: item.title,
      workoutTime: item.workoutTime,
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


  onChangeImage(event: any, width: any, height: any) {
    // this.uploadImage = undefined;
    // this.image_URL = ''
    let setFlag: boolean = false;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);
    Img.onload = (e: any) => {
      if (e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width)) {
        setFlag = true;
        this.uploadImage = file;
        let content = reader.result as string;
        this.image_URL = content;
      }
      else {
        setFlag = true;
        Swal.fire({
          text: 'Invalid Image Dimension - ' + width + 'x' + height,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
    }
  }

  onVideoChange(event: any) {
    console.log("video change func");
    console.log(event.target.files);
    this.uploadedVideo = undefined;
    this.vid_src = null;

    let form = this.Yoga_Form;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.type.indexOf('video') != 0) {
        Swal.fire('Oops!', "Please image select a valid video file", 'warning');
        return false;
      }
      this.uploadedVideo = file;
      console.log(this.uploadedVideo);
      let content = reader.result as string;
      this.vid_src = content;
      console.log(this.vid_src);

      // this.uploadedVideoFileName = file.name;

      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   let content = reader.result as string;
      //   this.uploadedThumbnailImagePreview = content;
      // };
    }
  }


  pop(res: any) {
    console.log(this.updateFlag,"updare");
    console.log(this.saveFlag,"save");

    if (res.status === true) {
      Swal.fire({
        text: res.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
    //  this.updateFlag = this.updateFlag ? false : true;
      // this.updateFlag = true
      
    } else {
      Swal.fire({
        text: res.data,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
      // this.updateFlag = false
     
    }
    this.updateFlag = this.updateFlag ? false : true;
    this.saveFlag = false
    console.log(this.updateFlag,"updare");
    console.log(this.saveFlag,"save");

   

    // this.addLoading = false;
    this.modalService.dismissAll();
    this.addLoading = false;
    this.attemptedSubmit = false;
    this.reset()
    // this.uploadImage = undefined;
    // this.uploadedVideo=undefined
    // this.image_URL = ''
    // this.vid_src = ''
    // this.Yoga_Form.reset
    // this.ngOnInit()
    // this.update_Modal_Flag = false;
    // this.add_Modal_Flag = false;
    this.get_categories()
    this.get_yoga_vid()
    this.get_Popular_yoga_vid()
  }


  name = "Angular";
  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  reset() {
    this.Yoga_Form.reset()
    this.saveFlag = true
    this.updateFlag = false
    this.image_URL = ''
    this.vid_src = ''
    this.uploadImage = ''
    this.uploadedVideo = ''
    this.attemptedSubmit = false
  }

}
