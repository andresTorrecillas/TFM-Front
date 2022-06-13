import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

interface subscribeObject {
  [key: string]: Subject<any>;
}

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private subscribers: subscribeObject;

   constructor() {
     this.subscribers = {
       any: new Subject<any>()
     }
   }

  write(key: string, element: string){
    sessionStorage.setItem(key, element);
    this.subscribers["any"].next({key: element})
    if(this.subscribers[key] != null){
      this.subscribers[key].next(element);
    } else {
      this.subscribers[key] = new Subject<string>();
      this.subscribers[key].next(element);
    }
  }

  writeMany(elements: { [key:string] : string }){
    for (let key in elements) {
      this.write(key, elements[key]);
    }
  }

  read(key: string): string | null{
     return sessionStorage.getItem(key);
  }

  getObservable(key: string | null = null, generate: boolean = false): Observable<any>|null{
     if(generate){
       if(key !== null && this.subscribers[key] == null){
         this.subscribers[key] = new Subject<string>();
       }
     } else {
       if(key !== null && this.subscribers[key] === null){
         return null;
       }
     }

     return this.subscribers[key??"any"].asObservable();
  }

  erase(keys: string[]) {
    for (let key of keys) {
      sessionStorage.removeItem(key);
      let subject = this.subscribers[key];
      if(subject !== null){
        subject.next("");
      }
    }
  }

}
