import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Concert} from "./concert.model";
import {DateTime} from "../shared/date-time.model";
import {AuthService} from "../shared/services/auth.service";

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
  private authService: AuthService;

  constructor(@Inject(MAT_DIALOG_DATA) data: {update: boolean, concert: Concert}, dialogRef: MatDialogRef<AddUpdateConcertDialogComponent>, authService: AuthService) {
    this.dialogRef = dialogRef;
    this.authService = authService;
    this.update = data.update;
    this.dateString = "";
    if(this.update){
      this.concert = {
        id: data.concert.id,
        modality: data.concert.modality,
        name: data.concert.name,
        band: data.concert.band,
        address: data.concert.address,
        color: data.concert.color,
        state: data.concert.state,
        date: data.concert.date
      };
      this.dateString = this.concert.date.getDatetimeLocalString();
      //this.dateString = "2022-10-15T19:00";
    } else {
      this.concert = {
        address: "",
        color: "",
        state: "",
        date: new DateTime(),
        id: "",
        modality: "",
        name: "",
        band: this.authService.getUserSelectedBand()
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
    this.dialogRef.close(this.concert);
  }
}
