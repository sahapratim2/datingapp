import { Component, inject } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModelComponent } from 'src/app/models/roles-model/roles-model.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  #adminSrvice = inject(AdminService);
  #modalService = inject(BsModalService);
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModelComponent> = new BsModalRef<RolesModelComponent>();
  availableRoles = ['Admin', 'Moderator', 'Member'];

  ngOnInit(): void{
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.#adminSrvice.getUsersWithRoles().subscribe({
      next: users => this.users = users
    })
  }
  openRolesModel(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        userName: user.userName,
        availableRoles: this.availableRoles,
        selectedRoles:[...user.roles]
      }
    }
    this.bsModalRef = this.#modalService.show(RolesModelComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if (!this.arrayEqual(selectedRoles!, user.roles)) {
          this.#adminSrvice.updateUserRoles(user.userName, selectedRoles!).subscribe({
            next: roles=>user.roles=roles
          })
        }
      }
    })

  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
  // openRolesModel() {
  //   const initialState: ModalOptions = {
  //     initialState: {
  //       list: [
  //         'A',
  //         'B',
  //         'C'
  //       ],
  //       title:'Test modal'
  //     }
  //   }
  //   this.bsModalRef = this.#modalService.show(RolesModelComponent, initialState);
   
  // }
}
