import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TermsAndConditionsService } from 'src/app/services/terms-and-conditions.service';
import { EditorComponent } from '@progress/kendo-angular-editor';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent implements OnInit {
  public description: any = '';
  allowEdit: boolean = false;
  addLoading: boolean = false;
  hasError: boolean = false;
  header: string;
  public pasteCleanupSettings = {
    convertMsLists: false,
    removeHtmlComments: true,
    // stripTags: ['span', 'h1'],
    // removeAttributes: ['lang'],
    removeMsClasses: false,
    removeMsStyles: false,
    removeInvalidHTML: false,
  };
  selectForm: FormGroup = new FormGroup({
    num: new FormControl(0),
  });
  termsForm: FormGroup = new FormGroup({
    description: new FormControl(null, [Validators.required]),
  });

  constructor(private _tcService: TermsAndConditionsService) {}

  ngOnInit(): void {
    this.allowEdit = false;
    this.header = 'Quiz';
    this.updateSelection();
    this.addLoading = false;
  }
  updateSelection() {
    const num = this.selectForm.get('num')!.value;
    console.log(num);
    if (num == 0) {
      this.header = 'Quiz';
    } else if (num == 1) {
      this.header = 'Medpride Membership';
    } else {
      this.header = 'Refer And Earn';
    }
    this._tcService.fetchTerms(num).subscribe(
      (res: any) => {
        if (res.status) {
          this.description = JSON.parse(JSON.stringify(res.data.description));
        } else {
          Swal.fire({
            title: 'oops!!',
            text: `${res.data}`,
            icon: 'error',
            showConfirmButton: true,
          }).then(() => {});
        }
      },
      (error) => {
        //console.log(error);
        Swal.fire({
          title: 'oops!!',
          text: `${error}`,
          icon: 'error',
          showConfirmButton: true,
        }).then(() => {});
      }
    );
  }

  onClickEdit() {
    this.allowEdit = true;
  }
  discardChanges() {
    this.allowEdit = false;
    this.hasError = false;
    this.updateSelection();
  }
  onSave() {
    this.termsForm.get('description')!.setValue(this.description);
    if (this.termsForm.invalid) {
      this.hasError = true;
    } else {
      this.save();
    }
  }

  save() {
    this.addLoading = true;
    this.hasError = false;
    const fd = new FormData();
    fd.append('description', this.termsForm.get('description')!.value);
    this._tcService
      .updateTerms(this.selectForm.get('num')!.value, fd)
      .subscribe(
        (res: any) => {
          this.addLoading = false;
          this.allowEdit = false;

          if (res.status) {
            Swal.fire({
              title: 'Done !!',
              text: `${res.data}`,
              icon: 'success',
              timer: 1000,
              showConfirmButton: false,
            }).then(() => {
              this.updateSelection();
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${res.data}!`,
              showConfirmButton: true,
            });
          }
        },
        (err: any) => {
          this.addLoading = false;
          //console.log(err);
          Swal.fire({
            title: 'Danger!!',
            text: 'server refused to connect',
            icon: 'error',
            showConfirmButton: true,
          }).then(() => {
            this.allowEdit = false;
          });
        }
      );
  }
  invalid(controlName) {
    return (
      (this.termsForm.get(controlName).invalid &&
        this.termsForm.get(controlName).touched) ||
      (this.hasError && this.termsForm.get(controlName).invalid)
    );
  }
}
