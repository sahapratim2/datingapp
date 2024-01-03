import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
  imports:[CommonModule,TimeagoModule,FormsModule]
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm?: NgForm;
  #messageService = inject(MessageService);
  @Input() userName?: string;
  @Input() messages: Message[] = [];
  messageContent = '';

  sendMessage() {
    if (!this.userName) return;
    this.#messageService.sendMessage(this.userName, this.messageContent).subscribe({
      next: message => {
        this.messages.push(message)
        this.messageForm?.reset();
      }
    })
  }

  
}
