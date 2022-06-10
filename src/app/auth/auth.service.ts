import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {AuthObject} from "./authObject.model";
import {EndPoints} from "../shared/end-points";
import {HttpService} from "../shared/services/http.service";
import {LoginDto} from "./loginDto.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLogged: boolean;
  public redirectUrl: string|null;
  private http: HttpService;

  constructor(http: HttpService) {
    this.http = http;
    this.isLogged = false;
    this.redirectUrl = null;
  }

  login(body: LoginDto): Observable<void>{
    return this.http.post(EndPoints.LOGIN, body)
      .pipe(
        map(body => {
          if(!AuthService.checkLoginResponseFormat(body)){
            throw new Error("The data received doesn't have the correct format");
          }
          AuthService.writeInStorage(body);
          this.isLogged = true;
          console.log(this.isLogged);
        })
      );
  }

  logout(): void{
    this.isLogged = false;
  }

  public isLoggedIn(): boolean {
    const authObj: AuthObject|null = AuthService.readFromStorage();
    if(authObj == null) {
      return false
    }
      this.isLogged = parseInt(authObj.expirationDate) > Date.now()
    return this.isLogged;
  }

  private static readFromStorage(): AuthObject|null{
    let token = sessionStorage.getItem("bearer_token");
    let expirationDate = sessionStorage.getItem("expiration_date");
    return (token != null && expirationDate != null) ?
      {
        token: token,
        expirationDate: expirationDate
      }
      : null;
  }

  private static checkLoginResponseFormat(responseBody: any): boolean {
    return responseBody.hasOwnProperty("token") &&
      responseBody.hasOwnProperty("expirationDate") &&
      responseBody.hasOwnProperty("user");
  }

  private static writeInStorage(data: any): void{
    if(!AuthService.checkLoginResponseFormat(data)){
      throw new Error("The data to store in sessionStorage is not checked");
    }
    sessionStorage['bearer_token'] = data.token;
    sessionStorage['expiration_date'] = data.expirationDate;
    sessionStorage['user'] = data.user;
  }
}
