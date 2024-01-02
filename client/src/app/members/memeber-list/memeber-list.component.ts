import { Component, inject } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-memeber-list',
  templateUrl: './memeber-list.component.html',
  styleUrls: ['./memeber-list.component.css']
})
export class MemeberListComponent {
  #memberService = inject(MembersService);
  // members$: Observable<Member[]> | undefined;
  members: Member[] = [];
  pagination: Pagination | undefined;
  // pageNumber = 1;
  // pageSize = 5;
  userParams: UserParams | undefined;
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }]

  constructor() {
    this.userParams = this.#memberService.getUserParams();
  }

  ngOnInit() {
    // this.members$ = this.#memberService.getMembers();
    this.loadMembers();
  }

  loadMembers() {
    if (this.userParams) {
      this.#memberService.setUserParams(this.userParams);
      this.#memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response?.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      })
    };
   
  }

  resetFilters() {
      this.userParams = this.#memberService.resetUserParams();
      this.loadMembers();
  }
  pageChanged(event: any) {
    if (this.userParams &&this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.#memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }

  /*
  loadMembers() {
    this.#memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
      next: response => {
        if (response?.result && response.pagination) {
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    })
  }
  pageChanged(event: any) {
    if (this.pageNumber != event.page) {
      this.pageNumber = event.page;
      this.loadMembers();
    }
  }
  */
  // loadMembers() {
  //   this.#memberService.getMembers().subscribe({
  //     next: members => this.members = members
  //   }
  //   )
  // }
}

