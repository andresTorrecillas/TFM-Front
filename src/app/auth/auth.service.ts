import {Injectable} from '@angular/core';
import {map, mergeMap, Observable} from "rxjs";
import {AuthObject} from "./authObject.model";
import {EndPoints} from "../shared/end-points";
import {HttpService} from "../shared/services/http.service";
import {LoginDto} from "./loginDto.model";
import {RegisterDto} from "./registerDto.model";
import {SessionStorageService} from "../shared/services/session-storage.service";
import {Base64} from 'js-base64';
import {DecodedJwt} from "./decodedJwt.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLogged: boolean;
  public redirectUrl: string|null;
  private http: HttpService;
  private sesService: SessionStorageService;

  constructor(http: HttpService, sesService: SessionStorageService) {
    this.http = http;
    this.sesService = sesService;
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
          this.writeInStorage(body);
          this.isLogged = true;
        })
      );
  }

  logout(): void{
    this.isLogged = false;
    this.sesService.erase(['user', 'bearer_token', 'expiration_date']);
    this.http.get(EndPoints.LOGOUT).subscribe();
  }

  register(data: RegisterDto): Observable<string|null> {
    return this.http.post(EndPoints.REGISTER, data)
      .pipe(
        mergeMap(user => {
          return this.login({password: data.password, userName: user.userName})
            .pipe(
              map(() => this.redirectUrl)
            );
        })
      )
  }

  public isLoggedIn(): boolean {
    const authObj: AuthObject|null = this.readFromStorage();
    if(authObj == null) {
      return false
    }
    this.isLogged = parseInt(authObj.expirationDate) > Date.now();
    return this.isLogged;
  }

  public static decodeJWT(token: string): DecodedJwt|null{
    let tokenArray = token.split(".");
    if(tokenArray.length < 3){
      return null;
    }
    let decodedHeader = JSON.parse(Base64.decode(tokenArray[0]));
    let decodedPayload = JSON.parse(Base64.decode(tokenArray[1]));
    return {
      header: {
        type: decodedHeader.typ,
        algorithm: decodedHeader.alg
      },
      payload: {
        issuedAt: decodedPayload.iat,
        expirationTime: decodedPayload.exp,
        user: decodedPayload.userName
      }
    };
  }

  private readFromStorage(): AuthObject|null{
    let token = this.sesService.read("bearer_token");
    let expirationDate = this.sesService.read("expiration_date");
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

  private writeInStorage(data: any): void{
    if(!AuthService.checkLoginResponseFormat(data)){
      throw new Error("The data to store in sessionStorage is not checked");
    }
    let collection = {
      'bearer_token': data.token,
      'expiration_date': data.expirationDate,
      'user': JSON.stringify(data.user)
    }
    this.sesService.writeMany(collection);
  }
}
