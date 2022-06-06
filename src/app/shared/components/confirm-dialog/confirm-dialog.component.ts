import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: 'confirm-dialog.component.html'
})

export class ConfirmDialogComponent{

  public data: string;
  private dialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(@Inject(MAT_DIALOG_DATA)  data: string, dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    this.data = data;
    this.dialogRef = dialogRef;
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  onConfirmation() {
    this.dialogRef.close(true);
  }
}
