import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Concert} from "./concert.model";
import {DateTime} from "../shared/date-time.model";

@Component({
  selector: 'app-add-song-dialog',
  templateUrl: 'add-update-concert-dialog.component.html',
  styleUrls: ['add-update-concert-dialog.component.css']
})
export class AddUpdateConcertDialogComponent implements OnInit{
  private dialogRef: MatDialogRef<AddUpdateConcertDialogComponent>;
  update: boolean;
  concert: Concert;
  dateString: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: {update: boolean, concert: Concert}, dialogRef: MatDialogRef<AddUpdateConcertDialogComponent>) {
    this.dialogRef = dialogRef;
    this.update = data.update;
    this.dateString = "";
    if(this.update){
      this.concert = {
        id: data.concert.id,
        modality: data.concert.modality,
        name: data.concert.name,
        address: data.concert.address,
        color: data.concert.color,
        contractState: data.concert.contractState,
        coordinates: data.concert.coordinates,
        date: data.concert.date
      };
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

  ngOnInit(){
  }

  sendData() {
    let obtainedDate = DateTime.GetDateTimeFromString(this.dateString);
    if(obtainedDate === null){
      throw Error("No se ha podido generar la fecha solicitada");
    }
    this.concert.date = obtainedDate;
    console.log(obtainedDate.toString() + " " + obtainedDate.date);
    this.dialogRef.close(this.concert);
  }
}
