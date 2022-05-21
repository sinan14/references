import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HealthVaultService } from 'src/app/services/health-vault.service';
import Swal from 'sweetalert2';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-health-vault',
  templateUrl: './health-vault.component.html',
  styleUrls: ['./health-vault.component.css'],
})
export class HealthVaultComponent implements OnInit {
  hvPhoto: any = false;
  categories: string[] = ['Lab Report', 'Prescription'];
  hasErrorHvForm: boolean = false;
  public updateHvFlag: boolean;
  public showVlog: boolean = false;
  public clickToShow() {
    this.showVlog = !this.showVlog;
  }

  public userHealthVault: any = [];
  public userNames: any = [];

  constructor(
    private _hvs: HealthVaultService,
    private _fb: FormBuilder,
    private _cartService: CartService,
    private _router: Router
  ) {}
  hvForm: FormGroup = this._fb.group({
    id: [''],
    patientId: ['', [Validators.required]],
    prescription: ['', [Validators.required]],
    category: ['Lab Report', Validators.required],
  });
  ngOnInit(): void {
    this.getUserHealthVault();
    this.getUserNames();
  }

  getUserHealthVault() {
    this.hvPhoto = false;
    this.hasErrorHvForm = false;
    this.hvForm.reset();
    this.updateHvFlag = false;
    this._hvs.get_user_health_vault().subscribe(
      (res: any) => {
        //console.log(res);
        if (res.error == false) {
          this.userHealthVault = JSON.parse(JSON.stringify(res.data));
        } else {
          this.alertMsg('error', res.message);
        }
      },
      (err: any) => {
        //console.log(err.message);
      }
    );
  }
  getUserNames() {
    this._hvs.get_user_name_by_user_id().subscribe(
      (res: any) => {
        //console.log(res);
        if (res.error == false) {
          this.userNames = JSON.parse(JSON.stringify(res.data));
        } else {
          this.alertMsg('error', res.message);
        }
      },
      (err: any) => {
        //console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'something went wrong',
        });
      }
    );
  }

  addHv(hv) {
    this.hvForm.reset();
    document.getElementById('dismiss-hv-Form').click();
    this._hvs.add_user_health_vault(hv).subscribe(
      (res: any) => {
        if (res.error == false) {
          this.alertMsg('success', res.message);
        } else {
          this.alertMsg('error', res.message);
        }
      },
      (err: any) => {
        //console.log(err);
      }
    );
  }
  editHv(hv) {
    this.hvForm.reset();
    document.getElementById('dismiss-hv-Form').click();
    this._hvs.edit_user_health_vault(hv).subscribe(
      (res: any) => {
        if (res.error == false) {
          this.alertMsg('success', res.message);
        } else {
          this.alertMsg('error', res.message);
        }
      },
      (err: any) => {
        //console.log(err);
      }
    );
  }
  updateThis(hv) {
    this.hvForm.patchValue({
      id: hv._id,
      patientId: hv.patientId,
      category: hv.category,
      prescription: hv.prescription,
    });
    this.updateHvFlag = true;
    document.getElementById('bt1').click();
    this.hvPhoto = hv.prescription;
  }
  addNewHv() {
    document.getElementById('bt1').click();
    this.hvPhoto = false;
  }

  deleteThis(hv) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this._hvs.delete_user_health_vault(hv._id).subscribe(
          (res: any) => {
            if (res.error === false) {
              this.userHealthVault = this.userHealthVault.filter(
                (healthVault) => healthVault !== hv
              );
              Swal.fire({
                icon: 'success',
                title: res.message,
              });
            } else {
              this.alertMsg('error', 'res.message');
            }
          },
          (err: any) => {
            //console.log(err);
            Swal.fire({
              icon: 'error',
              title: 'something went wrong',
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  onChangePres(event: any, width: any, height: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);
    //console.log(file);
    Img.onload = (e: any) => {
      this.hvForm.get('prescription')!.setValue(file);
      let content = reader.result as string;
      this.hvPhoto = content;
    };
  }
  onAddOrEdit() {
    //console.log(this.hvForm.value);
    // if (this.hvPhoto !== false || this.prescriptionImag !== '') {
    //   // this.hvForm.get('prescription')!.setValue(this.prescriptionImag);
    // }
    if (this.hvForm.invalid) {
      this.hasErrorHvForm = true;
      return;
    } else {
      const fd = new FormData();
      fd.append('id', this.hvForm.get('id')!.value);
      fd.append('patientId', this.hvForm.get('patientId')!.value);
      fd.append('category', this.hvForm.get('category')!.value);
      fd.append('prescription', this.hvForm.get('prescription')!.value);

      //@ts-ignore
      //console.log(Object.fromEntries(fd));
      //console.log('hurrrrrreiiii');
      //console.log(this.hvForm.get('id').value);
      if (this.hvForm.get('id').value === null) {
        this.addHv(fd);
      } else {
        this.editHv(fd);
      }
    }
  }
  isValidHv(controlName: any) {
    return (
      (this.hvForm.get(controlName)!.invalid &&
        this.hvForm.get(controlName)!.touched) ||
      (this.hasErrorHvForm && this.hvForm.get(controlName).invalid)
    );
  }

  openForm() {
    document.getElementById('bt1');
  }
  closeForm() {
    document.getElementById('dismiss-hv-Form').click();
  }
  resetForm() {
    this.hvForm.reset();
    this.updateHvFlag = false;
    (<HTMLInputElement>document.getElementById('uploadHvFile')).value = '';
    this.hvPhoto = false;
  }

  // selectHealthVault(data: any) {
  //   alert(data);
  //   if (data != null) {
  //     this._cartService.selectedHealthData = data;
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Prescription Selected',
  //       showConfirmButton: true,
  //     });
  //     this._router.navigate(['/cart']);
  //   }
  // }
  alertMsg(icon, title) {
    Swal.fire({
      icon,
      title,
    }).then(() => this.getUserHealthVault());
  }
}
