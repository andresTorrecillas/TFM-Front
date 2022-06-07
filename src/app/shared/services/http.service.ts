import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  private params: HttpParams;
  private http: HttpClient;
  private headers: HttpHeaders;

  constructor(http: HttpClient) {
    this.http = http;
    this.params = new HttpParams();
    this.headers = new HttpHeaders();
  }

  param(key: string, value: string): HttpService {
    if (value != null) {
      this.params = this.params.append(key, value);
    }
    return this;
  }

  get(path: string): Observable<any> {
    return this.http
      .get(path, this.createOptions())
      .pipe(
        map(HttpService.extractResponseBody),
        catchError(HttpService.handleError)
      );
  }

  post(path: string, body?: object): Observable<any> {
    return this.http
      .post(path, body, this.createOptions())
      .pipe(
        map(HttpService.extractResponseBody),
        catchError(HttpService.handleError)
      );
  }

  delete(path: string): Observable<any>{
    return this.http
      .delete(path, this.createOptions());
  }

  patch(path: string, data: any): Observable<any> {
    return this.http
      .patch(path, data, this.createOptions())
      .pipe(
        map(HttpService.extractResponseBody),
        catchError(HttpService.handleError)
      );
  }

  private createOptions(): any {
    const options: any = {
      headers: this.headers,
      params: this.params,
      responseType: 'json',
      observe: 'response'
    };
    this.resetOptions();
    return options;
  }

  private resetOptions(): void {
    this.params = new HttpParams();
  }

  private static extractResponseBody(response: any): any{
    //console.log(response.body);
    return response.body;
  }

  private static handleError(error: any){
    console.log(error)
    return new Observable(subscriber => {
      subscriber.error(error.error);
    });
  }



}
