import { Component } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'my-remarks',
  template: `
  <ng-template #exampleModalcontent let-modal>
  <div class="modal-header">
      <h5 style="color: white;opacity: 0.5;" class="modal-title f-w-200" id="exampleModal">Update</h5>
      <button style="color: white;opacity: 0.5;font-size: 31px;" type="button" class="close" aria-label="Close"
          (click)="modal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
      </button>
  </div>

  <div class="modal-body">

          <div class="form row">
              <div class="form-group col-md-12">
                  <label for="validationCustom01" class="mb-1">Choose Image</label>
                  <div class="image-data">
                      <div class="upload-btn-wrapper ">
                          <i class="icon fa fa-upload"></i><br>
                          <input type="file" name="myfile" />
                      </div>
                  </div>
              </div>
          </div>



          <div class="form row">
              <div class="form-group col-md-6">
                  <label for="validationCustom01" class="mb-1">Parent </label>
                  <select class="form-control" id="validationCustom01">
                      <option>Main Catgory</option>
                      <option>Main Catgory</option>
                      <option>Main Catgory</option>
                  </select>
              </div>
              <div class="form-group mb-0 col-md-6">
                  <label for="validationCustom02" class="mb-1">Category Name</label>
                  <input class="form-control" id="validationCustom02" type="text" placeholder="Category Name">
              </div>
          </div>

    
  </div>
  <div class="modal-footer">
      <button type="button"  class="btn  btn-dark-rounded">Save</button>
      <button class="btn btn-dark-rounded" type="button" class="btn btn-dark-rounded" type="button" data-dismiss="modal"
          (click)="modal.dismiss('Cross click')">Close</button>
  </div>
</ng-template>
  `
})
export class RemarksComponent {

    constructor(private modalService: NgbModal){

    }

    public closeResult: string;
    open(content){
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

