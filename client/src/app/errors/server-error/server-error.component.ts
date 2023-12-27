import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent {
  #router = inject(Router);
  error: any;
  constructor() {
    const navigation = this.#router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];
  }

}
