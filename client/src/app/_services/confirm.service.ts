import { Injectable, inject } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { Observable, pipe, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  #modalService = inject(BsModalService);
  bsModalRef?: BsModalRef<ConfirmDialogComponent>;

  constructor() { }

  confirm(
    title = 'Confirmation',
    message = 'Are you sure you want to do this?',
    btnOkText = 'Ok',
    btnCancelText = 'Cancel'
  ): Observable<boolean> {
    const config = {
      initialState: {
        title,
        message,
        btnOkText,
        btnCancelText
      }
    }
    this.bsModalRef = this.#modalService.show(ConfirmDialogComponent, config);
    console.log(this.bsModalRef);
    return this.bsModalRef.onHidden!.pipe(
      map(() => {
        console.log("this.bsModalRef!.content!.result");
        return this.bsModalRef!.content!.result
      })
    )
  }
}
