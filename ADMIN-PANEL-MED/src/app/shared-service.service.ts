import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-charts';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  minDate :any ;
  maxDate :any ;
  constructor() { }



  disablePastDate(){
    var newdate:any = new Date();
    var toDate:any = newdate.getDate();
    if (toDate < 10){
      toDate = '0' + toDate;
    }

    var month:any = newdate.getMonth() + 1;
    if (month < 10){
      month = '0' + month;
    }

    var year = newdate.getFullYear();
    this.minDate = year + '-' + month + '-' + toDate;
    return this.minDate ;
  }

  numberMasking(number:string){
    var mask = "";
    if(number){
      for(let i=0;i<number.length - 2;i++){
        mask += '*';
      }
      return mask + number.slice(8,10);
    }
    else{
      
    }
  }







}
