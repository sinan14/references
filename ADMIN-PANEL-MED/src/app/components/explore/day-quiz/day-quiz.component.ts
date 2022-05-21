import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons,NgbModalRef ,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Router ,ActivatedRoute}  from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { MedQuizService } from 'src/app/services/med-quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-day-quiz',
  templateUrl: './day-quiz.component.html',
  styleUrls: ['./day-quiz.component.scss']
})
export class DayQuizComponent implements OnInit {

  public customer_data = [
    {
      datetime:"Dec 25 2020 10 : 30 am",
      customerid : "#5tgf734",
      name : "Aswin Vinod",
      score:"5",
      timeused:"2 : 05 seconds"
  },
  {
    datetime:"Dec 25 2020 10 : 30 am",
    customerid : "#5tgf734",
    name : "Aswin Vinod",
    score:"5",
    timeused:"2 : 05 seconds"
  },
  {
    datetime:"Dec 25 2020 10 : 30 am",
    customerid : "#5tgf734",
    name : "Aswin Vinod",
    score:"5",
    timeused:"2 : 05 seconds"
  },
  {
    datetime:"Dec 25 2020 10 : 30 am",
    customerid : "#5tgf734",
    name : "Aswin Vinod",
    score:"5",
    timeused:"2 : 05 seconds"
  },
  {
    datetime:"Dec 25 2020 10 : 30 am",
    customerid : "#5tgf734",
    name : "Aswin Vinod",
    score:"5",
    timeused:"2 : 05 seconds"
  },
  
  ];
  
  modalReference:any =  NgbModalRef;
  public quizWinnerID :any = [];
  public quizID :any ;
  public customer_id :any;
  
  public changeColorFlag :boolean = false;
  public closeResult: string;
  public previusQuizWinners :any = [];
  public quizWinnersList :any = [];
  public prevQuestionslist :any = [];
  public prevQuizname :any;
  public totalParticipants :any;

  constructor(private modalService: NgbModal,
    private _route:Router,
    private intl: IntlService,
    public activeModal: NgbActiveModal,
    public activatedRoute: ActivatedRoute,
    private _medQuizService:MedQuizService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.quizWinnerID = params.get('winnerID');
      console.log(this.quizWinnerID);
     this.getQuizWinnerData(this.quizWinnerID);
    // this.getPreviouseQuizWinnersList(this.quizWinnerID);
    });
  }


  getQuizWinnerData(id){
    this._medQuizService.get_single_quiz_winners_list(id).subscribe((res:any)=>{
      console.log(res);
      this.quizWinnersList = res.data.participants;
      this.prevQuestionslist = res.data.quiz_details.questions;
      this.prevQuizname = res.data.quiz_details.name;
      this.quizID = res.data.quiz_details._id;
      this.totalParticipants = res.data.quiz_details.total_participants;
    })
  }

  getPreviouseQuizWinnersList(id){
    this._medQuizService.get_previous_quiz_winners_list().subscribe((res:any)=>{
      console.log(res);
      this.previusQuizWinners = res.data.previous_quizzes.find((x:any)=>x._id === id);
      console.log(this.previusQuizWinners)
    })
  }

  open(content,id:any,winnerflag:boolean) {
    if(winnerflag === false){
      this.customer_id = id;

      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else{
      Swal.fire({
        text: 'Already Anounced Winner!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 50,
      });
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


  getColor(){
    let color = 'orange';
    if (this.changeColorFlag === true) {
      color = 'yellow'
    } 
    else{
        color = 'white';
      }
    return color;
  }

  confirmModal(){
    this.changeColorFlag = true;
    let data={
      'quiz_id':this.quizID,
      'user_id':this.customer_id
    };
    console.log(data);
    this._medQuizService.delcare_quiz_winner(data).subscribe((res:any)=>{
      if(res.status){
        Swal.fire({
          text: 'Winner Selected',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
        this.ngOnInit();
      }
      else{
        Swal.fire({
          text: res.message,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
      }
    })

  
   this.modalService.dismissAll('Cross click');
  }

  dismissModal(){
    this.changeColorFlag = false;
   this.modalService.dismissAll('Cross click');
  }

}
