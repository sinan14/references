import { Component, OnInit } from '@angular/core';
import { productDB } from 'src/app/shared/tables/product-list';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-medi-mall',
  templateUrl: './medi-mall.component.html',
  styleUrls: ['./medi-mall.component.scss']
})
export class MediMallComponent implements OnInit {
  
  public product_list = []
  public closeResult: string;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { 
    
    this.product_list = productDB.product;
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


  popup(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  

  ngOnInit(): void {
  }




}
