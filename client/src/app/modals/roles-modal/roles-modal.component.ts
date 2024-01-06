import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-roles-model',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent {
  userName = '';
  availableRoles: any[] = [];
  selectedRoles: any[] = [];
    // title = '';
  // list: any;
  // closeBtnName = '';
  bsModalRef = inject(BsModalRef);

  updateChecked(checkedValue: string) {
    const index = this.selectedRoles.indexOf(checkedValue);
    index !== -1 ? this.selectedRoles.splice(index, 1) : this.selectedRoles.push(checkedValue);
  }

}
