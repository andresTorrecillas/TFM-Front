import {Component} from '@angular/core';
import {LoginDto} from "./loginDto.model";
import {HttpService} from "../shared/services/http.service";
import {EndPoints} from "../shared/end-points";

@Component({
  selector: 'app-login',
  templateUrl: 'log-in.component.html',
  styleUrls: ["log-in.component.css"]
})

export class LogInComponent {
  public login: LoginDto;
  private http: HttpService;
  constructor(http: HttpService) {
    this.http = http;
    this.login = {
      userName: "",
      password: ""
    }
  }

  sendLogin(){
    this.login.password = btoa(this.login.password);
    this.http.post(EndPoints.LOGIN, this.login)
      .subscribe({
        next: value => {
          console.log(value);
          this.login.password = "";
        }
      });
  }
}
