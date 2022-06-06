import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Song} from "./Song.model";

@Component({
  selector: 'app-add-song-dialog',
  templateUrl: 'add-song-dialog.component.html',
  styleUrls: ['add-song-dialog.component.css']
})

export class AddSongDialogComponent {
  private dialogRef: MatDialogRef<AddSongDialogComponent>;
  song: Song;
  constructor(dialogRef: MatDialogRef<AddSongDialogComponent>) {
    this.song = {id:"", title:"", lyrics:""};
    this.dialogRef = dialogRef;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
