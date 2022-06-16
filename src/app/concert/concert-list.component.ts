import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HttpService} from "../shared/services/http.service";
import {SnackbarService} from "../shared/services/snackbar.service";
import {EndPoints} from "../shared/end-points";
import {ConfirmDialogComponent} from "../shared/components/confirm-dialog/confirm-dialog.component";
import {AddUpdateSongDialogComponent} from "../song/add-update-song-dialog.component";
import {Concert} from "./concert.model";
import {DateTime} from "../shared/date-time.model";

@Component({
  selector: 'app-concert-list',
  templateUrl: 'concert-list.component.html',
  styleUrls: ['../shared/styles/element-list.style.css']
})

export class ConcertListComponent implements OnInit {
  public dialog: MatDialog;
  private httpService: HttpService;
  public concertList: Array<Concert>;
  private snackBar: SnackbarService;

  constructor(dialog: MatDialog, httpService: HttpService, snackBar: SnackbarService) {
    this.dialog = dialog;
    this.httpService = httpService;
    this.snackBar = snackBar;
    this.concertList = [];
  }

  ngOnInit() {
    this.httpService
      .get(EndPoints.CONCERT)
      .subscribe({
        next: (body: Array<Concert>) => {this.concertList = body; this.concertList.forEach(value => value.date = DateTime.copy(value.date));},
        error: error => this.snackBar.openErrorSnackbar(error)
      });
  }

  onDeleteConcert(id: string): void {
    this.dialog.open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe(confirmation => {
        if (confirmation) {
          this.deleteConcert(id);
        }
      })
  }

  private deleteConcert(id: string) {
    this.httpService.delete(EndPoints.CONCERT + "/" + id)
      .subscribe(
        {
          next: () => {
            this.snackBar.openSnackbar("Se ha eliminado el concierto correctamente");
            this.concertList.forEach((concert, index) => {
              if (concert.id == id) {
                this.concertList.splice(index, 1);
              }
            })
          },
          error: error => this.snackBar.openErrorSnackbar(error ?? "No se ha podido eliminar el concierto")
        }
      );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddUpdateSongDialogComponent, {
      width: '40vw',
      height: '80vh',
      data: {
        update: false,
        song: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        this.httpService.post(EndPoints.CONCERT, result)
          .subscribe({
            next: () => {
              this.snackBar.openSnackbar("El concierto se guardó correctamente");
              this.concertList.push(result);
            },
            error: error => {
              console.log(error);
              this.snackBar.openErrorSnackbar(error);
            }
          });
      }
    });
  }
}
