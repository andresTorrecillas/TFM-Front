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

  openSnackbar(message:string, action:string = "Cerrar", duration:number = environment.NOTIFICATION_DURATION): void{
    this.snackBar.open(message, action,{
      duration: duration * 1000,
    });
  }

  openErrorSnackbar(message:string, action:string = "Error", duration:number = environment.NOTIFICATION_DURATION): void{
    this.snackBar.open(message,action,{
      duration: duration * 1000,
      panelClass: "bg-danger"
    })
  }
}
