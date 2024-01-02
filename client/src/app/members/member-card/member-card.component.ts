import { MembersService } from 'src/app/_services/members.service';
import { Member } from './../../_models/member';
import { Component, Input, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
  #memberService = inject(MembersService);
  #toastr = inject(ToastrService);
  @Input()
  member: Member | undefined;
  //  member: Member = {} as Member;
  addLike(member: Member) {
    this.#memberService.addLike(member.userName).subscribe({
      next: () =>
        this.#toastr.success('You have liked ' + member.knownAs)
    });
  }
}
