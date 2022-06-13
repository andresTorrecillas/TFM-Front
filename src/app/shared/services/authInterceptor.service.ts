import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {SessionStorageService} from "./session-storage.service";
import {AuthService} from "../../auth/auth.service";

@Injectable({
  providedIn: "root"
})

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private sesStorage: SessionStorageService;

  constructor(sesStorage: SessionStorageService) {
    this.sesStorage = sesStorage;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.sesStorage.read("bearer_token");

    if (token !== null) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer " + token)
      });

      return next.handle(cloned)
        .pipe(
          tap({
            next: httpEvent => {
              if(httpEvent instanceof HttpResponse){
                let responseToken = httpEvent.headers.get("authorization");
                if(token !== responseToken && responseToken !== null){
                  responseToken = responseToken.replace("Bearer ", "");
                  let decodedToken = AuthService.decodeJWT(responseToken);
                  if(decodedToken !== null) {
                    this.sesStorage.writeMany({
                      'bearer_token': responseToken,
                      'expiration_date': decodedToken.payload.expirationTime.toString()
                    });
                  }
                }
              }
            }
          })
        );
    }
    else {
      return next.handle(req);
    }
  }


}
