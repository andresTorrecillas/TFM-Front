import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HttpService} from "../shared/services/http.service";
import {SnackbarService} from "../shared/services/snackbar.service";
import {EndPoints} from "../shared/end-points";
import {ConfirmDialogComponent} from "../shared/components/confirm-dialog/confirm-dialog.component";
import {AddUpdateConcertDialogComponent} from "./add-update-concert-dialog.component";
import {Concert} from "./concert.model";
import {DateTime} from "../shared/date-time.model";
import {AuthService} from "../shared/services/auth.service";
import { catchError, firstValueFrom, map } from 'rxjs';

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
  private authService: AuthService;
  public showList: boolean;

  constructor(dialog: MatDialog, httpService: HttpService, snackBar: SnackbarService, authService: AuthService) {
    this.dialog = dialog;
    this.httpService = httpService;
    this.snackBar = snackBar;
    this.concertList = [];
    this.authService = authService;
    this.showList = true;
  }

  ngOnInit() {
    this.requestConcerts();
    this.authService.getSelectedBandObservable()
      .subscribe( () => {
        this.requestConcerts();
      })
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
    const dialogRef = this.dialog.open(AddUpdateConcertDialogComponent, {
      width: '40vw',
      height: '80vh',
      data: {
        update: false,
        concert: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== null && result !== undefined){
        this.httpService.post(EndPoints.CONCERT, result)
          .subscribe({
            next: concert => {
              this.snackBar.openSnackbar("El concierto se guardó correctamente");
              result.id = concert.id;
              this.concertList.push(result);
            },
            error: error => {
              this.snackBar.openErrorSnackbar(error);
            }
          });
      }
    });
  }

  openUpdateDialog(id: string): void{
    if(id == ""){
      throw new Error('El identificador tiene que estar indicado si se va a modificar la canción');
    }
    let concert: any = this.concertList.find(value => value.id == id);
    if(concert === undefined){
      throw new Error('No hay ningún concierto con el identificador indicado');
    }
    const dialogRef = this.dialog.open(AddUpdateConcertDialogComponent, {
      width: '40vw',
      height: '80vh',
      data: {
        update: true,
        concert: concert
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.updateConcert(concert, result)
          .then(value => {
            this.concertList.splice(this.concertList.indexOf(concert), 1, value);
          })
          .catch();
      }
    });
  }

  updateConcert(original: Concert, modified: Concert): Promise<Concert>{
    modified.id = original.id;
    return firstValueFrom(this.httpService.patch(EndPoints.CONCERT + "/" + original.id, modified)
      .pipe(
        map( () => {
          this.snackBar.openSnackbar("La canción se guardó correctamente");
          return modified;
        }),
        catchError(
          (error) => {
            this.snackBar.openErrorSnackbar(error ?? "No se pudo actualizar la canción")
            throw new Error(error);
          }
        )
      )
    )
  }

  private requestConcerts(){
    this.httpService
      .get(EndPoints.CONCERT + "?band=" + this.authService.getUserSelectedBand())
      .subscribe({
        next: (body: Array<Concert>) => {
          this.concertList = body;
          this.concertList.forEach(value => value.date = DateTime.copy(value.date));
          },
        error: error => this.snackBar.openErrorSnackbar(error),
        complete: () => this.showList = true
      });
    this.showList = false;
  }
}
