import { MemeberListComponent } from './members/memeber-list/memeber-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemeberDetailComponent } from './members/memeber-detail/memeber-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MemeberListComponent, canActivate: [authGuard] },
      { path: 'members/:username', component: MemeberDetailComponent },
      { path: 'member/edit', component: MemberEditComponent, canDeactivate:[preventUnsavedChangesGuard] },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
    ]
  },
  { path: 'errors', component: TestErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },

  // { path: '', component: HomeComponent },
  // { path: 'members', component: MemeberListComponent, canActivate: [authGuard] },
  // { path: 'members/:id', component: MemeberDetailComponent },
  // { path: 'lists', component: ListsComponent },
  // { path: 'messages', component: MessagesComponent },
  // { path: '**', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
