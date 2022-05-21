import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router }  from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-statement-promo',
  templateUrl: './statement-promo.component.html',
  styleUrls: ['./statement-promo.component.scss']
})
export class StatementPromoComponent implements OnInit {
  public closeResult: string;
  constructor(private modalService: NgbModal,
    private _route:Router,
    private intl: IntlService) { }

    private tabSet: ViewContainerRef;

    @ViewChild(NgbTabset) set content(content: ViewContainerRef) {
      this.tabSet = content;
    };
  
    ngAfterViewInit() {
      //console.log(this.tabSet.activeId);
    }


  ngOnInit(): void {
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

}
