import { Component ,OnInit } from '@angular/core';
import  EmployeeService  from '../../src/app/services/employee.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Medimall';
  public user :any = [];
  constructor(
    private authService: EmployeeService
  ) { }

  ngOnInit(): void{
    this.user = JSON.parse(sessionStorage.getItem('userData'));
    console.log("..................")

    if(this.user.isAdmin === true){
      this.authService.autoLogin();
    }
    else  if(this.user.isStore === true){
      this.authService.autoLogin();
    }
    
  }

}
