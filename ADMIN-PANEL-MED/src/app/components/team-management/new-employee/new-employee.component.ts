import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Privilege from 'src/app/models/privilege.model';
import PrivilegeService from 'src/app/services/privilege.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/internal/operators';
import EmployeeService from 'src/app/services/employee.service';
import Employee from 'src/app/models/employee.model';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import DepartmentService from 'src/app/services/department.service';
import Swal from 'sweetalert2';
import { ThemeService } from 'ng2-charts';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss']
})
export class NewEmployeeComponent implements OnInit {

  public profileForm: FormGroup;
  public personalForm: FormGroup;
  public paymentAndSalaryForm: FormGroup;
  public noteForm: FormGroup;

  public accountForm: FormGroup;
  public permissionForm: FormGroup;

  public privileges;
  public checkedList = [];
  public viewOnlyList = [];
  public editList = [];
  public privilegeList = [];
  public depId;

  public departmentId;
  public editMode: boolean = false;
  public editEmployeeId: string = null;
  public employee: any = null;
  public employeeTypes: any = null;
  public notes = [];


  public profilePhotoPreview = null;
  public photo = null;
  public signature = null;
  public attachmentAdhaar = null;
  public attachmentEmployeeId = null;
  public attachmentOfferLetter = null;
  public attachmentPanCard = null;
  public attachmentPassBook = null;
  public attachmentOther = null;
  // public permissions = [];

  public loading: boolean = false;

  public today = new Date().toISOString().split('T')[0];

  constructor(
    private formBuilder: FormBuilder,
    private privilegeService: PrivilegeService,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService
  ) { }

  ngOnInit() {
    this.initProfileForm();
    this.initPersonalForm();
    this.initPaymentAndSalaryForm();
    this.initNoteForm();

    this.loadEmployeeTypes();

    this.activatedRoute.paramMap.subscribe(params => {
      this.departmentId = params.get('departmentId');
      this.editEmployeeId = params.get('employeeId');
      this.editMode = !!this.editEmployeeId;
      this.loadPrivileges(this.departmentId);

      if (this.editMode) {
        this.employeeService.get(this.editEmployeeId).subscribe(response => {
          let res: any = response;
          this.employee = res.data;
          this.notes = this.employee.notes;

          this.updateProfileForm();
          this.updatePersonalForm();
          this.updatePaymentAndSalaryForm();
          this.privileges = res.data.permissions;
          this.noteForm.controls['note'].clearValidators();
        });
      } else {

      }
    });

  }

  loadEmployeeTypes() {
    this.employeeService.getAllEmployeeTypes().subscribe(res => {
      let response: any = res;
      this.employeeTypes = response.data;
    });
  }

  preSubmitValidation(tab) {
    const profileControls = this.profileForm.controls;
    if (this.profileForm.invalid) {
      // tab.select('profile');
      // console.warn("Profile", this.profileForm);

      Object.keys(profileControls).forEach(controlName =>
        profileControls[controlName].markAsTouched()
      );
      // return;
    }

    const personalControls = this.personalForm.controls;
    if (this.personalForm.invalid) {
      // console.warn("Personal", this.personalForm);
      // tab.select('personal');
      Object.keys(personalControls).forEach(controlName =>
        personalControls[controlName].markAsTouched()
      );
      // return;
    }

    const paymentAndSalary = this.paymentAndSalaryForm.controls;
    if (this.paymentAndSalaryForm.invalid) {
      // tab.select('personal');
      Object.keys(paymentAndSalary).forEach(controlName =>
        paymentAndSalary[controlName].markAsTouched()
      );
      // return;
    }

    const noteControls = this.noteForm.controls;
    if (this.noteForm.invalid) {
      // tab.select('personal');
      Object.keys(noteControls).forEach(controlName =>
        noteControls[controlName].markAsTouched()
      );
      // return;
    }

    if (this.profileForm.invalid) {
      tab.select('profile');
      return false;
    } else if (this.personalForm.invalid) {
      tab.select('personal');
      return false;
    } else if (this.paymentAndSalaryForm.invalid) {
      tab.select('paymentAndSalary');
      return false;
    } else if (this.noteForm.invalid) {
      tab.select('Notes');
      return false;
    } else if (this.paymentAndSalaryForm.get('accountNumber').value != this.paymentAndSalaryForm.get('confirmAccountNumber').value) {
      tab.select('paymentAndSalary');
      return false;
    }

    return true;
  }

  save(tab) {
    // console.log(tab);
    let data = this.generateFormFinalData();

    if (!this.preSubmitValidation(tab)) {
      return false;
    }

    this.loading = true;
    this.employeeService.save(data).subscribe(
      result => {
        this.loading = false;
        let res: any = result;
        if (res && res.status) {
          // console.log("result", result);
          Swal.fire('', 'New Employee Created', 'success');
          this.router.navigate(['team-management/team-list/' + this.departmentId]);
        } else {
          if (res.message) {
            Swal.fire('Oops!', res.message, 'error');
          } else {
            Swal.fire('Oops!', res.data.message, 'error');
          }
        }
      },
      error => {
        this.loading = false;
        console.error(error)
      }
    );
  }

  update(tab) {
    // console.log(tab);
    let data = this.generateFormFinalData();

    if (!this.preSubmitValidation(tab)) {
      return false;
    }

    this.loading = true;
    this.employeeService.update(data, this.employee._id).subscribe(
      result => {
        this.loading = false;
        let res: any = result;
        if (res && res.status) {
          Swal.fire('', 'Employee details updated', 'success');
          this.router.navigate(['team-management/team-list/' + this.departmentId]);
        } else {
          if (res.message) {
            Swal.fire('Oops!', res.message, 'error');
          } else {
            Swal.fire('Oops!', res.data.message, 'error');
          }
        }
      },
      error => {
        this.loading = false;
        console.error(error)
      }
    );
  }



  showSuccess() {

    Swal.fire('', 'New Employee Created', 'success');
  }

  initProfileForm() {
    this.profileForm = this.formBuilder.group({
      employeeTypeId: ["",
        Validators.compose([
          Validators.required,
        ])
      ],
      firstName: ["",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255)
        ])
      ],
      lastName: [this.editMode ? this.employee.lastname : "",
      Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])
      ],
      employeeId: [this.editMode ? this.employee.employeeId : "",
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(255)
      ])
      ],
      gender: [this.editMode ? this.employee.gender : "",
      Validators.compose([
        Validators.required,
      ])
      ],
      dateOfBirth: [this.editMode ? this.employee.dob : "",
      Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])
      ],
      designation: [this.editMode ? this.employee.designation : "",
      Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])
      ],
      workEmail: [this.editMode ? this.employee.workEmail : "",
      Validators.compose([
        Validators.email,
        Validators.required,
        Validators.maxLength(255)
      ])
      ],
      workLocation: [this.editMode ? this.employee.workLocation : "",
      Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])
      ],
      password: ["",
        Validators.compose([
          // Validators.required,
          Validators.minLength(6),
          Validators.maxLength(255)
        ])
      ],
      contactNumber: [this.editMode ? this.employee.contactNumber : "",
      Validators.compose([
        Validators.required,
        Validators.pattern('[- +()0-9]+'),
        Validators.minLength(9),
        Validators.maxLength(13)
      ])
      ],
      photo: [null],
      signature: [null],
    });
  }

  loadPrivileges(departmentId: string) {
    this.employeeService.getPermissionsOfEmployee(departmentId).subscribe(res => {
      let response: any = res;
      this.privileges = response.data.map(res => {
        return {
          "name": res.permission,
          "head": res.head,
          "subOf": res.subOf,
          "all": false,
          "view": true,
          "edit": false
        }
      });
      console.log("PRIVILEGES", this.privileges);

    });
  }

  initPersonalForm() {
    this.personalForm = this.formBuilder.group({
      fatherName: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])
      ],
      bloodGroup: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])
      ],
      address: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])
      ],
      personalEmail: ["",
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(255)
        ])
      ],
      pinCode: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(6),
          Validators.maxLength(6)
        ])
      ],
      panNo: ["",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ])
      ],
      aadharNo: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(12),
          Validators.maxLength(12)
        ])
      ],
      emergencyNumber: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern('[- +()0-9]+'),
          Validators.minLength(9),
          Validators.maxLength(13)
        ])
      ],
      contactName: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])
      ],
      // contactNumber: ["",
      //   Validators.compose([
      //     Validators.required,
      //     Validators.minLength(7),
      //     Validators.maxLength(13)
      //   ])
      // ],
      attachmentAaadhar: [""],
      attachmentEmployeeId: [""],
      attachmentOfferLetter: [""],
      attachmentPanCard: [""],
      attachmentPassbook: [""],
      attachmentOther: [""],
    });
  }

  initPaymentAndSalaryForm() {
    this.paymentAndSalaryForm = this.formBuilder.group({
      annualCtc: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      monthlyCtc: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      basicSalary: ["", //???
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(10000)
        ])
      ],
      da: ["", // ?
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      hra: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      ta: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      foodCoupon: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      bonus: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      ctc: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      hraAdvancePaid: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      foodCouponAdvancePaid: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      pf: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      ebi: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      totalDeduction: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      // contactNumber: ["",
      //   Validators.compose([
      //     Validators.required,
      //     Validators.maxLength(255)
      //   ])
      // ], 
      salaryDate: ["",
        Validators.compose([
          Validators.required,
          // Validators.pattern("^[0-9]?$"),
          Validators.maxLength(255)
        ])
      ],
      grossPay: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      netPay: ["",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
          Validators.maxLength(255)
        ])
      ],
      accountNumber: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])
      ],
      confirmAccountNumber: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])
      ],
      accountHolderName: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])
      ],
      ifscCode: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])
      ],
      branchName: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])
      ],
      micrCode: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])
      ]
    });
  }

  initNoteForm() {
    this.noteForm = this.formBuilder.group({
      note: ["",
        Validators.compose([
          Validators.required,
          Validators.maxLength(2000)
        ])
      ],
    });
  }

  updateProfileForm() {
    this.profileForm.controls['password'].clearValidators();
    this.profileForm.controls['password'].setValidators(Validators.compose([
      Validators.minLength(6),
      Validators.maxLength(255)
    ]));
    // alert();
    this.profileForm.patchValue({
      employeeTypeId: this.employee.employeeType,
      firstName: this.employee.firstname,
      lastName: this.employee.lastname,
      employeeId: this.employee.employeeId,
      gender: this.employee.gender,
      dateOfBirth: this.employee.dob,
      designation: this.employee.designation,
      workEmail: this.employee.workEmail,
      workLocation: this.employee.workLocation,
      contactNumber: this.employee.contactNumber,
    });


  }


  updatePersonalForm() {
    this.profilePhotoPreview = this.employee.photo;

    this.personalForm.patchValue({
      employeeTypeId: this.employee.personal.fatherName,
      fatherName: this.employee.personal.fatherName,
      bloodGroup: this.employee.personal.bloodGroup,
      address: this.employee.personal.address,
      personalEmail: this.employee.personal.personalEmail,
      pinCode: this.employee.personal.pincode,
      panNo: this.employee.personal.panNo,
      aadharNo: this.employee.personal.aadharNo,
      emergencyNumber: this.employee.personal.emergencyNo,
      contactName: this.employee.personal.contactName,
    });

  }

  updatePaymentAndSalaryForm() {
    this.paymentAndSalaryForm.patchValue({
      annualCtc: this.employee.paymentAndSalary.annualCtc,
      monthlyCtc: this.employee.paymentAndSalary.monthlyCtc,
      basicSalary: this.employee.paymentAndSalary.addings.basicSalary,
      da: this.employee.paymentAndSalary.addings.da,
      hra: this.employee.paymentAndSalary.addings.hra,
      ta: this.employee.paymentAndSalary.addings.ta,
      foodCoupon: this.employee.paymentAndSalary.addings.foodCoupon,
      bonus: this.employee.paymentAndSalary.addings.bonus,
      ctc: this.employee.paymentAndSalary.addings.ctc,
      hraAdvancePaid: this.employee.paymentAndSalary.deductions.hraAdvancePaid,
      foodCouponAdvancePaid: this.employee.paymentAndSalary.deductions.foodCouponAdvancePaid,
      pf: this.employee.paymentAndSalary.deductions.pf,
      ebi: this.employee.paymentAndSalary.deductions.ebi,
      totalDeduction: this.employee.paymentAndSalary.deductions.totalDeduction,
      salaryDate: this.employee.paymentAndSalary.salaryDate,
      grossPay: this.employee.paymentAndSalary.grosspay,
      netPay: this.employee.paymentAndSalary.netpay,
      accountNumber: this.employee.bankDetails.accountNumber,
      confirmAccountNumber: this.employee.bankDetails.accountNumber,
      accountHolderName: this.employee.bankDetails.accountHolderName,
      ifscCode: this.employee.bankDetails.ifscCode,
      branchName: this.employee.bankDetails.branchName,
      micrCode: this.employee.bankDetails.micrCode,
    });

  }

  generateFormFinalData() {
    const formData = new FormData();

    formData.append('department', this.departmentId);

    formData.append('employeeType', this.profileForm.get('employeeTypeId').value);
    formData.append('firstname', this.profileForm.get('firstName').value);
    formData.append('lastname', this.profileForm.get('lastName').value);
    formData.append('employeeId', this.profileForm.get('employeeId').value);
    formData.append('dob', this.profileForm.get('dateOfBirth').value);
    formData.append('workEmail', this.profileForm.get('workEmail').value);
    formData.append('password', this.profileForm.get('password').value);
    formData.append('gender', this.profileForm.get('gender').value);
    formData.append('designation', this.profileForm.get('designation').value);
    formData.append('workLocation', this.profileForm.get('workLocation').value);
    formData.append('contactNumber', this.profileForm.get('contactNumber').value);
    formData.append('signature', this.signature);  // File
    formData.append('photo', this.photo); // File

    formData.append('personal[fatherName]', this.personalForm.get('fatherName').value);
    formData.append('personal[personalEmail]', this.personalForm.get('personalEmail').value);
    formData.append('personal[panNo]', this.personalForm.get('panNo').value);
    formData.append('personal[bloodGroup]', this.personalForm.get('bloodGroup').value);
    formData.append('personal[pincode]', this.personalForm.get('pinCode').value);
    formData.append('personal[aadharNo]', this.personalForm.get('aadharNo').value);
    formData.append('personal[address]', this.personalForm.get('address').value);
    formData.append('personal[emergencyNo]', this.personalForm.get('emergencyNumber').value);
    formData.append('personal[contactName]', this.personalForm.get('contactName').value);

    formData.append('aadhar', this.attachmentAdhaar);// File
    formData.append('employeeIdCard', this.attachmentEmployeeId);// File
    formData.append('offerLetter', this.attachmentOfferLetter);// File
    formData.append('panCard', this.attachmentPanCard);// File
    formData.append('passbook', this.attachmentPassBook);// File
    formData.append('others', this.attachmentOther);// File

    formData.append('paymentAndSalary[annualCtc]', this.paymentAndSalaryForm.get('annualCtc').value);
    formData.append('paymentAndSalary[monthlyCtc]', this.paymentAndSalaryForm.get('monthlyCtc').value);
    formData.append('paymentAndSalary[grosspay]', this.paymentAndSalaryForm.get('grossPay').value);
    formData.append('paymentAndSalary[salaryDate]', this.paymentAndSalaryForm.get('salaryDate').value);
    formData.append('paymentAndSalary[netpay]', this.paymentAndSalaryForm.get('netPay').value);
    formData.append('paymentAndSalary[addings][basicSalary]', this.paymentAndSalaryForm.get('basicSalary').value);
    formData.append('paymentAndSalary[addings][da]', this.paymentAndSalaryForm.get('da').value);
    formData.append('paymentAndSalary[addings][hra]', this.paymentAndSalaryForm.get('hra').value);
    formData.append('paymentAndSalary[addings][ta]', this.paymentAndSalaryForm.get('ta').value);
    formData.append('paymentAndSalary[addings][foodCoupon]', this.paymentAndSalaryForm.get('foodCoupon').value);
    formData.append('paymentAndSalary[addings][bonus]', this.paymentAndSalaryForm.get('bonus').value);
    formData.append('paymentAndSalary[addings][ctc]', this.paymentAndSalaryForm.get('ctc').value);
    formData.append('paymentAndSalary[deductions][hraAdvancePaid]', this.paymentAndSalaryForm.get('hraAdvancePaid').value);
    formData.append('paymentAndSalary[deductions][foodCouponAdvancePaid]', this.paymentAndSalaryForm.get('foodCouponAdvancePaid').value);
    formData.append('paymentAndSalary[deductions][pf]', this.paymentAndSalaryForm.get('pf').value);
    formData.append('paymentAndSalary[deductions][ebi]', this.paymentAndSalaryForm.get('ebi').value);
    formData.append('paymentAndSalary[deductions][totalDeduction]', this.paymentAndSalaryForm.get('totalDeduction').value);
    formData.append('bankDetails[accountNumber]', this.paymentAndSalaryForm.get('accountNumber').value);
    formData.append('bankDetails[confirmAccountNumber]', this.paymentAndSalaryForm.get('confirmAccountNumber').value);
    formData.append('bankDetails[accountHolderName]', this.paymentAndSalaryForm.get('accountHolderName').value);
    formData.append('bankDetails[ifscCode]', this.paymentAndSalaryForm.get('ifscCode').value);
    formData.append('bankDetails[branchName]', this.paymentAndSalaryForm.get('branchName').value);
    formData.append('bankDetails[micrCode]', this.paymentAndSalaryForm.get('micrCode').value);

    formData.append('notes[0][note][content]', this.noteForm.get('note').value);

    // console.log("privileges", this.privileges);

    this.privileges.forEach((privilege, index) => {
      formData.append('permissions[' + index + '][name]', privilege.name);
      formData.append('permissions[' + index + '][head]', privilege.head);
      formData.append('permissions[' + index + '][subOf]', privilege.subOf);
      formData.append('permissions[' + index + '][view]', privilege.view);
      formData.append('permissions[' + index + '][edit]', privilege.edit);
      formData.append('permissions[' + index + '][all]', privilege.all);
    });

    return formData;

  }

  isControlHasError(form: string, controlName: string, validationType: string): boolean {
    let control = null;

    switch (form) {
      case 'profileForm': control = this.profileForm.controls[controlName]; break;
      case 'personalForm': control = this.personalForm.controls[controlName]; break;
      case 'paymentAndSalaryForm': control = this.paymentAndSalaryForm.controls[controlName]; break;
      case 'noteForm': control = this.noteForm.controls[controlName]; break;
    }
    if (!control) {
      return false;
    }
    // console.log("control : ",control);
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    // console.log("result : ",result);
    return result;
  }

  onFileChange(event, form, formControlName) {

    switch (form) {
      case 'profileForm': form = this.profileForm; break;
      case 'personalForm': form = this.personalForm; break;
      case 'paymentAndSalaryForm': form = this; break;
      case 'noteForm': form = this.noteForm; break;
    }

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {

        let content = reader.result as string;
        switch (formControlName) {
          case 'photo': this.photo = file; this.profilePhotoPreview = content; break;
          case 'signature': this.signature = file; break;
          case 'attachmentAdhaar': this.attachmentAdhaar = file; break;
          case 'attachmentEmployeeId': this.attachmentEmployeeId = file; break;
          case 'attachmentOfferLetter': this.attachmentOfferLetter = file; break;
          case 'attachmentPanCard': this.attachmentPanCard = file; break;
          case 'attachmentPassBook': this.attachmentPassBook = file; break;
          case 'attachmentOther': this.attachmentOther = file; break;
        }
      };
    }

    // if (event.target.files.length > 0) {
    //   const file = event.target.files[0];
    //   console.log("File",file);

    //   form.patchValue({
    //     [formControlName]: file
    //   });
    // }
  }

  onChangePermission(permission, type = "all") {
    switch (type) {
      case "all":
        permission.view = false;
        permission.edit = false;
        break;
      case "view":
        permission.all = false;
        permission.edit = false;
        break;
      case "edit":
        permission.all = false;
        permission.view = false;
        break;

    }


  }

  logFormData(formData) {
    let data = formData.entries();
    var obj = data.next();
    var retrieved = {};
    while (undefined !== obj.value) {
      retrieved[obj.value[0]] = obj.value[1];
      obj = data.next();
    }
    console.log('FORM DATA CONTENT : ', retrieved);
    return retrieved;
  }

  changeTab(tebRef, tabName) {

    switch (tabName) {
      case "personal":
        const profileControls = this.profileForm.controls;
        if (this.profileForm.invalid) {
          Object.keys(profileControls).forEach(controlName =>
            profileControls[controlName].markAsTouched()
          );
          return false;
        }
        tebRef.select(tabName)
        break;

      case "paymentAndSalary":
        const personalControls = this.personalForm.controls;
        if (this.personalForm.invalid) {
          Object.keys(personalControls).forEach(controlName =>
            personalControls[controlName].markAsTouched()
          );
          return false;
        }
        tebRef.select(tabName)
        break;

      case "permissions":
        const paymentAndSalary = this.paymentAndSalaryForm.controls;
        if (this.paymentAndSalaryForm.invalid) {
          Object.keys(paymentAndSalary).forEach(controlName =>
            paymentAndSalary[controlName].markAsTouched()
          );
          return false;
        }
        tebRef.select(tabName)
        break;

      case "notes":
        tebRef.select(tabName)
        break;

    }
  }

  deleteFileFromForm(formControlName: any) {

    switch (formControlName) {
      case 'photo': this.photo; break;
      case 'signature': this.signature = "deleted"; break;
      case 'attachmentAaadhar': this.attachmentAdhaar = "deleted"; break;
      case 'attachmentEmployeeId': this.attachmentEmployeeId = "deleted"; break;
      case 'attachmentOfferLetter': this.attachmentOfferLetter = "deleted"; break;
      case 'attachmentPanCard': this.attachmentPanCard = "deleted"; break;
      case 'attachmentPassBook': this.attachmentPassBook = "deleted"; break;
      case 'attachmentOther': this.attachmentOther = "deleted"; break;
    }
  }

}
