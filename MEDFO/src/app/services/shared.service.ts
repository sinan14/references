import { Injectable } from '@angular/core';
import { Subject,Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private subject = new Subject<string>();
  constructor() { }
  sendMessage(message: string) {
    this.subject.next(message);
  }
  recieveMessage(): Observable<string> {
    return this.subject.asObservable();
  }
}
