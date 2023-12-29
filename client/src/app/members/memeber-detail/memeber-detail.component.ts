import { Photo } from './../../_models/photo';
import { Member } from 'src/app/_models/member';
import { Component, inject } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-memeber-detail',
  standalone:true,
  templateUrl: './memeber-detail.component.html',
  styleUrls: ['./memeber-detail.component.css'],
  imports:[CommonModule,TabsModule,GalleryModule]// because we use as a stanalone module
})
export class MemeberDetailComponent {
  #memberSerVice = inject(MembersService);
  #route = inject(ActivatedRoute);
  member: Member | undefined;
  images: GalleryItem[] = [];


  ngOnInit() {
    this.loadMember();
  }
  loadMember() {
    let userName = this.#route.snapshot.paramMap.get('username')
    if (userName) {
      this.#memberSerVice.getMember(userName).subscribe({
        next: member => {
          this.member = member
          this.getImages();
        }
      })
    }
  }

  getImages() {
    if (!this.member)return
       for (const photo of this.member.photos) {
         this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
        //  this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
      }
  }

}
