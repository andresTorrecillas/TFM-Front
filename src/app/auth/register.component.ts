import {Component} from '@angular/core';
import {RegisterDto} from "./registerDto.model";

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['log-register.component.css']
})

export class RegisterComponent {
  public register: RegisterDto;
  public passwordValidator: string;
  constructor() {
    this.register = {
      name: "",
      password: "",
      userName: "",
      band: ""
    }
    this.passwordValidator = "";
  }

  sendRegister(){

  }

  isValid(): boolean {
    return true;
  }

  isPasswordUnmatched() {
    console.log(this.register.password != this.passwordValidator && this.passwordValidator != "" && this.register.password != "")
    return this.register.password != this.passwordValidator && this.passwordValidator != "" && this.register.password != "";
  }
}
