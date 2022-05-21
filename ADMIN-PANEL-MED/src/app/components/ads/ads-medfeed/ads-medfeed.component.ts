import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router }  from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { AdMedfeedService } from 'src/app/services/ad-medfeed.service';
import Swal from 'sweetalert2';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
@Component({
  selector: 'app-ads-medfeed',
  templateUrl: './ads-medfeed.component.html',
  styleUrls: ['./ads-medfeed.component.scss']
})
export class AdsMedfeedComponent implements OnInit {


  public closeResult: string;
  public value_array = [];
  public product_array = [];
  public colorValue :any;
  add_Modal_Flag :boolean = false;
  update_Modal_Flag :boolean = false;
  public attemptedSubmit: boolean = false;

  //NEW VARIABLES

  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean=false;
  public viewFlag :boolean;
  public uploadImage:any;
  public _Id:any;
  public _type:any;

  public Slider1List:any=[];
  public QuizOneList:any=[];
  public QuizList:any=[];
  public MainCategoryList:any=[];
  public ExpertAdviceList:any=[];
  public loading :boolean = false;
  public addLoading:boolean = false;
//Slider 1 form

public slider1Form:FormGroup;
public image_URL :any = '';
public _redirect_type:any='';

//Medarticle Form
public medarticleForm:FormGroup;
public mcimage:any;
public sliderId:any;

//QuizForm
public quizForm:FormGroup;
public Quiz1Form:FormGroup;
public expertadviseForm:FormGroup;

  constructor(private modalService: NgbModal,
    private _route:Router,
    private intl: IntlService,
    private permissionService:PermissionService,
    private location: Location,private _admedfeed:AdMedfeedService,public formBuilder:FormBuilder) {this.initForms(); }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    this.getSlider1Details();
    this.getQuizOneDetails();
    this.getQuizDetails();
    this.getMainCategoryDetails();
    this.getExpertAdviceDetails();

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

  }
  initForms(){

   this.slider1Form=this.formBuilder.group({
     slidertype: ['',Validators.required],
     image: [''],
   });

   this.medarticleForm=this.formBuilder.group({
     image: [''],
    });

    this.quizForm=this.formBuilder.group({
      image: [''],
    });

    this.expertadviseForm=this.formBuilder.group({
      image: [''],
    });

    this.Quiz1Form=this.formBuilder.group({
      image: [''],
    });
  }

  get sf(){
    return this.slider1Form.controls;
  }

  get medarticle(){
    return this.medarticleForm.controls;
  }

  get qf(){
    return this.quizForm.controls;
  }

  get eaf(){
    return this.expertadviseForm.controls;
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



  open(content,Value:any,id:any,type:any) {
    console.log(Value)
    if(Value === 'add'){
      this.attemptedSubmit = false;
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.image_URL = '';
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if(Value === 'edit'){
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;this.image_URL = '';
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
        if(type==='slider1'){
          this._admedfeed.Get_Slider_By_Id(id).subscribe((res:any)=>{
            this.image_URL=res.data[0].image;console.log(res.data,"DAta");
            this._redirect_type=res.data[0].redirect_type;
            this.slider1Form.setValue({
              'slidertype':res.data[0].redirect_type,
              'image':this.image_URL,
              /* 'sliderId':res.data[0]._id, */
            })

          })
        }
        else if(type==='quiz'){
          this._admedfeed.Get_Quiz_by_Id(id).subscribe((res:any)=>{
            this.image_URL=res.data.image;console.log(res.data,"DAta");
             this.quizForm.setValue({
              'image':this.image_URL,
            })

          })
        }
        else if(type==='maincategory'){
          this._admedfeed.Get_MC_EA_Details_by_Id(id).subscribe((res:any)=>{console.log(res.data,"Data");

          this.image_URL=res.data.image;console.log(this.image_URL,"imG");
           this.medarticleForm.setValue({
             'image':this.image_URL,
           })

          })
        }
        else if(type==='expertadvise'){
          this._admedfeed.Get_MC_EA_Details_by_Id(id).subscribe((res:any)=>{console.log(res.data,"Data");

          this.image_URL=res.data.image;console.log(this.image_URL,"imG");
           this.expertadviseForm.setValue({
             'image':this.image_URL,
           })

          })
        }
        else if(type==='quiz1'){
          this._admedfeed.Get_MC_EA_Details_by_Id(id).subscribe((res:any)=>{console.log(res.data,"Data");

          this.image_URL=res.data.image;console.log(this.image_URL,"imG");
           this.Quiz1Form.setValue({
             'image':this.image_URL,
           })

          })
        }
    }


    else if(Value === ''){
      this.update_Modal_Flag = false;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    this._Id=id; console.log(this._Id,"ID");
    this._type=type;console.log(this._type,"TYPE");console.log(this.image_URL,"ImageUrl");

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

  dropDownChange(value:any){
    if(value === 'medimall'){
      this.value_array = ['Product','Category'];
    }
    else if(value === 'foliofit'){
      this.value_array = ['Fitness Club','Yoga','Diet Regieme','Health','Nutri Chart','BMI'];
      this.product_array=[];
    }
    else if(value === 'medfeed'){
      this.value_array = ['Med Articles','Medquiz','Expert Advice','Health Tips','Live Updates','Home'];
      this.product_array=[];
    }
    else if(value === 'external'){
      this.value_array = ['Link'];
      this.product_array=[];
    }
}

dropDownProductChange(value:any){
  console.log(value)
    if(value === 'Product'){
      this.product_array = ['a','b','c'];
    }
    else if(value === 'Category'){
      this.product_array = ['cat 1','cat 2','cat 3',];
    }
}

changeColorPickerValue(value){
  console.log(value);
  this.colorValue = value;
}

getSlider1Details(){
  this._admedfeed.Get_Medfeed_Slider_1().subscribe((res:any)=>{
   this.Slider1List=res.data;console.log(this.Slider1List,"SL1");
});
}
getQuizOneDetails(){
  this._admedfeed.Get_QuizOne().subscribe((res:any)=>{
    this.QuizOneList=res.data;console.log(this.QuizOneList,"QOne");
  });
}
getQuizDetails(){
  this._admedfeed.Get_Medfeed_Quiz().subscribe((res:any)=>{
    this.QuizList=res.data;console.log(this.QuizList,"QL");
  });
}
getMainCategoryDetails(){
  let type='maincategory';
  this._admedfeed.Get_Medfeed_MC_EA(type).subscribe((res:any)=>{
    this.MainCategoryList=res.data;console.log(this.MainCategoryList,"MC");
  });
}
getExpertAdviceDetails(){
  let type='expertadvise';
  this._admedfeed.Get_Medfeed_MC_EA(type).subscribe((res:any)=>{
    this.ExpertAdviceList=res.data;console.log(this.ExpertAdviceList,"EA");
  });
}
 delete(id:any){
  this.deleteFlag=true;console.log(id,"Delete ID");
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
      this._admedfeed.Delete_Slider1(id).subscribe((res:any)=>{
        if(res !=''){
          this.ngOnInit();
          Swal.fire({
                  text:'Successfully Deleted',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor:  '#3085d6',
                  imageHeight: 500,
                });
               this.deleteFlag=false;
        }
      })
    } else if (result.dismiss === Swal.DismissReason.cancel) {
    }
  });
}

OnChange(event:any,width:any,height:any){
  let setFlag :boolean = false;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      console.log(e.path[0].naturalHeight);
      console.log(e.path[0].naturalWidth);
      if(e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width) ){
        setFlag = true;
         this.uploadImage = file;
        let content = reader.result as string;
        this.image_URL = content;
        /* this.qf.image.setValue(file); */
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

 save(type:any){

    if(type === 'slider1'){
      if(this.slider1Form.invalid || this.image_URL ===''){
      return;
      }
      this.addLoading=true;
      this.loading=true;
      const formData = new FormData();

      formData.append('redirect_type',this.sf.slidertype.value);
      formData.append('image',this.uploadImage);

     this._admedfeed.Add_Slider1(formData).subscribe((res:any)=>{
         console.log(res,"Slider1 ADD");
          if(res.status){
            Swal.fire({
             text:  'Successfully Added',
             icon: 'success',
             showCancelButton: false,
             confirmButtonText: 'Ok',
             confirmButtonColor:  '#3085d6',
             imageHeight: 500,
            });
            this.addLoading=false;this.loading=false;
             this.ngOnInit();this.slider1Form.reset()
             this.modalService.dismissAll();this.attemptedSubmit = false;
          }
      else{
        this.addLoading = false;
        this.loading=false;
        Swal.fire({
          text:  'Something Went Wrong!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 500,
        });
        this.slider1Form.reset();
        this.image_URL = '';
      }
    })

  }
    else if(type === 'quiz'){
      if(this.quizForm.invalid || this.image_URL === ''){
      return;
      }
      this.addLoading=true;this.loading=true;
      const formData = new FormData();
      formData.append('image',this.uploadImage);
      console.log(this.uploadImage,'ImAgE');
      console.log(formData,"FORMDATA");
      this._admedfeed.Add_Quiz(formData).subscribe((res:any)=>{
      console.log(res,"Quiz ADD");
          if(res.status === true){
            Swal.fire({
              text:  'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
          this.addLoading=false;this.loading=false;
           this.ngOnInit();this.quizForm.reset()
           this.modalService.dismissAll();
          }
          else if(res.status === false){
            this.addLoading = false;
            this.loading=false;
      Swal.fire({
        text:  'Something Went Wrong!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 500,
      });
      this.quizForm.reset();
      this.image_URL = '';
    }
  })

}
  }

  edit(type:any){
    if(type === 'slider1'){
      if(this.slider1Form.invalid ){
        return;
      }
      this.addLoading=true;this.loading=true;
      const formData=new FormData();
        formData.append('sliderId',this._Id);
        formData.append('redirect_type',this.sf.slidertype.value)
        formData.append('image',this.uploadImage);
      
      this._admedfeed.Edit_Slider1(formData).subscribe((res:any)=>{
        console.log(res,"Slider1 Edit");
         if(res.status){
           Swal.fire({
            text:  'Successfully Updated',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
           });
           this.addLoading=false;this.loading=false;
            this.ngOnInit();this.slider1Form.reset()
            this.modalService.dismissAll();
         }
     else {
      this.addLoading=false;this.loading=false;
       Swal.fire({
         text:  'Something Went Wrong!!!',
         icon: 'warning',
         showCancelButton: false,
         confirmButtonText: 'Ok',
         confirmButtonColor:  '#3085d6',
         imageHeight: 500,
       });
       this.slider1Form.reset();
       this.image_URL = '';
     }
   })

 }

 else if(type === 'quiz'){
    if(this.quizForm.invalid ){
    return;
    }
    this.addLoading=true;this.loading=true;
    const formData=new FormData();

   formData.append('sliderId',this._Id);

   formData.append('image',this.uploadImage);

   console.log(formData,"Form Data");console.log(this.uploadImage,'image');

   console.log(this._Id,'sliderId');

   console.log(type,"TYPE");

   this._admedfeed.Edit_Quiz(formData).subscribe((res:any)=>{
      console.log(res,"Quiz Edit");
      if(res){
        Swal.fire({
        text:  'Successfully Updated',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 500,
        })
        this.addLoading=false;this.loading=false;
        this.ngOnInit();this.quizForm.reset()
        this.modalService.dismissAll();
      }
     else {
      this.addLoading=false;this.loading=false;
        Swal.fire({
            text:  'Something Went Wrong!!!',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
         this.quizForm.reset();
         this.image_URL = '';
      }
   })

  }
 }

  update_MC_EA(type:any){
    if (type='maincategory'){
      this.addLoading=true;this.loading=true;
       const formData=new FormData();
      formData.append('sliderId',this._Id);
      formData.append('image',this.uploadImage);
      console.log(formData,"Form Data");console.log(this.uploadImage,'image');
       console.log(this._Id,'sliderId');console.log(type,"TYPE");


       this._admedfeed.Edit_Medfeed_MC_EA(type,formData).subscribe((res:any)=>{
        console.log(res,"Update data");this.medarticleForm.reset();
        this.modalService.dismissAll();this.ngOnInit();
        if(res){
        Swal.fire({
        text:  'Maincategory Updated',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 500,
        });
        this.addLoading = false;this.loading=false;
        this.ngOnInit();this.medarticleForm.reset()
            this.modalService.dismissAll(); this.attemptedSubmit = false;
           }
        else{
          this.addLoading = false;
          this.loading=false;
          Swal.fire({
            text: 'Something Went Wrong!!!',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 50,
          });
        }
     });
    }
  }

  updateExpertCategory(type:any){
    this.addLoading=true;this.loading=true;
     if (type='expertadvise'){
      const formData=new FormData();
     formData.append('sliderId',this._Id);
     formData.append('image',this.uploadImage);
     console.log(formData,"Form Data");console.log(this.uploadImage,'image');
      console.log(this._Id,'sliderId');console.log(type,"TYPE");


      this._admedfeed.Edit_Medfeed_MC_EA(type,formData).subscribe((res:any)=>{
       console.log(res,"Update data");
       if(res){
       Swal.fire({
       text:  'Expert Advice Updated',
       icon: 'success',
       showCancelButton: false,
       confirmButtonText: 'Ok',
       confirmButtonColor:  '#3085d6',
       imageHeight: 500,
       });
       this.addLoading = false;this.loading=false;
       this.ngOnInit();this.expertadviseForm.reset();
       this.modalService.dismissAll();
      }
       else{
         this.addLoading = false;
         this.loading=false;
         Swal.fire({
           text: 'Something Went Wrong!!!',
           icon: 'warning',
           showCancelButton: false,
           confirmButtonText: 'Ok',
           confirmButtonColor:  '#3085d6',
           imageHeight: 50,
         });
       }
    });
   }
  }

  updateQuizOne(){
    this.addLoading=true;this.loading=true;

      const formData=new FormData();
     formData.append('sliderId',this._Id);
     formData.append('image',this.uploadImage);
     console.log(formData,"Form Data");console.log(this.uploadImage,'image');
      console.log(this._Id,'sliderId');
      this._admedfeed.Edit_QuizOne(formData).subscribe((res:any)=>{
       console.log(res,"Update data");
       if(res){
       Swal.fire({
       text:  'Quiz  Updated',
       icon: 'success',
       showCancelButton: false,
       confirmButtonText: 'Ok',
       confirmButtonColor:  '#3085d6',
       imageHeight: 500,
       });
       this.addLoading = false;this.loading=false;
       this.ngOnInit();this.Quiz1Form.reset();
       this.modalService.dismissAll();
      }
       else{
         this.addLoading = false;
         this.loading=false;
         Swal.fire({
           text: 'Something Went Wrong!!!',
           icon: 'warning',
           showCancelButton: false,
           confirmButtonText: 'Ok',
           confirmButtonColor:  '#3085d6',
           imageHeight: 50,
         });
       }
    });

  }


  deleteQuiz(id:any){
    this.deleteFlag=true;console.log(id,"Delete ID");
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
        this._admedfeed.Delete_Quiz(id).subscribe((res:any)=>{
          if(res !=''){
            this.ngOnInit();
            Swal.fire({
                    text:'Successfully Deleted',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor:  '#3085d6',
                    imageHeight: 500,
                  });
                 this.deleteFlag=false;
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }


  close(){
    this.image_URL = '';
    this.slider1Form.reset();
    this.quizForm.reset();
    this.Quiz1Form.reset();
    this.medarticleForm.reset();
    this.expertadviseForm.reset();
    this.modalService.dismissAll();
  }
  testfn(){
    console.log("TESTING");
    console.log(this.sf.slidertype.value,'redirect_type');
    console.log(this.sf.image.value,'image');
  }


}
