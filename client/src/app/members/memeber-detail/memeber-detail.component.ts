import { Photo } from './../../_models/photo';
import { Member } from 'src/app/_models/member';
import { Component, ViewChild, inject } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoClock, TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';

@Component({
  selector: 'app-memeber-detail',
  standalone: true,
  templateUrl: './memeber-detail.component.html',
  styleUrls: ['./memeber-detail.component.css'],
  imports: [CommonModule, TabsModule, GalleryModule, TimeagoModule, MemberMessagesComponent]// because we use as a stanalone module
})
export class MemeberDetailComponent {
  @ViewChild('memberTabs',{static:true}) memberTabs?: TabsetComponent;
  #memberSerVice = inject(MembersService);
  #route = inject(ActivatedRoute);
  #messageService = inject(MessageService);
  member: Member={} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];

  ngOnInit() {
    //this.loadMember() replace with below route resolver
    this.#route.data.subscribe({
      next: data => this.member = data['member']
    });
    this.#route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab']);
      }
    })
  }

  loadMessages() {
    if (this.member) {
      this.#messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
      })
    }
    this.getImages();
  }

  
  selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages') {
      this.loadMessages()
    }
  }

  getImages() {
    if (!this.member) return
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
      //  this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
  }

  // loadMember() {
  //   let userName = this.#route.snapshot.paramMap.get('username')
  //   if (userName) {
  //     this.#memberSerVice.getMember(userName).subscribe({
  //       next: member => {
  //         this.member = member
  //         this.getImages();
  //       }
  //     })
  //   }
  // }
}
