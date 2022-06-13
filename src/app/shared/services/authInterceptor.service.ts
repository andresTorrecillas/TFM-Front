import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {SessionStorageService} from "./session-storage.service";

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

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
