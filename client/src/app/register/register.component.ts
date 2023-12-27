import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  #accountService = inject(AccountService);
  #toastr = inject(ToastrService);
  @Output()
  cancelRegister = new EventEmitter();
  model: any = {};
  
  register() {
    this.#accountService.register(this.model).subscribe({
      next: () => {
        this.cancel();
      },
      error: error => {
        this.#toastr.error(error.error);
        console.log(error);
        
      }
    })
  }
  cancel() {
    this.cancelRegister.emit(false)
  }
}
