import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dating app';
  users:any;
  #http = inject(HttpClient);
  constructor(){}
  ngOnInit(): void {
   this.#http.get('http://localhost:5001/api/users').subscribe({
    next:response =>this.users=response,
    error:error=>console.log(error),
    complete:()=>console.log(this.users)
   })
  }

}
