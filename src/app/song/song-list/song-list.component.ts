import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HttpService} from "../../shared/services/http.service";
import {Song} from "../Song.model";
import {EndPoints} from "../../shared/end-points";
import {AddUpdateSongDialogComponent} from "../add-update-song-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../../environments/environment";
import {ConfirmDialogComponent} from "../../shared/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-song-list',
  templateUrl: 'song-list.component.html',
  styleUrls: ['song-list.component.css']
})
export class SongListComponent implements OnInit {

  public dialog: MatDialog;
  private httpService: HttpService;
  public songList: Array<Song>;
  private snackBar: MatSnackBar;

  constructor(dialog:MatDialog, httpService:HttpService, snackBar: MatSnackBar) {
    this.dialog = dialog;
    this.httpService = httpService;
    this.snackBar = snackBar;
    this.songList = [];
  }

  ngOnInit() {
    this.httpService
      .get(EndPoints.SONG)
      .subscribe({
        next: (body: Array<Song>) => {
          this.songList = body;
          console.log(this.songList);
        },
        error: error => {
          console.log(error);
        },
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
            this.openSnackbar("Se ha eliminado la canción correctamente");
            this.songList.forEach((song, index) => {
              if(song.id == id){
                this.songList.splice(index, 1);
              }
            })
          },
          error: () => this.openSnackbar("Error, no se ha podido eliminar la canción")
        }
      );
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(AddUpdateSongDialogComponent, {
      width: '40vw',
      height: '80vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.httpService.post(EndPoints.SONG, result)
        .subscribe({
          next: () => {
            this.openSnackbar("La canción se guardó correctamente");
            this.songList.push(result);
          },
          error: error => this.openSnackbar(error)
        });
    });
  }

  openSnackbar(message: string, duration: number = environment.NOTIFICATION_DURATION): void{
    this.snackBar.open(message, "Close",{
      duration: duration * 1000,
    });
  }

}
