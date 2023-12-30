import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Member } from '../_models/member';
import { map, of, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  #http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor() { }

  getMembers() {
    if (this.members.length > 0) return of(this.members);
    return this.#http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members;
        return members
      })
    );
  }
  getMember(userName: string) {
    const member = this.members.find(x => x.userName == userName);
    if (member) return of(member);
    return this.#http.get<Member>(this.baseUrl + 'users/' + userName);
  }

  updateMember(member: Member) {
    return this.#http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.#http.put(this.baseUrl+'users/set-main-photo/'+photoId,{})
  }

  deletePhoto(photoId: number) {
   return this.#http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
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
