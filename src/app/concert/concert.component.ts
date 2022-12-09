import {Component, OnInit} from '@angular/core';
import {Concert} from "./concert.model";
import {DateTime} from "../shared/date-time.model";
import {EndPoints} from "../shared/end-points";
import {HttpService} from "../shared/services/http.service";
import {SnackbarService} from "../shared/services/snackbar.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateConcertDialogComponent } from './add-update-concert-dialog.component';

@Component({
  selector: 'app-concert',
  templateUrl: 'concert.component.html',
  styleUrls: ['concert.component.css']
})

export class ConcertComponent implements OnInit {

  private httpService: HttpService;
  private snackBar: SnackbarService;
  private route: ActivatedRoute;
  private sanitizer: DomSanitizer;
  private router: Router;
  concert: Concert;
  search: string;
  mapUrl: SafeResourceUrl;
  dialog: MatDialog;
  constructor(dialog: MatDialog, httpService: HttpService, snackBarService: SnackbarService, route: ActivatedRoute, router:Router, sanitizer: DomSanitizer) {
    this.dialog = dialog;
    this.router = router;
    this.httpService = httpService;
    this.snackBar = snackBarService;
    this.route = route;
    this.sanitizer = sanitizer;
    this.search = "España"
    this.mapUrl = "";
    this.setMapUrl();
    this.concert = {
      address: "",
      color: "",
      state: "",
      date: new DateTime(),
      id: "",
      modality: "",
      name: "",
      band: ""
    }
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
          this.setMapUrl();
        },
        error: error => {
          this.concert.name = "ERROR";
          this.snackBar.openErrorSnackbar(error);
          this.router.navigate(['/concert'])
            .then(correct => {
              if(!correct){
                this.snackBar.openSnackbar("Error en la redirección");
              }
            });
        },
      });
  }

  private convertAddressToSearch = (address:string): string => address.replace(/ ./, "+");

  private setMapUrl(): void{
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      "https://www.google.com/maps/embed/v1/search?q="+this.search+"&key=AIzaSyDIRRCfHFf_CbmqYzhomCR35rJNh4am9oU"
    )
  }

  openEditDialog(): void{
    const dialogRef = this.dialog.open(AddUpdateConcertDialogComponent, {
      width: '40vw',
      height: '80vh',
      data: {
        update: true,
        concert: this.concert
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.httpService.patch(EndPoints.CONCERT + "/" + this.concert.id, result)
          .subscribe({
            next: () => {
              this.snackBar.openSnackbar("La canción se guardó correctamente");
              this.concert = result;
            },
            error: error => this.snackBar.openErrorSnackbar(error ?? "No se pudo actualizar la canción")
          });
      }
    });
  }

}
