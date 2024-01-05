import { Injectable, inject, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  #toastr = inject(ToastrService);
  #hubConnection?: HubConnection;
  onlineUsersSignal = signal<string[]>([]);
  #router = inject(Router);
  // #onlineUsersSource = new BehaviorSubject<string[]>([]);
  // onlineUsers$ = this.#onlineUsersSource.asObservable();
 
  constructor() { };
  
  createHubConnection(user: User) {
    this.#hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();
    this.#hubConnection.start().catch(error => console.log(error));

    this.#hubConnection.on('UserIsOnline', userName => {
      this.onlineUsersSignal.set([...this.onlineUsersSignal(), userName]);
      //this.#toastr.info(userName + ' has Connected')
    });

    this.#hubConnection.on('UserIsOffline', userName => {
      // this.#toastr.warning(userName + ' has Disconnected')
      this.onlineUsersSignal.set(this.onlineUsersSignal().filter(x => x !== userName));
    });

    this.#hubConnection.on('GetOnlineUsers', userNames => {
      // this.#onlineUsersSource.next(userNames);
      this.onlineUsersSignal.set(userNames);
    });

    this.#hubConnection.on('NewMessageRecdived', ({userName,knownAs}) => {
      this.#toastr.info(knownAs + ' has sent you a new message!! Click me to see it.')
        .onTap
        .pipe(take(1))
        .subscribe({
          next: ()=> this.#router.navigateByUrl("/members/"+userName+'?tab=Messages')
        });
    })
  }

  stopHubConnection() {
    this.#hubConnection?.stop().catch(error => console.log(error));
  }
}
