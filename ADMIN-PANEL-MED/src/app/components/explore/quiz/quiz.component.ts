import { Component, OnInit ,ViewContainerRef ,ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { MedQuizService } from 'src/app/services/med-quiz.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, ParamMap }  from '@angular/router';
import { SharedServiceService } from 'src/app/shared-service.service';
import { NgbDatepickerConfig, NgbDateStruct,NgbDateParserFormatter, NgbDate, NgbCalendar, NgbModal, ModalDismissReasons ,NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {


  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;
  public addFlag :boolean;


  private tabSet: ViewContainerRef;
  public hasError:boolean = false;
  
  selectedTab :any;

  @ViewChild(NgbTabset) set content(content: ViewContainerRef) {
    this.tabSet = content;
  };


  public Answers: any = [
    { 'text': 'Option A','value' : '1'},
    { 'text': 'Option B','value' : '2'},
    { 'text': 'Option C','value' : '3'},
    { 'text': 'Option D','value' : '4'},
  ];

  public formArray = [{
    question : '',
    option1 : '',
    option2 : '',
    option3 : '',
    option4 : '',
    correctindex : ''
  }];
  public temp:any;
  public editQuizID :any;
  public activeQuiz :boolean;
  public editMode :boolean = false;
  public addLoading:boolean = false;
  public updateLoading:boolean = false;
  public startMinDate :any;
  public startMaxDate :any;
  public endMinDate :any;
  public endMaxDate :any;
  public quizForm:FormGroup;
  public attemptedSubmit :any;
  public previusQuizWinners :any = [];
  public liveQuizDetails :any = [];
  public startDate :any;
  public endDate :any;
  public liveQuizParticipants :any = [];
  public liveQuizQuestions :any = [];
  public quizName :any;
  public totalParticipants :any;
  public quizID :any;
  public minDate :any;

  public upcomingDetails :any = [];


  
  public upcomingQuizQuestions :any = [];
  public upcomingQuizId :any;
  public upcomingQuizName :any;
  public upcomingQuizStartingDate :any;
  public upcomingQuizEndingDate :any;
  public upcomingActiveQuiz :boolean;


  public formOption = {
    question : "",
    option1 : "",
    option2 : "",
    option3 : "",
    option4 : "",
    correctindex : ""
  };



   model: NgbDateStruct;
   markDisabled;

   hoveredDate: NgbDate | null = null;

   fromDate: NgbDate | null;
   toDate: NgbDate | null;
 
 
  constructor(private formBuilder:FormBuilder,
    private _medQuizService:MedQuizService,
    private _route:Router,
    private shared_Service:SharedServiceService,
    private ngbdateconfig: NgbDatepickerConfig,
    private calendar: NgbCalendar,public formatter: NgbDateParserFormatter,
    private permissionService:PermissionService,
    private location: Location,) {
      

    this.getPreviouseQuizWinnersList();
    this.getLiveQuizDetails();

   // customize default values of datepickers used by this component tree
  
   // days that don't belong to current month are not visible
   ngbdateconfig.outsideDays = 'hidden';
   console.log(ngbdateconfig);

    }



  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }



    this.selectedTab = '';

      this.minDate = this.shared_Service.disablePastDate();
      this.quizForm = this.formBuilder.group({
      quizname: ['',Validators.compose([Validators.required,Validators.maxLength(255)])],
      medcoin: ['',Validators.compose([Validators.required,Validators.pattern('[0-9]+')])],
      startingdate: ['',Validators.required],
      endingdate: ['',Validators.required],
      quiztime: ['',Validators.compose([Validators.required,Validators.pattern('[0-9]+')])],
      formoptions:[this.formOption,Validators.required]
    })

    this.getPreviouseQuizWinnersList();
    this.getLiveQuizDetails();

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

  


  tabChangeEvent(event){
   // console.log(event.nextId);
    //localStorage.setItem("TabID",event.nextId);
    if(this.selectedTab === 'tab3' && this.editMode === true){
      if(event.nextId === 'tab1' || event.nextId === 'tab2'){
        this.editMode = false;
        this.selectedTab = event.nextId;
        this.quizForm.reset();
        this.resetForms();
      }
    }
  }

  getPreviouseQuizWinnersList(){
    this._medQuizService.get_previous_quiz_winners_list().subscribe((res:any)=>{
      this.previusQuizWinners = res.data.previous_quizzes;
    })
  }

  getLiveQuizDetails(){
    this._medQuizService.get_Live_Quiz_Winners_List().subscribe((res:any)=>{
      this.startMinDate = res.data.live_quiz.startingdate;
      this.startMaxDate = res.data.live_quiz.endingdate;

      this.quizID = res.data.live_quiz._id;
      this.quizName = res.data.live_quiz.name;
      this.activeQuiz = res.data.live_quiz.isactive;

      this.totalParticipants = res.data.live_quiz.total_participants;
      this.liveQuizQuestions = res.data.live_quiz.questions;
      this.liveQuizParticipants = res.data.live_quiz_participants;
      //upcoming Quiz details
      this.upcomingDetails =  res.data.upcoming_quizzes;

      let date = new Date();
      this.ngbdateconfig.minDate = {year: date.getFullYear(), month: date.getMonth()+1, day: date.getDay()};
      this.ngbdateconfig.maxDate = {year: 2040, month: 12, day: 31};
      
      
      console.log(this.startMinDate)

      this.setDateDisable(this.startMinDate,this.startMaxDate);
     // this.setDateDisable('2021-09-15');
     
      

      // setTimeout(()=>{
      //   // this.markDisabled = (date: NgbDate, current: {month: number}) => date.day === 13;     
      //     this.markDisabled = (date: NgbDate) =>  res.data.live_quiz.startingdate; 
        
      //    //  console.log(calendar.getWeekday(calendar.getToday()))
      //  },2000)


      // this.upcomingQuizId = res.data.upcoming_quizzes[0]._id;
      // this.upcomingQuizQuestions = res.data.upcoming_quizzes[0].questions;
      // this.upcomingQuizName = res.data.upcoming_quizzes[0].name;
      // this.upcomingActiveQuiz = res.data.upcoming_quizzes[0].isactive;
      // this.upcomingQuizStartingDate = res.data.upcoming_quizzes[0].startingdate;
      // this.upcomingQuizEndingDate = res.data.upcoming_quizzes[0].endingdate;
     
    })
  }

  setDateDisable(sdate,edate){
    
    let singledate = new Date(sdate);
    let enddate = new Date(edate);
    console.log(singledate.getDay(), enddate.getDay()+1)
    if(singledate.getDay() <= singledate.getDay() +1 ){
        this.markDisabled = (date: NgbDate, current?: { month: number }) =>
        (date.day != singledate.getDay()) || this.calendar.getWeekday(date) >= 6;
        singledate.getDay() + 1;
    }
    
  
  }

  navigateEvent(event) {
    console.log(event.next);
  }

  get f(){
    return this.quizForm.controls;
  }

 

  addForm(){
    this.formArray.push({
      question : '',
      option1 : '',
      option2 : '',
      option3 : '',
      option4 : '',
      correctindex : ''
    });
  }
  removeForm(id){
    this.formArray.splice(id, 1);
  }

  trackByFn(index: any) {
    return index;
  }


  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month,  year].join('-');
  }


  addQuiz(questionsForm:any = null){
    // console.log("questionsForm :",questionsForm,questionsForm.valid);
    if (!questionsForm.valid) {
      return false;
    }
    for(let i=0;i<this.formArray.length;i++){
      if(this.quizForm.invalid && this.formArray[i]['questions']  === '' &&
      this.formArray[i]['option1']  === '' &&
      this.formArray[i]['option2']  === '' &&
      this.formArray[i]['option3']  === '' &&
      this.formArray[i]['option4']  === '' &&
      this.formArray[i]['correctindex']  === ''){
        return;
      }
    }
    this.addLoading = true;
    let input = {
      "name": this.f.quizname.value,
      "medcoin" : this.f.medcoin.value,
      "startingdate":this.startDate,
      "endingdate":this.endDate,
      "quiztime":this.f.quiztime.value,
      "questions":this.formArray
    }
    console.log(input);
    this._medQuizService.add_quiz_details(input).subscribe((res:any)=>{
        if(res.status){
          this.addLoading = false;
          Swal.fire({
            text: 'Quiz Added',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 50,
          });
          this.ngOnInit();
          this.resetForms();
          this.selectedTab = 'tab1';
        }
        else{
          this.addLoading = false;

          if(this.startMinDate != undefined && this.startMaxDate != undefined){
            Swal.fire({
              titleText:'Sorry,Could not create a quiz on this date !!!',
              text: 'Live Quiz'+' From '+this.formatDate(this.startMinDate) +' To '+ this.formatDate(this.startMaxDate),
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            this.f.startingdate.setValue('');
            this.f.endingdate.setValue('');
          }
          else{
            Swal.fire({
              titleText:'Sorry,Could not create a quiz on this date !!!',
              //text: 'Live Quiz' ,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            this.f.startingdate.setValue('');
            this.f.endingdate.setValue('');
          }
         
        }
    });
  }

  updateQuiz( questionsForm:any = null){
    if(this.quizForm.invalid && this.formArray === []){
      return;
    }
    this.updateLoading = true;
    let input = {
      "name": this.f.quizname.value,
      "medcoin" : this.f.medcoin.value,
      "startingdate":this.startDate ? this.startDate : new Date(this.f.startingdate.value).toJSON('en-US'),
      "endingdate":this.endDate ? this.endDate : new Date(this.f.endingdate.value).toJSON('en-US'),
      "quiztime":this.f.quiztime.value,
      "questions":this.formArray
    }
    console.log(input);
    this._medQuizService.edit_quiz_details(this.editQuizID,input).subscribe((res:any)=>{
      if(res.status){
        this.updateLoading = false;
        Swal.fire({
          text: 'Quiz Updated',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
        this.resetForms();
        this.ngOnInit();
        this.selectedTab = 'tab1';
      }
      else{
        Swal.fire({
          text: 'Something Went Wrong ,try again !!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
        this.updateLoading = false;
        this.resetForms();
        this.ngOnInit();
        this.selectedTab = 'tab3';
      }
    })
  }


 

  redirectToDayQuiz(id:any){
    if(this.editFlag){
      this._route.navigate(['/explore/day-quiz', id]);
    }
  }

  getStartdate(event:any){
    this.temp = event.target.value;
    let today = new Date(event.target.value).toJSON('en-US');
    this.startDate = today;
  }

  getEnddate(event){
      let today = new Date(event.target.value).toJSON('en-US');
      this.endDate = today;
  }





  resetForms(){
    this.quizForm.reset();
    this.formArray = [];
    this.formArray.push({
      question : '',
      option1 : '',
      option2 : '',
      option3 : '',
      option4 : '',
      correctindex : ''
    });
  }

  editQuiz(type:any,id:any){
    if(type === 'live'){
      this.editMode = true;
      this.selectedTab = 'tab3';
      
     this.formArray = this.liveQuizQuestions;
      console.log(this.formArray)
      let currentQuiz :any = [];
      this._medQuizService.get_single_quiz_details(this.quizID).subscribe((res:any)=>{
        console.log(res);
        currentQuiz = res.data.quiz_details;
        this.editQuizID  = res.data.quiz_details._id;
        this.setValueQuizForm(res.data.quiz_details)
      })
    }
    else if(type === 'upcoming'){
      this.editMode = true;
      this.selectedTab = 'tab3';
      
     //this.formArray = this.upcomingQuizQuestions;
      console.log(this.formArray)
      let currentQuiz :any = [];
      this._medQuizService.get_single_quiz_details(id).subscribe((res:any)=>{
        console.log(res);
        this.formArray = res.data.quiz_details.questions;
        currentQuiz = res.data.quiz_details;
        this.editQuizID = res.data.quiz_details._id;
        this.setValueQuizForm(res.data.quiz_details)
      })
    }
 
  }

  setValueQuizForm(val){
    // let d = new Date(val.startingdate).toISOString().slice(0,10)
    // let e = new Date(val.endingdate).toISOString().slice(0,10)
      this.f.quizname.setValue(val.name);
      this.f.medcoin.setValue(val.medcoin);
      this.f.startingdate.setValue(val.startingdate);
      this.f.endingdate.setValue(val.endingdate);
      this.f.quiztime.setValue(val.quiztime);
      this.f.formoptions.setValue(val.questions);
  }

  disableQuizDetails(type:any,id:any){
    if(type === 'live'){
      console.log(this.quizID);

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
          this._medQuizService.disable_quiz_details(this.quizID).subscribe((res:any)=>{
            if(res.status){
                Swal.fire({
                  text: 'Success',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor:  '#3085d6',
                  imageHeight: 50,
                });
                this.ngOnInit();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }

    else if(type === 'upcoming'){
      console.log(id);

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
          this._medQuizService.disable_quiz_details(id).subscribe((res:any)=>{
            if(res.status){
                Swal.fire({
                  text: 'Success',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor:  '#3085d6',
                  imageHeight: 50,
                });
                this.ngOnInit();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }
   

   
  }

  disablePastDate(date){
   // var newdate:any = new Date();
    var toDate:any = date.getDate();
    if (toDate < 10){
      toDate = '0' + toDate;
    }

    var month:any = date.getMonth() + 1;
    if (month < 10){
      month = '0' + month;
    }

    var year = date.getFullYear();
    this.minDate = year + '-' + month + '-' + toDate;
    return this.minDate ;
  }

}
