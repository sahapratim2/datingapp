import { Component, inject } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-memeber-list',
  templateUrl: './memeber-list.component.html',
  styleUrls: ['./memeber-list.component.css']
})
export class MemeberListComponent {
  #memberService = inject(MembersService);
  members: Member[] = [];

  ngOnInit() {
    this.loadMembers()
  }
  loadMembers() {
    this.#memberService.getMembers().subscribe({
      next: members => this.members = members
    }
    )
  }

}
