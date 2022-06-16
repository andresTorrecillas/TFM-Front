import {Component, OnInit} from '@angular/core';
import {Concert} from "./concert.model";
import {DateTime} from "../shared/date-time.model";
import {EndPoints} from "../shared/end-points";
import {HttpService} from "../shared/services/http.service";
import {SnackbarService} from "../shared/services/snackbar.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-concert',
  templateUrl: 'concert.component.html'
})

export class ConcertComponent implements OnInit {

  private httpService: HttpService;
  private snackBarService: SnackbarService;
  private route: ActivatedRoute;
  private sanitizer: DomSanitizer;
  concert: Concert;
  search: string;
  mapUrl: SafeResourceUrl;
  dangerousVideoUrl: string;
  videoUrl: SafeResourceUrl;
  constructor(httpService: HttpService, snackBarService: SnackbarService, route: ActivatedRoute, sanitizer: DomSanitizer) {
    this.httpService = httpService;
    this.snackBarService = snackBarService;
    this.route = route;
    this.sanitizer = sanitizer;
    this.search = "España"
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/search?q="+this.search+"&key=AIzaSyDIRRCfHFf_CbmqYzhomCR35rJNh4am9oU")
    this.concert = {
      address: "",
      color: "",
      state: "",
      date: new DateTime(),
      id: "",
      modality: "",
      name: ""
    }
    this.dangerousVideoUrl = "https://www.youtube.com/embed/UXBMMr4_C-U";
    this.videoUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousVideoUrl);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')??"";

    this.httpService
      .get(EndPoints.CONCERT + "/" + id)
      .subscribe({
        next: (body: Concert) => {
          this.concert = body;
          this.concert.date = DateTime.copy(body.date);
          this.search = this.convertAddressToSearch(this.concert.address);
        },
        error: error => {
          this.concert.name = "ERROR";
          this.snackBarService.openErrorSnackbar(error);
        },
      });
  }

  private convertAddressToSearch = (address:string): string => address.replace(/ ./, "+");

  openEditDialog() {

  }
}
