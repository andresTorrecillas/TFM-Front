import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Song} from "./Song.model";
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from "../shared/services/http.service";
import {AddUpdateSongDialogComponent} from "./add-update-song-dialog.component";
import {EndPoints} from "../shared/end-points";
import {SnackbarService} from "../shared/services/snackbar.service";
import {ConfirmDialogComponent} from "../shared/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-song',
  templateUrl: 'song.component.html',
  styleUrls: ['song.component.css']
})
export class SongComponent implements OnInit {

  public dialog: MatDialog;
  private route: ActivatedRoute;
  private router: Router;
  private httpService: HttpService;

  public song: Song;
  private snackBar: SnackbarService;

  constructor(dialog: MatDialog, route: ActivatedRoute, router: Router, httpService: HttpService, snackBarService: SnackbarService) {
    this.router = router;
    this.dialog = dialog;
    this.route = route;
    this.snackBar = snackBarService;
    this.song = {id:"", title:"", lyrics:"", bands:[]};
    this.httpService = httpService;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')??"";

    this.httpService
      .get(EndPoints.SONG + "/" + id)
      .subscribe({
          next: (body: Song) => {
            this.song.id = body.id;
            this.song.title = body.title;
            this.song.lyrics = body.lyrics;
          },
          error: error => {
            this.song.title = "ERROR";
            this.snackBar.openErrorSnackbar(error);
            this.router.navigate(['/song'])
              .then(correct => {
                if(!correct){
                  this.snackBar.openSnackbar("Error en la redirección");
                }
              });
          },
        });
  }

  isLyricsSet(): boolean{
    return this.song.lyrics !== null && this.song.lyrics !== "";
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(AddUpdateSongDialogComponent, {
      width: '40vw',
      height: '80vh',
      data: {
        update: true,
        song: this.song
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.httpService.patch(EndPoints.SONG + "/" + this.song.id, {lyrics: result.lyrics})
          .subscribe({
            next: () => {
              this.snackBar.openSnackbar("La canción se guardó correctamente");
              this.song.lyrics = result.lyrics;
            },
            error: error => this.snackBar.openErrorSnackbar(error ?? "No se pudo actualizar la canción")
          });
      }
    });
  }

  onDeleteSong(id: string) {
    this.dialog.open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe(confirmation => {
        if(confirmation){
          this.deleteSong(id);
        }
      })
  }

  private deleteSong(id: string) {
    this.httpService.delete(EndPoints.SONG + "/" + id)
      .subscribe(
        {
          next: () => {
            this.snackBar.openSnackbar("Se ha eliminado la canción correctamente");
            this.router.navigate(['/song'])
              .then(correct => {
                if(!correct){
                  this.snackBar.openSnackbar("Error en la redirección");
                }
              });
          },
          error: error => this.snackBar.openErrorSnackbar(error??"No se ha podido eliminar la canción")
        }
      );
  }
}


