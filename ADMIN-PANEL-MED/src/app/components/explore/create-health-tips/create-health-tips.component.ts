import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HealthTipService } from 'src/app/services/health-tip.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-health-tips',
  templateUrl: './create-health-tips.component.html',
  styleUrls: ['./create-health-tips.component.scss']
})
export class CreateHealthTipsComponent implements OnInit {


  public categories: any = [];
  public healthTipForm: FormGroup;

  public editMode: boolean = false;
  public loading: boolean = false;
  public saving: boolean = false;
  public updating: boolean = false;

  public healthTipId: any = null;
  public healthTip: any = null;

  public uploadedImage: any = null;
  public uploadedImagePreview: any = null;

  public multiSelectData: Array<{ title: string; _id: number }>;


  constructor(
    private modalService: NgbModal,
    private router: Router,
    private healthTipService: HealthTipService,
    private formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    // private intl: IntlService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.initHealthTipForm();

    this.activatedRoute.paramMap.subscribe(params => {
      this.healthTipId = params.get('id');
      this.editMode = !!this.healthTipId;

      if (this.editMode) {
        this.healthTipService.get(this.healthTipId).subscribe(res => {
          console.log("EDIT TO DATA", res.data);
          this.healthTip = res.data;

          let filteredCategories = this.categories.filter(res => {
            return this.healthTip.categories.includes(res._id)
          })

          console.log("Filtered DATA", filteredCategories);
          this.uploadedImagePreview = this.healthTip.image;

          this.healthTipForm.patchValue({
            categories: filteredCategories,
            heading: this.healthTip.heading,
            readingTime: this.healthTip.readTime,
            description: this.healthTip.description,
            newest: this.healthTip.newest,
            trending: this.healthTip.trending,
            image: null,
          });
        });
      } else {
      }
    });
  }

  initHealthTipForm() {
    this.healthTipForm = this.formBuilder.group({
      categories: ["",
        Validators.compose([
          Validators.required,
        ])
      ],
      heading: ["",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255)
        ])
      ],
      readingTime: ["",
        Validators.compose([
          Validators.required,
          // Validators.minLength(3),
          Validators.maxLength(255)
        ])
      ],
      description: ["",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(6000)
        ])
      ],
      image: [""],
      newest: [false],
      trending: [false],
    });
  }

  loadCategories() {
    this.healthTipService.getCategories().subscribe(res => {
      this.categories = res.data.health_category;
      this.multiSelectData = this.categories;

    });
  }

  onImageChange(event: any) {

    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.type.indexOf('image') != 0) {
        Swal.fire('Oops!', "Please image select a valid image file", 'warning');
        return false;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const height = img.naturalHeight;
          const width = img.naturalWidth;


          if (width == 1076 && height == 444) {
            this.uploadedImagePreview = img.src;
            this.uploadedImage = file;
            // console.log('Width and Height', width, height);
          } else {
            Swal.fire('Oops!', "Please select image with width of 1076px and height 444px", 'warning');
            return false;
          }
        };
      };
    }
  }

  update() {

    // console.log("image",this.uploadedImage);

    this.generateFormData();
    const controls = this.healthTipForm.controls;
    /** check form */
    if (this.healthTipForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return false;
    }


    this.updating = true;
    console.log("Form Values", this.healthTipForm.value);
    let formData = this.generateFormData();
    this.healthTipService.update(this.healthTip._id, formData).subscribe(res => {
      Swal.fire('', res.data, 'success');
      this.router.navigate(['explore/health-tips']);
      this.updating = false;
      //REDIRECT
    }, error => {
      this.updating = false;

    });


  }

  save() {
    // console.log("image",this.uploadedImage);

    this.generateFormData();
    const controls = this.healthTipForm.controls;
    /** check form */
    if (this.healthTipForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return false;
    }

    if (!this.uploadedImage) {
      return false;
    }


    this.saving = true;
    console.log("Form Values", this.healthTipForm.value);
    let formData = this.generateFormData();
    this.healthTipService.save(formData).subscribe(res => {
      Swal.fire('', res.data, 'success');
      this.router.navigate(['explore/health-tips']);
      this.saving = false;
      //REDIRECT
    }, error => {
      this.saving = false;
      // this.serverErrors = error.error.msg;
      // console.log("Error",this.serverErrors);
    });
  }

  generateFormData() {
    const formData = new FormData();
    formData.append('image', this.uploadedImage);
    formData.append('heading', this.healthTipForm.get('heading').value);
    formData.append('readTime', this.healthTipForm.get('readingTime').value);
    formData.append('description', this.healthTipForm.get('description').value);
    formData.append('newest', this.healthTipForm.get('newest').value);
    formData.append('trending', this.healthTipForm.get('trending').value);

    this.healthTipForm.get('categories').value.forEach((categories, index) => {
      formData.append('categories[' + index + ']', categories._id);
    });
    if (this.editMode) {
      formData.append('healthTipId', this.healthTip._id);


    }
    // this.logFormData(formData);
    return formData;
  }


  resetForm() {
    this.healthTipForm.reset();
    this.uploadedImagePreview = null;
    this.uploadedImage = null;
  }


  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.healthTipForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  handleFilter(value) {
    if (value.length >= 1) {
      this.multiSelectData = this.categories.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.multiSelectData = this.categories
    }
  }

}
