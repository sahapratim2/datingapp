import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  #http = inject(HttpClient)
  users: any;
  registermode = false;
  ngOnInit() {
   
  }
  registerToggle() {
    this.registermode = !this.registermode;
  }
  // getUsers() {
  //   this.#http.get('http://localhost:5001/api/users').subscribe({
  //     next: response => this.users = response,
  //     error: error => console.log(error),
  //     complete: () => console.log('Requst has completed')
  //   })
  // }
  cancelRegisterMode(event: boolean)
  {
    this.registermode = event;
  }

}
