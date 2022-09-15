import {Component, OnInit} from '@angular/core';
import {HttpService} from "../shared/services/http.service";
import {EndPoints} from "../shared/end-points";
import {SnackbarService} from "../shared/services/snackbar.service";

export interface bandInfo {
  [key:string]: { songs: {id:string, title:string}[], concerts: {id:string, name:string}[] };
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
  bands: string[];
  bandsInfo: bandInfo;
  private httpService: HttpService;
  private snackBar: SnackbarService;
  constructor(httpService: HttpService, snackBar: SnackbarService) {
    this.httpService = httpService;
    this.snackBar = snackBar;
    this.bands = [];
    this.bandsInfo = {};
  }

  ngOnInit() {
    this.httpService.get(EndPoints.BAND_SUMMARY)
      .subscribe({
        next: (body) => {
          this.bands = Object.keys(body);
          this.bandsInfo = body;
        },
        error: error => this.snackBar.openErrorSnackbar(error)
      });
  }

  previousBand() {

  }

  nextBand() {

  }
}
