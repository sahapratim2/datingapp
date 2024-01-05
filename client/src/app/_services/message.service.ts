import { Group } from './../_models/group';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  #http = inject(HttpClient);
  #hubConnection?: HubConnection;
  messageThreadSignal = signal<Message[]>([]);

  constructor() { }


  createHubConnection(user: User, otherUserName : string) {
    this.#hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user='+otherUserName, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();
    
    this.#hubConnection.start().catch(error => console.log(error));

    this.#hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSignal.set(messages);
    });

    this.#hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.userName === otherUserName)) {
        this.messageThreadSignal().forEach(message => {
          if (!message.dateRead) {
            message.dateRead = new Date(Date.now());
          }
        })
   
      }
    })

    this.#hubConnection.on('NewMessage', message => {
      this.messageThreadSignal.set([...this.messageThreadSignal(), message]);
    });

  }

  stopHubConnection() {
    if (this.#hubConnection) {
      this.#hubConnection?.stop().catch(error => console.log(error));
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.#http);
  }
  getMessageThread(userName: string) {
    return this.#http.get<Message[]>(this.baseUrl + 'messages/thread/' + userName);
  }

  async sendMessage(userName: string, content: string) {
    // return this.#http.post<Message>(this.baseUrl + 'messages', { recipientUserName: userName,content})

    return this.#hubConnection?.invoke('SendMessage', { recipientUserName: userName, content }).catch(error=>console.log(error));
     
    // 'SendMessage' from MessageHub(backend)
  }
  deleteMessage(id: number) {
    return this.#http.delete(this.baseUrl + 'messages/' + id);
  }
}
