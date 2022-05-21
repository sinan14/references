import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-delivery-area',
  templateUrl: './delivery-area.component.html',
  styleUrls: ['./delivery-area.component.scss']
})
export class DeliveryAreaComponent implements OnInit {

  public vendors = [
    {
      no:"1",
      postoffice : "Chaliyam",
      coveringarea:"Chaliyam",
      pincode:"673301",
      standardcharge:"20.00",
      expresscharge:"50.00",
    },
    {
      no:"2",
      postoffice : "Kundayithode",
      coveringarea:"Chaliyam",
      pincode:"673301",
      standardcharge:"20.00",
      expresscharge:"50.00",
    },

    {
      no:"3",
      postoffice : "Kolathara",
      coveringarea:"Chaliyam",
      pincode:"673301",
      standardcharge:"20.00",
      expresscharge:"50.00",
    },
    
    {
      no:"4",
      postoffice : "Mathottam",
      coveringarea:"Chaliyam",
      pincode:"673301",
      standardcharge:"20.00",
      expresscharge:"50.00",
    },
    
    {
      no:"5",
      postoffice : "Mannur",
      coveringarea:"Chaliyam",
      pincode:"673301",
      standardcharge:"20.00",
      expresscharge:"50.00",
    },
  
  ];


  public settings = {
    mode: 'external',
    actions: {
      columnTitle: '',
      add:false,
      position: 'right'
    },
    columns: {
      no: {
        title: 'No',
      },
      postoffice: {
        title: 'Post Office',
      },
      coveringarea: {
        title: 'Covering Area',
      },
      pincode: {
        title: 'Pincode',
      },
      standardcharge: {
        title: 'Standard Charge',
      },
      expresscharge: {
        title: 'Express Charge',
      }
    },
  };


  editRow(event,content,Value) {
    //console.log('event: ', event)
    if(Value === 'edit'){
      this.add_Modal_Flag = false;
      this.update_Modal_Flag = true;
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
}
  public closeResult: string;
//NEW VARIABLES

public permissions :any = [];
public user :any = [];
public currentPrivilages :any = [];
public aciveTagFlag :boolean = true;
public editFlag :boolean;
public deleteFlag :boolean;
public viewFlag :boolean;
public addFlag :boolean;

  
  constructor( private _router: Router,
    private modalService: NgbModal,
    private permissionService:PermissionService,
    private location: Location,) {
  }

  ngOnInit(): void {
    
    console.log( this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }

  }

  disableTab(value){
    let flag = this.permissionService.setBoxPrivilege(value,this.user.isAdmin);
    this.addFlag = this.permissionService.addFlag;
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
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


  add_Modal_Flag :boolean = false;
  update_Modal_Flag :boolean = false;

  open(content,Value:any) {
    if(Value === 'add'){
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if(Value === 'edit'){
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
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
    
  }
  


}
