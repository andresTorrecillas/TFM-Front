import {Component} from '@angular/core';
import {LoginDto} from "./loginDto.model";
import {HttpService} from "../shared/services/http.service";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {SnackbarService} from "../shared/services/snackbar.service";

@Component({
  selector: 'app-login',
  templateUrl: 'log-in.component.html',
  styleUrls: ["log-register.component.css"]
})

export class LogInComponent {
  public login: LoginDto;
  private http: HttpService;
  private authService: AuthService;
  private router: Router;
  private snackBar: SnackbarService;
  spinnerActive: boolean;

  constructor(snackBar: SnackbarService, http: HttpService, router: Router, authService: AuthService) {
    this.http = http;
    this.router = router;
    this.authService = authService;
    this.login = {
      userName: "",
      password: ""
    }
    this.snackBar = snackBar;
    this.spinnerActive = false;
  }

  sendLogin(){
    let loginDto: LoginDto = {userName: this.login.userName, password: btoa(this.login.password)};
    this.spinnerActive = true;
    this.authService.login(loginDto)
      .subscribe({
        next: () => {
          this.spinnerActive = false;
          const redirectUrl = this.authService.redirectUrl??'/song';
          this.router.navigate([redirectUrl])
            .then(correct => {
              if(!correct){
                this.snackBar.openSnackbar("Error en la redirección");
              }
            });
        },
        error: err => {
          this.snackBar.openSnackbar(err);
          this.login.password = "";
          this.spinnerActive = false;
        }
      });
  }

  onEnterKeyDown(active: boolean|null){
    if(active){
      this.sendLogin();
    }
  }
}
