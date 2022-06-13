import {Component, OnInit} from '@angular/core';
import {SessionStorageService} from "./shared/services/session-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Front-end';
  bandName: string;
  private sesStorage: SessionStorageService;

  constructor(sesStorage: SessionStorageService) {
    this.sesStorage = sesStorage;
    this.bandName = "";
  }

  ngOnInit() {
    let observer = this.sesStorage.getSubscriber('user', true);
    if(observer !== null){
      observer.subscribe(
        savedUser => this.bandName = JSON.parse(savedUser).bandName
      );
    } else {
      this.bandName = "BAND"
    }
  }

}
