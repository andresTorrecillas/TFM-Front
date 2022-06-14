import {Component, OnInit} from '@angular/core';
import {SessionStorageService} from "./shared/services/session-storage.service";
import {Observable} from "rxjs";
import {AuthService} from "./shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Front-end';
  bandName: string;
  logged: boolean;
  private sesStorage: SessionStorageService;
  private bandNameObservable: Observable<any>|null;
  private authService: AuthService;
  private router: Router;

  constructor(sesStorage: SessionStorageService, authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
    this.bandNameObservable = null;
    this.sesStorage = sesStorage;
    this.bandName = "";
    this.logged = false;
  }

  ngOnInit() {
    this.logged = this.authService.isLoggedIn();
    this.bandNameObservable = this.sesStorage.getObservable('user', true);
    let user = this.sesStorage.read('user');
    this.bandName = user !== null ? JSON.parse(user).bandName : "";
    if(this.bandNameObservable !== null){
      this.bandNameObservable.subscribe(
        savedUser => {
          this.logged = this.authService.isLoggedIn();
          if(savedUser !== ""){
            this.bandName = JSON.parse(savedUser).bandName;
          }
        }
      );
    } else {
      this.bandName = "BAND"
    }
  }

  logOut() {
    this.authService.logout();
    this.logged = false;
    this.router.navigate(['/login']).then();
  }
}
