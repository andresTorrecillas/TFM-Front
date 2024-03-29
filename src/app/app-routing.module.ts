import{ NgModule} from'@angular/core';
import{ RouterModule, Routes} from'@angular/router';
import {SongComponent} from "./song/song.component";
import {HttpClientModule} from "@angular/common/http";
import {SongListComponent} from "./song/song-list.component";
import {LogInComponent} from "./auth/log-in.component";
import {AuthGuard} from "./auth/auth.guard";
import {RegisterComponent} from "./auth/register.component";
import {ConcertListComponent} from "./concert/concert-list.component";
import {ConcertComponent} from "./concert/concert.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes= [
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent},
  { path: 'song', canActivate: [AuthGuard], children:[
      { path:'', component: SongListComponent },
      { path:':id', component: SongComponent }
    ] },
  { path: 'concert', canActivate: [AuthGuard], children:[
      { path: '', component: ConcertListComponent },
      { path: ':id', component: ConcertComponent }
    ]},
  { path: 'login', component: LogInComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo:'home', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes), HttpClientModule ],
  exports: [ RouterModule ]
})
export class AppRoutingModule{}
