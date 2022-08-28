import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material/dialog";
import {Song} from "./Song.model";
import {HttpService} from "../shared/services/http.service";
import {EndPoints} from "../shared/end-points";
import {SnackbarService} from "../shared/services/snackbar.service";
import {AuthService} from "../shared/services/auth.service";

@Component({
  selector: 'app-add-song-dialog',
  templateUrl: 'add-update-song-dialog.component.html',
  styleUrls: ['song-dialogs.component.css']
})
export class AddUpdateSongDialogComponent implements OnInit{
  private dialogRef: MatDialogRef<AddUpdateSongDialogComponent>;
  private httpService: HttpService;
  update: boolean;
  song: Song;
  bands: string[];
  private snackBar: SnackbarService;
  private dialog;
  private authService: AuthService;

  constructor(@Inject(MAT_DIALOG_DATA) data: {update: boolean, song: Song}, dialogRef: MatDialogRef<AddUpdateSongDialogComponent>, httpService: HttpService, snackbar: SnackbarService, dialog: MatDialog, authService: AuthService) {
    this.dialogRef = dialogRef;
    this.httpService = httpService;
    this.snackBar = snackbar;
    this.dialog = dialog;
    this.authService = authService;
    this.update = data.update;
    if(this.update){
      this.song = {
        id: data.song.id,
        title: data.song.title,
        lyrics: data.song.lyrics,
        bands: data.song.bands
      }
    } else {
      this.song = {id:"", title:"", lyrics:"", bands:[]}
    }
    this.bands = [];
  }

  ngOnInit(): void{
    this.httpService.get(EndPoints.BAND)
      .subscribe({
        next: (body: Array<string>) => {
          this.bands = body;
          this.song.bands.push(this.authService.getUserSelectedBand());
          },
        error: error => this.snackBar.openErrorSnackbar(error)
      });
  }

  onClose(){
    this.dialogRef.close();
  }
}
