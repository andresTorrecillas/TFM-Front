import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class SnackbarService{
  private snackBar: MatSnackBar;


  constructor(snackBar: MatSnackBar) {
    this.snackBar = snackBar;
  }

  openSnackbar(message: string, duration: number = environment.NOTIFICATION_DURATION): void{
    this.snackBar.open(message, "Close",{
      duration: duration * 1000,
    });
  }
}
