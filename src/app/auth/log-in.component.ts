import {Component} from '@angular/core';
import {LoginDto} from "./loginDto.model";
import {HttpService} from "../shared/services/http.service";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {SnackbarService} from "../shared/services/snackbar.service";

@Component({
  selector: 'app-login',
  templateUrl: 'log-in.component.html',
  styleUrls: ["log-in.component.css"]
})

export class LogInComponent {
  public login: LoginDto;
  private http: HttpService;
  private authService: AuthService;
  private router: Router;
  private snackBar: SnackbarService;

  constructor(snackBar: SnackbarService, http: HttpService, router: Router, authService: AuthService) {
    this.http = http;
    this.router = router;
    this.authService = authService;
    this.login = {
      userName: "",
      password: ""
    }
    this.snackBar = snackBar;
  }

  sendLogin(){
    this.login.password = btoa(this.login.password);
    this.authService.login(this.login)
      .subscribe({
        next: () => {
          const redirectUrl = this.authService.redirectUrl??'/song';
          this.router.navigate([redirectUrl])
            .then(correct => {
              if(!correct){
                this.snackBar.openSnackbar("Error en la redirección")
              }
            });
          this.login.password = "";
        },
        error: err => {
          this.snackBar.openSnackbar(err);
        }
      });
  }
}
