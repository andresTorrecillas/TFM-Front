import {Component} from '@angular/core';
import {RegisterDto} from "./registerDto.model";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {SnackbarService} from "../shared/services/snackbar.service";

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['log-register.component.css']
})

export class RegisterComponent {
  public register: RegisterDto;
  public clearPassword: string;
  public passwordValidator: string;
  private authService: AuthService;
  private router: Router;
  private snackBar: SnackbarService;
  spinnerActive: boolean;

  constructor(snackBar: SnackbarService, authService: AuthService, router: Router) {
    this.snackBar = snackBar;
    this.authService = authService;
    this.router = router;
    this.register = {
      password: "",
      user: {
        name: "",
        userName: "",
        bandName: ""
      }
    }
    this.clearPassword = "";
    this.passwordValidator = "";
    this.spinnerActive = false;
  }

  sendRegister(){
    this.spinnerActive = true;
    this.register.password = btoa(this.clearPassword);
    this.authService.register(this.register)
      .subscribe({
        next: redirectUrl => {
          this.spinnerActive = false;
          redirectUrl = redirectUrl??"/song"
          this.router.navigate([redirectUrl])
            .then(correct => {
              if(!correct){
                this.snackBar.openSnackbar("Error en la redirección");
              }
            });
        },
        error: err => {
          this.spinnerActive = false;
          this.snackBar.openSnackbar(err);
          this.register.password = "";
          this.clearPassword = "";
          this.passwordValidator = "";
        }
      })
  }

  onEnterKeyDown(active: boolean) {
    if(active){
      this.sendRegister();
    }
  }
}
