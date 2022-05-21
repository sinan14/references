import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-expiry-inventory',
  templateUrl: './expiry-inventory.component.html',
  styleUrls: ['./expiry-inventory.component.scss']
})
export class ExpiryInventoryComponent implements OnInit {

 
  public listCategory: Array<string> = ['Category 1', 'Category 2', 'Category 3','Category 4'];
  public closeResult: string;

  
  public vendors = [
    {
      image:"assets/images/electronics/product/medical-mask.png",
      MedimallID : "36758",
      SKNNO : "254",
      sku:"2343",
      Name: "Haire Oil",
      Categories:"baby Care",
      Brand:"Pathanjali",
      Price:"124",
      Quantity:"432",
      stock:"100",
      expiry:"Dec 20 2021",
      Status:"<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches1' checked><label class='custom-control-label' for='customSwitches1'></label></div> "
  },
  {
    image:"assets/images/electronics/product/facewash.png",
    MedimallID : "36758",
    SKNNO : "254",
    sku:"2343",
    Name: "Haire Oil",
    Categories:"baby Care",
    Brand:"Pathanjali",
    Price:" 124",
    Quantity:"432",
    stock:"100",
    expiry:"Dec 20 2021",
    Status:"<div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches2' checked='true'><label class='custom-control-label' for='customSwitches2'></label></div> "
},
{
  image:"assets/images/electronics/product/medical-mask.png",
  MedimallID : "36758",
  SKNNO : "254",
  sku:"2343",
  Name: "Haire Oil",
  Categories:"baby Care",
  Brand:"Pathanjali",
  Price:"124",
  Quantity:"432",
  stock:"100",
  expiry:"Dec 20 2021",
  Status:"<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches3' checked='true'><label class='custom-control-label' for='customSwitches3'></label></div> "
},
{
  image:"assets/images/electronics/product/facewash.png",
  MedimallID : "36758",
  SKNNO : "254",
  sku:"2343",
  Name: "Haire Oil",
  Categories:"baby Care",
  Brand:"Pathanjali",
  Price:"124",
  Quantity:"432",
  stock:"100",
  expiry:"Dec 20 2021",
  Status:"<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches4' checked='true'><label class='custom-control-label' for='customSwitches4'></label></div> "
},
{
  image:"assets/images/electronics/product/medical-mask.png",
  MedimallID : "36758",
  SKNNO : "254",
  sku:"2343",
  Name: "Haire Oil",
  Categories:"baby Care",
  Brand:"Pathanjali",
  Price:"124",
  Quantity:"432",
  stock:"100",
  expiry:"Dec 20 2021",
  Status:"<button type='button' class='btn btn-sm btn-primary'>EDIT</button><div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='customSwitches5' checked='true'><label class='custom-control-label' for='customSwitches5'></label></div> "
},
  
  ];


  constructor(private _router: Router,
    private modalService: NgbModal) { }

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
