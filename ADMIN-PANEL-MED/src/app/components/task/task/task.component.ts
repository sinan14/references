import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { listCouponsDB } from 'src/app/shared/tables/list-coupon';
import { vendorsDB } from '../../../shared/tables/vendor-list';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  
  public listDepartment: Array<string> = ['Dept 1', 'Dept 2', 'Dept 3','Dept 4'];
  public list :  Array<string> = ['List 1', 'List 2'];

  public taskData:any = [
    {
      no:"1",
      name:"Asiwn Vinod",
      assignee:"Asiwn Vinod",
      task:"Task",
      date:"Dec 20",
      duedate:"Dec 20",
      status:"Completed"
    },
    {
      no:"2",
      name:"Asiwn Vinod",
      assignee:"Asiwn Vinod",
      task:"Task",
      date:"Dec 20",
      duedate:"Dec 20",
      status:"Pending"
    },
    {
      no:"3",
      name:"Asiwn Vinod",
      assignee:"Asiwn Vinod",
      task:"Task",
      date:"Dec 20",
      duedate:"Dec 20",
      status:"Completed"
    },

    {
      no:"4",
      name:"Asiwn Vinod",
      assignee:"Asiwn Vinod",
      task:"Task",
      date:"Dec 20",
      duedate:"Dec 20",
      status:"Pending"
    },


  ]
  public accountForm: FormGroup;
  public permissionForm: FormGroup;
  public media = []
  public closeResult: string;


  public digital_categories = [];
  public vendors = [];
  public selected = [];




  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,) {
    this.media = mediaDB.data;
    this.createAccountForm();
    this.createPermissionForm();

    this.vendors = vendorsDB.data;
   }

   public settings = {

    columns: {
      img: {
        title: 'Image',
        type: 'html',
      },
      file_name: {
        title: 'File Name'
      },
      url: {
        title: 'Url',
      },
    },
  };


  public config1: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };


  ngOnInit(): void {
  }


  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      fname: [''],
      lname: [''],
      email: [''],
      password: [''],
      confirmPwd: ['']
    })
  }
  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({
    })
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


  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  getColor(val:any){
    let color = 'orange';
    if (val === "Completed") {
      color = 'green'
    } 
    else if (val === "Pending"){
        color = 'orange';
      }
      else if (val === "Not Completed"){
        color = 'red';
      }
    return color;
  }


}
