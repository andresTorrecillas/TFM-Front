import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {SongComponent} from "./song/song.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatDialogModule} from '@angular/material/dialog';
import {AddSongDialogComponent} from "./song/add-song-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {AppRoutingModule} from "./app-routing.module";
import {HttpService} from "./shared/services/http.service";
import {MatCardModule} from "@angular/material/card";



@NgModule({
  declarations: [
    AppComponent,
    SongComponent,
    AddSongDialogComponent
  ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule
    ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
// @ts-ignore
export class AppModule { }
