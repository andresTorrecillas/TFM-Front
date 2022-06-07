import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Song} from "./Song.model";

@Component({
  selector: 'app-add-song-dialog',
  templateUrl: 'add-update-song-dialog.component.html',
  styleUrls: ['add-update-song-dialog.component.css']
})
export class AddUpdateSongDialogComponent {
  private dialogRef: MatDialogRef<AddUpdateSongDialogComponent>;
  update: boolean;
  song: Song;

  constructor(@Inject(MAT_DIALOG_DATA) data: {update: boolean, song: Song}, dialogRef: MatDialogRef<AddUpdateSongDialogComponent>) {
    this.dialogRef = dialogRef;
    this.update = data.update;
    if(this.update){
      this.song = {
        id: data.song.id,
        title: data.song.title,
        lyrics: data.song.lyrics
      }
    } else {
      this.song = {id:"", title:"", lyrics:""}
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
