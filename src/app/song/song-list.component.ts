import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HttpService} from "../shared/services/http.service";
import {Song} from "./Song.model";
import {EndPoints} from "../shared/end-points";
import {AddUpdateSongDialogComponent} from "./add-update-song-dialog.component";
import {ConfirmDialogComponent} from "../shared/components/confirm-dialog/confirm-dialog.component";
import {SnackbarService} from "../shared/services/snackbar.service";
import {catchError, firstValueFrom, map} from "rxjs";
import {AuthService} from "../shared/services/auth.service";

@Component({
  selector: 'app-song-list',
  templateUrl: 'song-list.component.html',
  styleUrls: ['../shared/styles/element-list.style.css']
})
export class SongListComponent implements OnInit {

  public dialog: MatDialog;
  private httpService: HttpService;
  public songList: Array<Song>;
  private authService: AuthService;
  private snackBar: SnackbarService;
  public showList: boolean;

  constructor(dialog:MatDialog, httpService:HttpService, authService:AuthService, snackBar: SnackbarService) {
    this.authService = authService;
    this.dialog = dialog;
    this.httpService = httpService;
    this.snackBar = snackBar;
    this.songList = [];
    this.showList = true;
  }

  ngOnInit() {
    this.requestSongs();
    this.authService.getSelectedBandObservable()
      .subscribe( () => {
      this.requestSongs();
    })
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

  openCreateDialog(): void{
    const dialogRef = this.dialog.open(AddUpdateSongDialogComponent, {
      width: '40vw',
      height: '80vh',
      data: {
        update: false,
        song: null
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.httpService.post(EndPoints.SONG, result)
        .subscribe({
          next: receivedSong => {
            this.snackBar.openSnackbar("La canción se guardó correctamente");
            result.id = receivedSong.id;
            this.songList.push(result);
          },
          error: error => {
            this.snackBar.openErrorSnackbar(error);
          }
        });
    });
  }

  openUpdateDialog(id: string): void{
    if(id == ""){
      throw new Error('El identificador tiene que estar indicado si se va a modificar la canción');
    }
    let song: any = this.songList.find(value => value.id == id);
    if(song === undefined){
      throw new Error('No hay ninguna canción con el identificador indicado');
    }
    const dialogRef = this.dialog.open(AddUpdateSongDialogComponent, {
      width: '40vw',
      height: '80vh',
      data: {
        update: true,
        song: song
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.updateSong(song, result)
          .then(value => {
            this.songList.splice(this.songList.indexOf(song), 1, value);
          })
          .catch();
      }
    });
  }

  updateSong(song: Song, result: Song): Promise<Song>{
    return firstValueFrom(this.httpService.patch(EndPoints.SONG + "/" + song.id, {lyrics: result.lyrics})
      .pipe(
        map( () => {
          this.snackBar.openSnackbar("La canción se guardó correctamente");
          song.lyrics = result.lyrics;
          return song;
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

  private requestSongs(){
    this.httpService
      .get(EndPoints.SONG + '?band=' + this.authService.getUserSelectedBand())
      .subscribe({
        next: (body: Array<Song>) => this.songList = body,
        error: error => this.snackBar.openErrorSnackbar(error),
        complete: () => this.showList = true
      });
    this.showList = false;
  }

}
