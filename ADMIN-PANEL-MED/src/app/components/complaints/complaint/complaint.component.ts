import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { ComplaintsService } from 'src/app/services/complaints.service';
import Swal from 'sweetalert2';
import { TheadTitlesRowComponent } from 'ng2-smart-table/lib/components/thead/rows/thead-titles-row.component';
import { PageChangeEvent } from "@progress/kendo-angular-grid";

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss']
})
export class ComplaintComponent implements OnInit {


  public complaint_data = [
    // {
    //   slno:"1",
    //   id:"SDDS834793",
    //   dept:"Finance Department",
    //   subject:"	Payment Failed",
    //   solvedate:"20 Dec 2021",
    //   comdate:"	15 Dec 2021",
    //   notes:"Payment Gateway Failure",
    //   handle:"Aswin Vinod"
    // },
    // {
    //   slno:"2",
    //   id:"SDDS834793",
    //   dept:"Finance Department",
    //   subject:"	Payment Failed",
    //   solvedate:"20 Dec 2021",
    //   comdate:"	15 Dec 2021",
    //   notes:"Payment Gateway Failure",
    //   handle:"Aswin Vinod"
    // },
    // {
    //   slno:"3",
    //   id:"SDDS834793",
    //   dept:"Finance Department",
    //   subject:"	Payment Failed",
    //   solvedate:"20 Dec 2021",
    //   comdate:"	15 Dec 2021",
    //   notes:"Payment Gateway Failure",
    //   handle:"Aswin Vinod"
    // },
    // {
    //   slno:"4",
    //   id:"SDDS834793",
    //   dept:"Finance Department",
    //   subject:"	Payment Failed",
    //   solvedate:"20 Dec 2021",
    //   comdate:"	15 Dec 2021",
    //   notes:"Payment Gateway Failure",
    //   handle:"Aswin Vinod"
    // },
    // {
    //   slno:"5",
    //   id:"SDDS834793",
    //   dept:"Finance Department",
    //   subject:"	Payment Failed",
    //   solvedate:"20 Dec 2021",
    //   comdate:"	15 Dec 2021",
    //   notes:"Payment Gateway Failure",
    //   handle:"Aswin Vinod"
    // },
  ]


  public ucomplaint_data = [
    // {
    //   slno:"1",
    //   id:"SDDS834793",
    //   subject:"	Payment Failed",
    //   comdate:"	15 Dec 2021",
    // },
    // {
    //   slno:"2",
    //   id:"SDDS834793",
    //   subject:"	Payment Failed",
    //   comdate:"	15 Dec 2021",
    // },
    // {
    //   slno:"3",
    //   id:"SDDS834793",
    //   subject:"	Payment Failed",
    //   comdate:"	15 Dec 2021",
    // },
    // {
    //   slno:"4",
    //   id:"SDDS834793",
    //   subject:"	Payment Failed",
    //   comdate:"	15 Dec 2021",
    // },
    // {
    //   slno:"5",
    //   id:"SDDS834793",
    //   subject:"	Payment Failed",
    //   comdate:"	15 Dec 2021",
    // },
  ]

  public closeResult: string;
  public accountForm: FormGroup;
  public permissionForm: FormGroup;

  public media = []


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

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  public Customer_Name:any = '';
  public ComplaintId: any = '';
  public Department: any = '';
  public Subject: any = '';
  public ComplaintDate: any = '';
  public SolvedDate: any = '';
  public Description: any = '';
  public HandledBy: any = '';
  public Solution: any = '';
  public Name: any = '';
  public Update_Complaint_Form: FormGroup
  public Submitted: boolean = false;
  public Main_Id: any = '';


  public skip = 0;
 


  public DateNow = new Date().toISOString();

  // .split('T')[0]


  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private location: Location,
    private Complaint_Service: ComplaintsService) {
    this.media = mediaDB.data;
  }

  ngOnInit(): void {


    console.log(this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));
    this.Name = ''

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    if (this.user.isAdmin == false) {
      this.Name = this.user.name
    } else if (this.user.isAdmin == true) {
      this.Name = 'ADMIN'
    }
    // isAdmin: true




    this.get_COMPLAINTS_BY_TYPE('solved')

    this.Update_Complaint_Form = this.formBuilder.group({
      solution: ['', Validators.required]
    })

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



  get_COMPLAINTS_BY_TYPE(type) {
    let body = {
      "Type":type
    }
    this.Complaint_Service.get_COMPLAINTS_BY_TYPE(body).subscribe((res: any) => {
      console.log(res);

      if (type == 'solved') {
        let new_Complaint_Array = []
        new_Complaint_Array = res.data.map((itm, index) => {
          return {
            slno: index + 1,
            ComplaintId: itm.ComplaintId,
            Department: itm.Department,
            ReasonForComplaint: itm.ReasonForComplaint,
            solvedDate: itm.solvedDate,
            date: itm.date,
            Notes: itm.Notes,
            name:itm.name,
            HandledBy: itm.HandledBy,
            _id: itm._id
          }
        })
        this.complaint_data = []

        this.complaint_data = new_Complaint_Array
      } else if (type == 'unsolved') {

        let new_Uncomplaint_Array = []
        new_Uncomplaint_Array = res.data.map((itm, index) => {
          return {
            slno: index + 1,
            ComplaintId: itm.ComplaintId,
            ReasonForComplaint: itm.ReasonForComplaint,
            date: itm.date,
            _id: itm._id,
            name:itm.name,
            // Department:itm.Department,
            // Notes:itm.Notes,
            // HandledBy:itm.HandledBy,
          }
        })


        this.ucomplaint_data = []
        this.ucomplaint_data = new_Uncomplaint_Array
      }
    })
  }



  Tab_Change_Function(event) {
    if (event.nextId == 'solved') {
      this.get_COMPLAINTS_BY_TYPE('solved')
      this.skip = 0;
    }
    else if (event.nextId == 'unsolved') {
      this.get_COMPLAINTS_BY_TYPE('unsolved')
      this.skip = 0;

    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    //  this.get_ALL_BRANDS()
    // this.Brands({ activeId: 'all', nextId: 'promoted' })
    // this.Brands({ activeId: 'all', nextId: 'shop' })
    // this.Brands({ activeId: 'all', nextId: 'trending' })
    // this.Brands({ activeId: 'all', nextId: 'featured' })
  }


  updatet_COMPLAINT_STATUS() {
    this.Submitted = true
    if (this.Update_Complaint_Form.valid) {

      let body = {
        "ComplaintId": this.ComplaintId,
        "complaintStatus": true,
        "solvedDate": this.DateNow,
        "HandledBy": this.Name,
        "Notes": this.Update_Complaint_Form.get('solution').value
      }
      console.log(body, this.Main_Id);

      this.Complaint_Service.updatet_COMPLAINT_STATUS(this.Main_Id, body).subscribe((res: any) => {
        console.log(res);
this.pop(res)
      })
    }
  }





  open(content, id, Mainid, type) {
    console.log(Mainid);

    this.Submitted = false
    // this.Main_Id = ''
    // this.Customer_Name = ''
    // this.ComplaintId = ''
    // this.Department = ''
    // this.Subject = ''
    // this.ComplaintDate = ''
    // this.SolvedDate = ''
    // this.Description = ''
    // this.HandledBy = ''
    // this.Solution = ''

    if (id != '') {
      this.Complaint_Service.get_USER_SINGLE_COMPLAINT(id).subscribe((res: any) => {
        if (type == 'view') {
          this.Solution = res.data[0].Notes
          this.HandledBy = res.data[0].HandledBy
        } else if (type == 'solve') {
          this.Main_Id = Mainid
        }
        this.Customer_Name = res.data[0].name
        this.ComplaintId = res.data[0].ComplaintId
        this.Department = res.data[0].Department
        this.Subject = res.data[0].ReasonForComplaint
        this.ComplaintDate = res.data[0].date
        this.SolvedDate = res.data[0].solvedDate
        this.Description = res.data[0].Details
      })
    }





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



  pop(res: any) {

    console.log(res.data, "res data");
    console.log(res.status, "res status");
    // this.attemptedSubmit = false
    if (res.status === true) {
      Swal.fire({
        text: res.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
      this.get_COMPLAINTS_BY_TYPE('solved')
      this.get_COMPLAINTS_BY_TYPE('unsolved')
      this.Update_Complaint_Form.reset()
      this.skip = 0;
    } else {
      Swal.fire({
        text: res.data,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })

    }
    // this.addLoading = false;
    this.modalService.dismissAll()
    this.Submitted = false;
  }




}
