import { Component, Inject, inject } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  model: any = {}
  accountService = inject(AccountService);
  #router = inject(Router);
  #toastr = inject(ToastrService);

  ngOnInit() {
  }
  // getCurrentUser() {
  //   this.#accountService.currentUser$.subscribe({
  //     next: user => this.loggedIn = !!user,
  //     error: error=> console.log(error)
  //   })
  // }
  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        
        this.#router.navigateByUrl('/members');
        this.model = {};//empty login text box;
        }
      })
  }
  logout() {
  //  this.#memberService.resetUserParams();
    this.accountService.logout();
    this.#router.navigateByUrl('/');
    
    //this.loggedIn = false;
  }

}
