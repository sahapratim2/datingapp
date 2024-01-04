import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';

@Directive({
  selector: '[appHasRole]' //*appHasRole='["Admin","Thing"]'
})
export class HasRoleDirective {
  #viewContainerRef = inject(ViewContainerRef);
  #templateRef = inject(TemplateRef<any>);
  #accountService = inject(AccountService);
   
  @Input() appHasRole: string[] = [];
  user: User = {} as User;

  constructor() { 
    this.#accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    })
  }
  ngOnInit() {
    if (this.user.roles.some(r => this.appHasRole.includes(r))) {
      this.#viewContainerRef.createEmbeddedView(this.#templateRef);
    }
    else {
      this.#viewContainerRef.clear();
    }
  }

}
