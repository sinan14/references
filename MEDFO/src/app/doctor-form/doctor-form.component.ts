import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DoctorService } from '../services/doctor.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css'],
})
export class DoctorFormComponent implements OnInit {
  public currentYear: number;
  public loading: boolean = false;
  public attemptedBasicForm: boolean;
  public attemptedRegForm: boolean;
  public attemptedDocForm: boolean;
  public attemptedQualForm: boolean;
  public attemptedEstForm: boolean;
  public drivingOrAadhar: any;
  public basicDetailsForm: FormGroup;
  public docsForm: FormGroup;
  public establishmentForm: FormGroup;
  public registrationDetailsForm: FormGroup;
  public qualificationDetailsForm: FormGroup;
  public voterIdCard: any;
  public medicalRegCertificate: any;
  public proofOfYourEstablishment: any;
  public aadharPath: any = '';
  public voterIdCard_Src: any = '';
  public medicalRegCertificate_Src: any = '';
  public proofOfYourEstablishment_Src: any = '';
  constructor(
    private _doctorService: DoctorService,
    private titleService: Title
  ) {}
  phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  // public qualificationArray: any = [];

  public formArray: any;

  addForm() {
    for (let i = 0; i < this.formArray.length; i++) {
      if (
        this.formArray[i]['degree'] === '' ||
        this.formArray[i]['college'] === '' ||
        this.formArray[i]['experience'] === '' ||
        this.formArray[i]['experience'] > 100 ||
        this.formArray[i]['experience'] < 1 ||
        this.formArray[i]['completionYear'] === '' ||
        this.formArray[i]['completionYear'] > this.currentYear ||
        this.formArray[i]['completionYear'] < 1900
      ) {
        this.attemptedQualForm = true;

        return;
      } else {
        this.attemptedQualForm = false;
      }
    }
    if (this.attemptedQualForm === false) {
      this.formArray.push({
        degree: '',
        college: '',
        completionYear: '',
        experience: '',
      });
    }
  }
  removeForm(id) {
    this.formArray.splice(id, 1);
  }
  resetForms() {
    this.ngOnInit();
    window.location.reload();
  }
  trackByFn(index: any) {
    return index;
  }



  onChangeAadhar(event: any, width: any, height: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      this.drivingOrAadhar = file;
      this.docsForm.get('aadhar')!.setValue(this.drivingOrAadhar);

      let content = reader.result as string;
      this.aadharPath = content;
      console.log(this.aadharPath);
      console.log(this.drivingOrAadhar);
    };
  }

  onChangeDriving(event: any, width: any, height: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);
    Img.onload = (e: any) => {
      this.drivingOrAadhar = file;
      this.docsForm.get('aadhar')!.setValue(this.drivingOrAadhar);

      let content = reader.result as string;
      this.aadharPath = content;
    };
  }
  onChangeVoter(event: any, width: any, height: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      this.voterIdCard = file;
      this.docsForm.get('voterId')!.setValue(this.voterIdCard);

      let content = reader.result as string;
      this.voterIdCard_Src = content;
    };
  }
  onChangeMedicalRegCerticate(event: any, width: any, height: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      this.medicalRegCertificate = file;
      this.docsForm
        .get('medicalRegCertificate')!
        .setValue(this.medicalRegCertificate);

      let content = reader.result as string;
      this.medicalRegCertificate_Src = content;
    };
  }
  onChangeProof(event: any, width: any, height: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      this.proofOfYourEstablishment = file;
      this.docsForm
        .get('establishmentProof')!
        .setValue(this.proofOfYourEstablishment);

      let content = reader.result as string;
      this.proofOfYourEstablishment_Src = content;
    };
  }

  goToPreviousSlide(i) {
    $(document).ready(function () {
      $('#affliate_voice').trigger('to.owl.carousel', i);
    });
  }
  goToNextSlide(i) {
    //console.log('bro iam going');
    $(document).ready(function () {
      $('#affliate_voice').trigger('to.owl.carousel', i);
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Doctor-Form');
    this.loading = false;
    this.currentYear = new Date().getFullYear();
    this.attemptedBasicForm = false;
    this.attemptedRegForm = false;
    this.attemptedEstForm = false;
    this.attemptedQualForm = false;
    this.attemptedDocForm = false;
    this.formArray = [
      {
        degree: '',
        college: '',
        completionYear: '',
        experience: '',
      },
    ];

    const items = document.querySelectorAll('.accordion a');
    function toggleAccordion() {
      this.classList.toggle('active');
      // //console.log(' why class does not ins');
      this.nextElementSibling.classList.toggle('active');
    }
    items.forEach((item) => item.addEventListener('click', toggleAccordion));

    //forms section starts
    this.basicDetailsForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),

      email: new FormControl('', [Validators.required, Validators.email]),

      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(this.phoneReg),
      ]),

      alternativeNumber: new FormControl('', [
        Validators.pattern(this.phoneReg),
      ]),

      landNumber: new FormControl('', [Validators.minLength(4)]),

      residentialAddress: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
    });

    this.registrationDetailsForm = new FormGroup({
      registrationNumber: new FormControl('', [
        Validators.required,
        Validators.maxLength(99),
      ]),

      registeredCouncil: new FormControl('', [
        Validators.required,
        Validators.maxLength(99),
      ]),

      registeredYear: new FormControl('', [
        Validators.required,
        Validators.max(this.currentYear),
      ]),
    });

    this.qualificationDetailsForm = new FormGroup({
      degree: new FormControl('', [
        Validators.required,
        Validators.maxLength(44),
      ]),

      college: new FormControl('', [
        Validators.required,
        Validators.maxLength(99),
      ]),

      completionYear: new FormControl(null, [
        Validators.required,
        Validators.max(this.currentYear),
      ]),

      experience: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(99),
      ]),
    });
    this.establishmentForm = new FormGroup({
      establishmentName: new FormControl('', [Validators.maxLength(66)]),

      establishmentCity: new FormControl('', [Validators.maxLength(66)]),

      establishmentLocality: new FormControl('', [Validators.maxLength(66)]),

      workingFrom: new FormControl('', [Validators.maxLength(66)]),

      experienceYear: new FormControl('', [
        Validators.min(0),
        Validators.max(60),
      ]),
    });
    this.docsForm = new FormGroup({
      aadhar: new FormControl('', [Validators.required]),
      voterId: new FormControl(''),
      medicalRegCertificate: new FormControl('', [Validators.required]),
      establishmentProof: new FormControl(''),
    });
  }
  ngAfterViewInit() {
    $(document).ready(function () {
      //@ts-ignore
      $('#affliate_voice').owlCarousel({
        items: 1,
        loop: false,
        pullDrag: false,
        dots: true,
        autoplay: false,
        margin: 0,
        mouseDrag: false,
        rewind: false,
        touchDrag: false,
        responsive: {
          0: {
            items: 1,
            loop: false,autoplay: false,
            mouseDrag: false,
            pullDrag: false,
            touchDrag: false,
          },
          600: {
            items: 1,
            loop: false,
            mouseDrag: false,
            pullDrag: false,
            touchDrag: false,
          },
          1000: {
            items: 1,
            loop: false,
            autoplay: false,
            mouseDrag: false,
            pullDrag: false,
            touchDrag: false,
          },
        },
      });
    });


  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  clickNext1() {
    if (this.basicDetailsForm.valid) {
      this.goToNextSlide(1);
    } else {
      this.attemptedBasicForm = true;
    }
  }
  clickNext2() {
    if (this.registrationDetailsForm.invalid) {
      this.attemptedRegForm = true;
    } else {
      this.goToNextSlide(2);
    }
  }

  clickNext3() {
    for (let i = 0; i < this.formArray.length; i++) {
      if (
        this.formArray[i]['degree'] === '' ||
        this.formArray[i]['college'] === '' ||
        this.formArray[i]['experience'] === '' ||
        this.formArray[i]['experience'] > 100 ||
        this.formArray[i]['experience'] < 1 ||
        this.formArray[i]['completionYear'] === '' ||
        this.formArray[i]['completionYear'] > this.currentYear ||
        this.formArray[i]['completionYear'] < 1900
      ) {
        this.attemptedQualForm = true;
      } else {
        this.attemptedQualForm = false;
        this.goToNextSlide(3);
        // this.goNext()
      }
    }
  }
  clickNext4() {
    if (this.establishmentForm.invalid) {
      this.attemptedEstForm = true;
    } else {
      this.attemptedEstForm = false;
      this.goToNextSlide(4);
    }
  }

  clickNext5() {
    if (this.docsForm.invalid) {
      this.attemptedDocForm = true;
    } else {
      this.attemptedDocForm = false;
      this.onSubmit();
    }
  }
  onSubmit() {

    if (this.basicDetailsForm.invalid) {
      this.goToNextSlide(0);
      this.attemptedBasicForm = true;
      //console.log('basic error');
      return;
    } else {
      this.attemptedBasicForm = false;
    }
    if (this.registrationDetailsForm.invalid) {
      this.goToNextSlide(1);

      //console.log('regi error');
      this.attemptedRegForm = true;
      return;
    } else {
      this.attemptedRegForm = false;
    }
    //console.log(this.formArray);
    for (let i = 0; i < this.formArray.length; i++) {
      if (
        this.formArray[i]['degree'] === '' ||
        this.formArray[i]['college'] === '' ||
        this.formArray[i]['experience'] === '' ||
        this.formArray[i]['experience'] > 100 ||
        this.formArray[i]['experience'] < 1 ||
        this.formArray[i]['completionYear'] === '' ||
        this.formArray[i]['completionYear'] > this.currentYear ||
        this.formArray[i]['completionYear'] < 1900
      ) {
        this.goToNextSlide(2);

        this.attemptedQualForm = true;
        //console.log('qualification error');

        return;
      } else {
        this.attemptedQualForm = true;
      }
    }

    if (this.establishmentForm.invalid) {
      this.attemptedEstForm = true;

      this.goToNextSlide(3);
      return;
    } else {
      this.attemptedEstForm = false;
    }
    if (this.docsForm.invalid) {
      //console.log('doc error');
      this.attemptedDocForm = true;
      this.goToNextSlide(4);

      return;
    } else {
      this.attemptedDocForm = false;
    }
    const fd = new FormData();

    fd.append('name', this.basicDetailsForm.get('name')!.value);
    fd.append('email', this.basicDetailsForm.get('email')!.value);
    fd.append('mobile', this.basicDetailsForm.get('mobile')!.value);
    fd.append(
      'alternativeNumber',
      this.basicDetailsForm.get('alternativeNumber')!.value
    );
    fd.append('landNumber', this.basicDetailsForm.get('landNumber')!.value);
    fd.append(
      'residentialAddress',
      this.basicDetailsForm.get('residentialAddress')!.value
    );
    fd.append(
      'registrationNumber',
      this.registrationDetailsForm.get('registrationNumber')!.value
    );
    fd.append(
      'registeredCouncil',
      this.registrationDetailsForm.get('registeredCouncil')!.value
    );
    fd.append(
      'registeredYear',
      this.registrationDetailsForm.get('registeredYear')!.value
    );
    fd.append(
      'establishmentName',
      this.establishmentForm.get('establishmentName')!.value
    );
    fd.append(
      'establishmentCity',
      this.establishmentForm.get('establishmentCity')!.value
    );
    fd.append(
      'establishmentLocality',
      this.establishmentForm.get('establishmentLocality')!.value
    );
    fd.append('workingFrom', this.establishmentForm.get('workingFrom')!.value);
    fd.append(
      'experienceYear',
      this.establishmentForm.get('experienceYear')!.value
    );
    fd.append('aadhar', this.docsForm.get('aadhar')!.value);
    fd.append('voterId', this.docsForm.get('voterId')!.value);
    fd.append(
      'medicalRegCertificate',
      this.docsForm.get('medicalRegCertificate')!.value
    );
    fd.append(
      'establishmentProof',
      this.docsForm.get('establishmentProof')!.value
    );
    this.formArray.forEach((item, index) => {
      fd.append('qualification[' + index + '][degree]', item.degree);
      fd.append('qualification[' + index + '][college]', item.college);
      fd.append(
        'qualification[' + index + '][completionYear]',
        item.completionYear
      );
      fd.append('qualification[' + index + '][experience]', item.experience);
    });
    //@ts-ignore
    //console.log(Object.fromEntries(fd));

    this.loading = true;
    this._doctorService.addDoctorDetails(fd).subscribe(
      (res: any) => {
        if (res.status) {
          this.loading = false;

          Swal.fire({
            title: '<h4 class="suc">successfully submitted</h4>',
            icon: 'success',

            showCloseButton: true,
            // showCancelButton: true,
            // focusConfirm: false,
            confirmButtonText:
              '<span class="suc-span" style="font-size:1.5rem;"><i class="fa fa-thumbs-up"></i> Great!</span>',
            confirmButtonColor: '#00aaff',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            // cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
            // cancelButtonAriaLabel: 'Thumbs down',
          }).then(() => {
            this.resetForms();
          });
        } else {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'oops!!',
            text: res.message,
          }).then(() => {
            this.resetForms();
          });
          // //console.log('💥💥💥💥💥💥💥💥💥💥💥');
          //console.log(res);
        }
      },
      (err: any) => {
        this.loading = false;
        //console.log(err);
        // //console.log('server error 🥵🥵🥵🥵🥵🥵🥵🥵🥵');
        this.resetForms();
      }
    );
  }

  isValidBasic(controlName: any) {
    return (
      (this.basicDetailsForm.get(controlName)!.invalid &&
        this.basicDetailsForm.get(controlName)!.touched) ||
      (this.attemptedBasicForm &&
        this.basicDetailsForm.get(controlName).invalid)
    );
  }

  isValidReg(controlName: any) {
    return (
      (this.registrationDetailsForm.get(controlName)!.invalid &&
        this.registrationDetailsForm.get(controlName)!.touched) ||
      (this.attemptedRegForm &&
        this.registrationDetailsForm.get(controlName).invalid)
    );
  }
  

  isValidEst(controlName: any) {
    return (
      (this.establishmentForm.get(controlName)!.invalid &&
        this.establishmentForm.get(controlName)!.touched) ||
      (this.attemptedEstForm && this.establishmentForm.get(controlName).invalid)
    );
  }
  isValidPhotos(controlName: any) {
    return (
      (this.docsForm.get(controlName)!.invalid &&
        this.docsForm.get(controlName)!.touched) ||
      (this.attemptedDocForm && this.docsForm.get(controlName).invalid)
    );
  }
}
