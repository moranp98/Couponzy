import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RealtimeService {
  
  constructor(private socket: Socket) { }

  listen(EventName: string){
    return new Observable((Subscriber) => {
      this.socket.on(EventName, (data) => {
        Subscriber.next(data);  
      })
    })
  }
}
