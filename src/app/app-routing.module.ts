import{ NgModule} from'@angular/core';
import{ RouterModule, Routes} from'@angular/router';
import {SongComponent} from "./song/song.component";
import {HttpClientModule} from "@angular/common/http";
import {SongListComponent} from "./song/song-list/song-list.component";

const routes: Routes= [
  { path: 'song', children:[
      {path:'', component: SongListComponent},
      {path:':id', component: SongComponent}
    ] },
  { path: '', redirectTo:'song', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes), HttpClientModule],
  exports: [ RouterModule]}
)
export class AppRoutingModule{}
