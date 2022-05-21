import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserDashboardService } from 'src/app/services/user-dashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-add-family',
  templateUrl: './profile-add-family.component.html',
  styleUrls: ['./profile-add-family.component.css'],
})
export class ProfileAddFamilyComponent implements OnInit {
  public errorFamilyForm: boolean = false;
  familyMemberData: any;
  public updateFlag: boolean = false;
  public familyPhoto: any = false;
  public floatReg: any = /^(?!0\d)\d*(\.\d+)?$/;
  public bgroup: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  constructor(
    public _userService: UserDashboardService,
    private _fb: FormBuilder
  ) {}
  familyForm: FormGroup;
  ngOnInit(): void {
    this.familyForm = this._fb.group({
      permissionToShare: [false, Validators.required],
      _id: [null],
      image: [null],
      relation: [null, [Validators.required, Validators.minLength(1)]],
      age: [
        null,
        [Validators.required, Validators.min(0), Validators.max(200)],
      ],
      name: [null, [Validators.required, Validators.minLength(3)]],
      surname: [null, [Validators.required]],
      bloodGroup: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      height: [
        null,
        [
          Validators.required,
          Validators.pattern(this.floatReg),
          Validators.min(1),
          Validators.max(255),
        ],
      ],
      weight: [
        null,
        [
          Validators.required,
          Validators.pattern(this.floatReg),
          Validators.min(1),
          Validators.max(255),
        ],
      ],
    });

    this.errorFamilyForm = false;
    this.updateFlag = false;
    this.familyPhoto = false;
    this._userService.familyMemberChanged.subscribe((data: any) => {
      // if (data !== 'false') {
      //   // this.getFamilyMember(data);
      // } else {
      //   this.familyForm.reset();
      //   this.familyPhoto = false;
      //   this.errorFamilyForm = false;
      // }
      if (data) {
        this.familyMemberData = data;
        this.patchFamilyForm(data);
      } else {
        this.familyForm.reset();
        this.familyPhoto = false;
        this.updateFlag = false;
      }
    });

    this._userService.familyMemberChanged.subscribe((data: any) => {
      if (data !== 'false') {
        // this.getFamilyMember(data);
      } else {
        this.familyForm.reset();
        this.familyPhoto = false;
        this.errorFamilyForm = false;
      }
    });
  }

  validateAge() {
    if (this.familyForm.get('age')!.invalid) {
      this.familyForm.patchValue({
        age: null,
      });
    }
  }
  validateHeight() {
    if (this.familyForm.get('height')!.invalid) {
      this.familyForm.patchValue({
        height: null,
      });
    }
  }
  validateWeight() {
    if (this.familyForm.get('weight')!.invalid) {
      this.familyForm.patchValue({
        weight: null,
      });
    }
  }

  invalidFamily(controlName: any) {
    return (
      (this.familyForm.get(controlName)!.invalid &&
        this.familyForm.get(controlName)!.touched) ||
      (this.errorFamilyForm && this.familyForm.get(controlName)!.invalid)
    );
  }

  onChangeFamilyPhoto(event: any, width: any, height: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);
    Img.onload = (e: any) => {
      this.familyForm.get('image')!.setValue(file);
      let content = reader.result as string;
      this.familyPhoto = content;
      console.log(this.familyPhoto);
    };
  }
  onSubmitFamily() {
    if (
      this.familyForm.invalid ||
      this.familyForm.value.permissionToShare == false
    ) {
      console.log(this.familyForm.value);
      this.errorFamilyForm = true;
      return;
    } else {
      console.log(this.familyForm.value);
      this.appendingToFormData();
    }
  }
  appendingToFormData() {
    const fd = new FormData();
    fd.append('image', this.familyForm.get('image')!.value);
    fd.append('relation', this.familyForm.get('relation')!.value);
    fd.append('age', this.familyForm.get('age')!.value);
    fd.append('name', this.familyForm.get('name')!.value);
    fd.append('surname', this.familyForm.get('surname')!.value);
    fd.append('bloodGroup', this.familyForm.get('bloodGroup')!.value);
    fd.append('gender', this.familyForm.get('gender')!.value);
    fd.append('height', this.familyForm.get('height')!.value);
    fd.append('weight', this.familyForm.get('weight')!.value);
    if (this.updateFlag) {
      fd.append('id', this.familyForm.get('_id')!.value);
      //@ts-ignore
      console.log(Object.fromEntries(fd));
      this.updateFamily(fd);
    } else {
      this.addFamilyToDb(fd);
    }
  }
  addFamilyToDb(fd) {
    this._userService.addUserFamilyDetails(fd).subscribe(
      (res: any) => {
        if (res.error === false) {
          this.successMessage(res);
        } else {
          this.errorMessage(res);
        }
      },
      (err: any) => {
        this.serverError(err);
      }
    );
  }
  updateFamily(fd) {
    this._userService.editUserFamilyDetails(fd).subscribe(
      (res: any) => {
        if (res.error === false) {
          this.successMessage(res);
        } else {
          this.errorMessage(res);
        }
      },
      (err: any) => {
        this.serverError(err);
      }
    );
  }
  deleteFamilyMember(member) {
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
        this._userService.deleteOneUserFamilyDetails(member._id).subscribe(
          (res: any) => {
            if (res.error === false) {
              this.successMessage(res)
            } else {
              this.errorMessage(res);
            }
          },
          (err: any) => {
            this.serverError(err);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  // getFamilyMember(id) {
  //   this._userService.getOneUserFamilyDetails(id).subscribe(
  //     (res: any) => {
  //       console.log(res.data);
  //       if (res.error === false) {
  //         this.patchFamilyForm(JSON.parse(JSON.stringify(res.data)));
  //       } else {
  //         this.errorMessage(res);
  //       }
  //     },
  //     (err: any) => {
  //       this.serverError(err);
  //     }
  //   );
  // }
  patchFamilyForm(val) {
    this.updateFlag = true;
    this.familyPhoto = val.image;
    this.familyForm.patchValue({
      _id: val._id,
      image: val.image,
      relation: val.relation,
      age: val.age,
      name: val.name,
      surname: val.surname,
      bloodGroup: val.bloodGroup,
      gender: val.gender,
      height: val.height,
      weight: val.weight,
      permissionToShare: true,
    });
    console.log(this.familyForm.value);
  }
  successMessage(response: any) {
    this._userService.getFamilyMembers()
    console.log(response);
    this.updateFlag = false;
    Swal.fire({
      icon: 'success',
      title: `${response.message}`,
    }).then(() => {
      this.familyForm.reset();
      this.ngOnInit();
    });
  }
  errorMessage(response: any) {
    console.log(response);
    this.familyForm.reset();
    Swal.fire({
      icon: 'error',
      title: `${response.message}`,
    }).then(() => {
      this.ngOnInit();
    });
  }
  serverError(error) {
    console.log('server refused to connect');
    console.log(error);
  }
}
