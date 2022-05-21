import { Component, OnInit ,ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router }  from '@angular/router';
import { categoryDB } from '../../../shared/tables/category';
import { IntlService } from '@progress/kendo-angular-intl';
import { CalendarOptions } from '@fullcalendar/angular';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  public closeResult: string;
  public events: string[] = [];

  Events = [];
  calendarOptions: CalendarOptions;


  constructor(private modalService: NgbModal,
    private _route:Router,
    private intl: IntlService,
    private httpClient: HttpClient) { }

  ngOnInit(): void {

    setTimeout(() => {
            console.log(this.Events);
    }, 2200);

    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        dateClick: this.onDateClick.bind(this),
        events: [
          { title: 'Diwali Offer', date: '2021-06-05' },
          { title: 'Diwali Offer', date: '2021-06-07' },
          { title: 'Diwali Offer', date: '2021-06-07' }
        ]
      };
    }, 2500);
        

  }


  eventClick(model) {
    console.log(model);
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  onDateClick(res) {
    alert('Clicked on date : ' + res.dateStr)
  }

}
