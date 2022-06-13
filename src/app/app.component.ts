import {Component, OnInit} from '@angular/core';
import {SessionStorageService} from "./shared/services/session-storage.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Front-end';
  bandName: string;
  private sesStorage: SessionStorageService;
  private bandNameObservable: Observable<any>|null;

  constructor(sesStorage: SessionStorageService) {
    this.bandNameObservable = null;
    this.sesStorage = sesStorage;
    this.bandName = "";
  }

  ngOnInit() {
    this.bandNameObservable = this.sesStorage.getObservable('user', true);
    let user = this.sesStorage.read('user');
    this.bandName = user !== null ? JSON.parse(user).bandName : "";
    if(this.bandNameObservable !== null){
      this.bandNameObservable.subscribe(
        savedUser => {
          console.log(this.bandName);
          this.bandName = JSON.parse(savedUser).bandName;
        }
      );
    } else {
      this.bandName = "BAND"
    }
  }

}
