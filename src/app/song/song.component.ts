import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Song} from "./Song.model";
import { ActivatedRoute } from '@angular/router';
import {HttpService} from "../shared/services/http.service";
import {environment} from "../../environments/environment";
import {AddUpdateSongDialogComponent} from "./add-update-song-dialog.component";
import {EndPoints} from "../shared/end-points";
import {SnackbarService} from "../shared/services/snackbar.service";

@Component({
  selector: 'app-song',
  templateUrl: 'song.component.html',
  styleUrls: ['song.component.css']
})
export class SongComponent implements OnInit {

  static END_POINT: string = environment.REST_SERVER + '/song';
  public dialog: MatDialog;
  private route: ActivatedRoute;
  private httpService: HttpService;

  public song: Song;
  private snackBarService: SnackbarService;

  constructor(dialog: MatDialog, route: ActivatedRoute, httpService: HttpService, snackBarService: SnackbarService) {
    this.dialog = dialog;
    this.route = route;
    this.snackBarService = snackBarService;
    this.song = {id:"", title:"", lyrics:""};
    this.httpService = httpService;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')??"";

    this.httpService
      .get(SongComponent.END_POINT + "/" + id)
      .subscribe({
          next: (body: Song) => {
            this.song.id = body.id;
            this.song.title = body.title;
            this.song.lyrics = body.lyrics;
          },
          error: error => {
            this.song.title = "ERROR";
            console.log(error);
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
      this.httpService.patch(EndPoints.SONG + "/" + this.song.id, {lyrics: result.lyrics})
        .subscribe({
          next: () => {
            this.snackBarService.openSnackbar("La canción se guardó correctamente");
            this.song.lyrics = result.lyrics;
          },
          error: () => this.snackBarService.openSnackbar("No se pudo actualizar la canción")
        });
    });
  }
}


