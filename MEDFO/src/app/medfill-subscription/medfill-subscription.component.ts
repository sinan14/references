import { Component, OnInit } from '@angular/core';
import { MedfillSubscriptionService } from 'src/app/services/medfill-subscription.service';
import Swal from 'sweetalert2';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { HealthVaultService } from '../services/health-vault.service';

@Component({
  selector: 'app-medfill-subscription',
  templateUrl: './medfill-subscription.component.html',
  styleUrls: ['./medfill-subscription.component.css']
})
export class MedfillSubscriptionComponent implements OnInit {

  public containGuidFlag :boolean = false;
  public showActiveFlag :boolean = true;
  public showInactiveFlag :boolean = false;
  public active_subscriptionList :any = [];
  public inActive_subscriptionList :any = [];
  public userName :any = '';
  public prescriptionImageURLArray :any = [];
  public Health_Vault_Array :any = [];
  public healthdataClicked :boolean = false;
  public imageLoading :boolean = false;

  public subscriptionID :any = '';
  public prescriptionViewList :any = [];

  constructor(private _medFillService: MedfillSubscriptionService,
    public _prescriptionService: PrescriptionService,
    private Health_Vault_Service: HealthVaultService,) { }

  ngOnInit(): void {
    this.getsubscriptionList();

    let data = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(data);
    this.userName = data.userName;
  }

  public Show_Div_Section(type) {
    if(type === 'active'){
      this.showActiveFlag = true;
      this.showInactiveFlag = false;
      this.getsubscriptionList();
    }
    else if(type === 'inactive'){
      this.showInactiveFlag = true;
      this.showActiveFlag = false;
      this.getsubscriptionList();
    }
  }


  getsubscriptionList(){
    this._medFillService.get_subscription_list().subscribe((res:any)=>{
      console.log(res);
      this.active_subscriptionList = res.data.result.filter((p:any)=>p.active === true);
      this.inActive_subscriptionList = res.data.result.filter((p:any)=>p.active === false);
    })
  }

  changeStatus(id :any ,type :any){

    Swal.fire({
      title: 'Are you sure?',
       text: 'Subscription status is changed to '+ type  + ' state',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor:  '#3085d6',
      cancelButtonColor:'#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        
        
        if(type ==='disable'){
          let input ={
            id : id,
            status:false
          }
    
          this._medFillService.active_inactive_subscription(input).subscribe((res:any)=>{
            if(!res.status){
              Swal.fire({
                icon: 'success',
                title: "Deactivated",
              }).then(()=>{
                this.getsubscriptionList();
                this.showActiveFlag = false;
                this.showInactiveFlag = true;
              });
            }
            else{
              Swal.fire({
                icon: 'warning',
                title: res.message,
              });
            }
          })
        }
    
        else  if(type ==='enable'){
          let input ={
            id : id,
            status:true
          }
    
          this._medFillService.active_inactive_subscription(input).subscribe((res:any)=>{
            if(!res.status){
              Swal.fire({
                icon: 'success',
                title: "Activated",
              }).then(()=>{
                this.getsubscriptionList();
                this.showActiveFlag = true;
                this.showInactiveFlag = false;
              });
            }
            else{
              Swal.fire({
                icon: 'warning',
                title: res.message,
              });
            }
          })
        }


      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


  }

  getSubsciprtionId(id:any){
    this.subscriptionID = id;
  }

  uploadPrescritpion(event,data){
    const reader = new FileReader();
    const file = event.target.files[0];
  
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);
    this.imageLoading = true;
  
    Img.onload = (e: any) => {
      let content = reader.result as string;
      let presPath = content;
  
  
      const formData = new FormData();
      formData.append('prescription',file);
      
      this._medFillService.upload_image(formData).subscribe((res:any)=>{
        console.log(res);
            if(!res.error){
              this.prescriptionImageURLArray.push(res.data.images[0]);
              this.imageLoading = false;
            }
            else{
              Swal.fire({
              icon: 'warning',
              title: res.message,
              });
              this.imageLoading = false;
            }
          })
  
    };
  }

  Continue_Prescription_Click(){
    let input = {
      subscriptionId : this.subscriptionID,
      prescription : this.prescriptionImageURLArray
    }
    console.log(input);

    this._medFillService.add_prescription(input).subscribe((res:any)=>{
      console.log(res);
          if(!res.error){
            Swal.fire({
              icon: 'success',
              title: "Success",
            });
            this.prescriptionImageURLArray = [];
            this.getsubscriptionList();
            document.getElementById('dismiss-upload-prescription').click()
          }
          else{
            Swal.fire({
              icon: 'warning',
              title: res.message,
            });
            this.getsubscriptionList();
            document.getElementById('dismiss-upload-prescription').click()
          }
    });
  }

  Get_Health_Vault_Data(){
    this.healthdataClicked = !this.healthdataClicked;
    this.Health_Vault_Service.get_user_health_vault().subscribe((res: any) => {
      console.log(res, "health vault data");
      this.Health_Vault_Array = [];
      this.Health_Vault_Array = res.data

        
      if(this.Health_Vault_Array.length==0){
        Swal.fire({
          icon: 'warning',
          title: 'No health data found',
        });
      }
      else{
        this.prescriptionImageURLArray.forEach((pres :any,ind:any) => {
          this.Health_Vault_Array.forEach((element :any,index:any) => {
            if(pres === element.prescription){
                element.checkedFlag = true;
            }
          });
        });
      }
      
    })
  }

  Select_Health_Data(event,item) {
    if(event.target.checked){
      console.log(item);

      //this.Health_Data_Image = item.prescription

      let data :any = [];
      data = this.prescriptionImageURLArray.filter((i:any)=>i === item.prescription);
        if(data.length>0){
          alert("already added");
        }
        else{
         // this.prescriptionHealthDataURLArray.push(item.prescription)
          this.prescriptionImageURLArray.push(item.prescription)
          console.log(this.prescriptionImageURLArray);
        }
      //this.healthdataClicked = false;

    }
    else{
      let data:any = [];
      //data = this.prescriptionHealthDataURLArray.filter((res:any)=>res !=item.prescription);
      data = this.prescriptionImageURLArray.filter((res:any)=>res !=item.prescription);

      console.log(data);

      this.prescriptionImageURLArray = data;
    }
  }


  //Prescription  remove
  removePrescription(index){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor:  '#3085d6',
      cancelButtonColor:'#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {

        let data:any = [];
        data = this.prescriptionImageURLArray.filter((res:any)=>res != index);
        this.prescriptionImageURLArray = data;
        console.log(data,"updated array");
        let input={
          prescription : this.prescriptionImageURLArray
        }
        // this._cartService.update_prescription(this.prescription_id,input).subscribe((res:any)=>{
        //   console.log(res);
        //       if(!res.error){
        //         Swal.fire({
        //           icon: 'success',
        //           title: res.message,
        //         });
        //         // document.getElementById('dismiss-upload-prescription').click()
        //       }
        // });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


   
  }

  viewImage(index){
    if(index.prescription.length!=0){
      this.prescriptionViewList = index.prescription;
    }
    else{
      Swal.fire({
        icon: 'warning',
        title: 'No prescription are found',
      });
    }
  }

  prescriptionGuidClick(){
    this.containGuidFlag = !this.containGuidFlag;
  }

}
