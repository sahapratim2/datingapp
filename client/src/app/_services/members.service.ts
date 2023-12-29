import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  #http = inject(HttpClient);
  constructor() { }

  getMembers() {
    return this.#http.get<Member[]>(this.baseUrl + 'users')
  }
  getMember(userName: string) {
    return this.#http.get<Member>(this.baseUrl + 'users/' + userName);
  }

  /*
  getMembers() {
    return this.#http.get<Member[]>(this.baseUrl+'users',this.getHttpOptions())
  }
  getMember(userName: string) {
    retun this.#http.get<Member>(this.baseUrl + 'users/' + userName, this.getHttpOptions());
  }

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    console.log(userString);
    if (!userString) return;
    const user = JSON.parse(userString);
    console.log(user.token);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    };
  }
  */
}
