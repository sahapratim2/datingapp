import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  #http = inject(HttpClient);
  constructor() { }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.#http);
  }
  getMessageThread(userName: string) {
    return this.#http.get<Message[]>(this.baseUrl + 'messages/thread/' + userName);
  }

  sendMessage(userName: string, content: string) {
    return this.#http.post<Message>(this.baseUrl + 'messages', { recipientUserName: userName,content})
  }
  deleteMessage(id: number) {
    return this.#http.delete(this.baseUrl + 'messages/' + id);
  }
}
