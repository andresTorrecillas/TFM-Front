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
  }

  sendRegister(){
    this.register.password = btoa(this.clearPassword);
    this.authService.register(this.register)
      .subscribe({
        next: redirectUrl => {
          redirectUrl = redirectUrl??"/song"
          this.router.navigate([redirectUrl])
            .then(correct => {
              if(!correct){
                this.snackBar.openSnackbar("Error en la redirección");
              }
            });
        },
        error: err => {
          this.snackBar.openSnackbar(err);
          this.register.password = "";
          this.clearPassword = "";
          this.passwordValidator = "";
        }
      })
  }
}
