import{ NgModule} from'@angular/core';
import{ RouterModule, Routes} from'@angular/router';
import {SongComponent} from "./song/song.component";
import {HttpClientModule} from "@angular/common/http";
import {SongListComponent} from "./song/song-list.component";
import {LogInComponent} from "./auth/log-in.component";
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes= [
  { path: 'song', canActivate: [AuthGuard], children:[
      { path:'', component: SongListComponent },
      { path:':id', component: SongComponent }
    ] },
  { path: 'login', component: LogInComponent },
  { path: '', redirectTo:'song', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes), HttpClientModule],
  exports: [ RouterModule]}
)
export class AppRoutingModule{}
