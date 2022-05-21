import { Component, OnInit,ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router }  from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { ExpertAdviceService } from 'src/app/services/expert-advice.service';
import { environment } from 'src/environments/environment.prod';
import { htmlPrefilter } from 'jquery';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import {NgbTabset} from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-healthexpert',
  templateUrl: './healthexpert.component.html',
  styleUrls: ['./healthexpert.component.scss']
})
export class HealthexpertComponent implements OnInit {
  @ViewChild('tabs')
  private tabs:NgbTabset;
public API=environment.apiUrl;
  public closeResult: string;
  public AllQuestionsList:any=[];
  public PendingQuestionList:any=[];
  public AllCategoryList:any=[];
  public category:any=[];public categoryId:any=[];public id:any=[];
  public categoryName:any=[];
  public QuestionsByCategory:any=[]
  public selectedtab:any;

  public attemptedSubmit: any;

  public replyForm:FormGroup;
  public _doctorname:any;
  public image_URL :any;
  public uploadImage:any;
  public _replyID:any;public repid:any;
  public question:any;
  public date:any;
  public uname:any;
  public uimage:any;
  public reply_Modal_Flag :boolean = false;
  public _Id:any;public elseBlock:any;
  public add_Reply_Flag :boolean = false;
  public loading :boolean = false;
  public addLoading:boolean = false;

  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;
  public addFlag :boolean;

  constructor(private modalService: NgbModal,
    private _route:Router,
    private intl: IntlService,
    private _expertadvice:ExpertAdviceService,
    private _formBuilder:FormBuilder,
    private permissionService:PermissionService,
    private location: Location,) {

      this.replyForm = this._formBuilder.group({

      doctorname: ['',Validators.required],
      image: [''],
      question: ['',Validators.required]
      })
  }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }


    this.getListQuestions();
    this.getAllCategories();
    this.getPendingQuestions();
    /*  this.getCategoryName(id); */
    /* this.getCategoryWiseQuestions(this.id); */
    /* this.getHealthExpertCategory(); */
  }
  get replyform(){
    return this.replyForm.controls;
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


  getListQuestions(){
      let type='all';
      this._expertadvice.get_List_Questions(type).subscribe((res:any)=>{
      this.AllQuestionsList=res.data.reverse();
      console.log(this.AllQuestionsList)
    });
  }

  getAllCategories(){
    this._expertadvice.get_All_Categories().subscribe((res:any)=>{
      this.AllCategoryList=res.data.category;console.log(this.AllCategoryList);
    })
  }

  getPendingQuestions(){
    let type='pending';
    this._expertadvice.get_Pending_Questions(type).subscribe((res:any)=>{
    this.PendingQuestionList=res.data.reverse();
    console.log(this.PendingQuestionList);
  });
}

getCategoryWiseQuestions(id){
 /*  alert(event.activeId) */
this._expertadvice.get_Category_Questions_By_Id(id).subscribe((res:any)=>{
this.QuestionsByCategory=res.data.reverse();
 console.log(this.QuestionsByCategory,"question");
});
}

getReplyId(id){
  this._expertadvice.Get_Questions_By_Id(id).subscribe((res:any)=>{

    this._replyID=res.data[0].replyId;
    this.question=res.data[0].question;
    this.date=res.data[0].createdAt;
    this.uname=res.data[0].userName;
    this.uimage=res.data[0].userImage;
    console.log(this.question,"Question");
    console.log(this._replyID,"REPLYID");
   });
}
postReply(){

  if(this.replyForm.invalid )  /* && this.image_URL === null */
  {
    return;
  }
  let id=this._Id;
  this.addLoading=true;this.loading=true;
  console.log(id,"Reply ID");
  this.reply_Modal_Flag=true;
  /*   this._doctorname=this.replyform.doctorname.value;
    this.image_URL=this.replyform.image.value;
    this._reply=this.replyform.question.value;
    let data={
      'reply': this._reply,
      'image': this.image_URL,
      'repliedBy':this._doctorname
    } */

    const formData = new FormData();
    formData.append('reply',this.replyform.question.value);
    formData.append('repliedBy',this.replyform.doctorname.value);
    formData.append('image',this.replyform.image.value);
    console.log(formData,"Form Data");
      this._expertadvice.Post_Reply(id,formData).subscribe((res:any)=>{
        console.log(res,"REPLYdata");
          if(res){
          Swal.fire({
            text:  'Replied',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading=false;this.loading=false;
          this.replyForm.reset();this.ngOnInit();
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
    };

  /*  getHealthExpertCategory(){
      this.id=this.AllQuestionsList[0].category_id;
      console.log(this.id,"ID");
      /* this._expertadvice.get_Health_Expert_Category(id).subscribe((res:any)=>{
      this.categoryName=res.data;

      });
    } */

  getCategoryName(id){

    this._expertadvice.get_Health_Expert_Category(id).subscribe((res:any)=>{
      this.categoryName=res.data.name;

      });
      return this.categoryName;
  }

  open(content,Value:any,id:any) {

    if(Value === 'add'){
      this.replyForm.reset();this.image_URL=null;
      this.add_Reply_Flag=true;this.getReplyId(id);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
   else if (Value === 'edit'){

    this.add_Reply_Flag=false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this._expertadvice.Get_Questions_By_Id(id).subscribe((res:any)=>{

      this.repid=res.data;console.log( this.repid,"DATAFOR");
      this.image_URL=res.data[0].image;(console.log( this.image_URL,"IMg"))

      console.log(res.data[0].replied_by,"doc");
      console.log(res.data[0].image,"img");
      console.log(res.data[0].answer,"rep");

      this.replyForm.setValue({
        'doctorname':res.data[0].replied_by,
        'image':this.image_URL,
        'question':res.data[0].answer,

     });
      /*  this._doctorname=res.data.replied_by;
      this._reply=res.data.answer;
      this.uploadImage=res.data.image;  */
     /*  if(res){
        console.log(res.data.replied_by,"UPDATE REPLY");
        this.replyForm.setValue({
           'doctorname':this._doctorname,
          'image':res.data['image'],
          'question':res.data['answer']
        });
      } */

       })
       this.getReplyId(id);
   }

   else if(Value === ''){
    this.add_Reply_Flag = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

    this._Id=id; console.log(this._Id,"ID")

    console.log(this._replyID,"DATAREPLY");
    /* return this._Id; */


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

    /*reply(){
    let id=this._Id;
    console.log(id,"Reply ID");
    /* this.reply_Modal_Flag=true;
    this._doctorname=this.replyform.doctorname.value;
    this._reply=this.replyform.question.value;
    let data={
      'Doctor Name':this._doctorname,
      'Question': this._reply
    }
    console.log(data,"Data");
  }*/
  delete(id:any){

    console.log(id,"Delete ID");
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
          this._expertadvice.Delete_Question(id).subscribe((res:any)=>{
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
                   /*  this.get_Slider_1234_ads_25_Details(type); */
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }

    //UPDATE REPLY
  Update(){

    if(this.replyForm.invalid)  /* || this.image_URL === null */
    {
      return;
    }
      let id=this._replyID;
      console.log(id,"Update ID");
      this.addLoading = true;this.loading=true;
  const formData = new FormData();
  formData.append('replyId',this._replyID);
  formData.append('reply',this.replyform.question.value);
  formData.append('repliedBy',this.replyform.doctorname.value);
  formData.append('image',this.replyform.image.value);

console.log(formData,"Form Data");
this._expertadvice.Update_Reply(id,formData).subscribe((res:any)=>{
console.log(res,"Update REPLYdata");this.replyForm.reset();
this.modalService.dismissAll();this.ngOnInit();
if(res){
Swal.fire({
text:  'Reply Updated',
icon: 'success',
showCancelButton: false,
confirmButtonText: 'Ok',
confirmButtonColor:  '#3085d6',
imageHeight: 500,
});
this.addLoading = false;this.loading=false;
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
  //Image Upload
  onChange(event:any,width:any,height:any){
    let setFlag :boolean = false;
      const reader = new FileReader();
      const file = event.target.files[0];

      /* this.replyform.image.setValue(file); */


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
          this.replyform.image.setValue(file);

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
close(){
  this.replyForm.reset();
  this.modalService.dismissAll();
}
}


