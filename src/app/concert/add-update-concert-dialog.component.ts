import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Concert} from "./concert.model";
import {DateTime} from "../shared/date-time.model";

@Component({
  selector: 'app-add-song-dialog',
  templateUrl: 'add-update-concert-dialog.component.html',
  styleUrls: ['add-update-concert-dialog.component.css']
})
export class AddUpdateConcertDialogComponent {
  private dialogRef: MatDialogRef<AddUpdateConcertDialogComponent>;
  update: boolean;
  concert: Concert;

  constructor(@Inject(MAT_DIALOG_DATA) data: {update: boolean, concert: Concert}, dialogRef: MatDialogRef<AddUpdateConcertDialogComponent>) {
    this.dialogRef = dialogRef;
    this.update = data.update;
    if(this.update){
      this.concert = data.concert;
    } else {
      this.concert = {
        address: "",
        color: "",
        contractState: "",
        coordinates: {latitude: 0, longitude: 0},
        date: new DateTime(),
        id: "",
        modality: "",
        name: ""
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
