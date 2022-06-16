import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HttpService} from "../shared/services/http.service";
import {Song} from "./Song.model";
import {EndPoints} from "../shared/end-points";
import {AddUpdateSongDialogComponent} from "./add-update-song-dialog.component";
import {ConfirmDialogComponent} from "../shared/components/confirm-dialog/confirm-dialog.component";
import {SnackbarService} from "../shared/services/snackbar.service";

@Component({
  selector: 'app-song-list',
  templateUrl: 'song-list.component.html',
  styleUrls: ['../shared/styles/element-list.style.css']
})
export class SongListComponent implements OnInit {

  public dialog: MatDialog;
  private httpService: HttpService;
  public songList: Array<Song>;
  private snackBar: SnackbarService;

  constructor(dialog:MatDialog, httpService:HttpService, snackBar: SnackbarService) {
    this.dialog = dialog;
    this.httpService = httpService;
    this.snackBar = snackBar;
    this.songList = [];
  }

  ngOnInit() {
    this.httpService
      .get(EndPoints.SONG)
      .subscribe({
        next: (body: Array<Song>) => this.songList = body,
        error: error => this.snackBar.openErrorSnackbar(error)
      });
  }

  onDeleteSong(id: string): void{
    this.dialog.open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe(confirmation => {
        if(confirmation){
          this.deleteSong(id);
        }
      })
  }

  private deleteSong(id: string){
    this.httpService.delete(EndPoints.SONG + "/" + id)
      .subscribe(
        {
          next: () => {
            this.snackBar.openSnackbar("Se ha eliminado la canción correctamente");
            this.songList.forEach((song, index) => {
              if(song.id == id){
                this.songList.splice(index, 1);
              }
            })
          },
          error: error => this.snackBar.openErrorSnackbar(error??"No se ha podido eliminar la canción")
        }
      );
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(AddUpdateSongDialogComponent, {
      width: '40vw',
      height: '80vh',
      data: {
        update: false,
        song: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.httpService.post(EndPoints.SONG, result)
          .subscribe({
            next: () => {
              this.snackBar.openSnackbar("La canción se guardó correctamente");
              this.songList.push(result);
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
