import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-memeber-list',
  templateUrl: './memeber-list.component.html',
  styleUrls: ['./memeber-list.component.css']
})
export class MemeberListComponent {
  #memberService = inject(MembersService);
  members$: Observable<Member[]> | undefined;

  ngOnInit() {
    this.members$ = this.#memberService.getMembers();
  }
  // loadMembers() {
  //   this.#memberService.getMembers().subscribe({
  //     next: members => this.members = members
  //   }
  //   )
  // }

}
