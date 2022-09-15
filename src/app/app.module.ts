import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {SongComponent} from "./song/song.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatDialogModule} from '@angular/material/dialog';
import {AddUpdateSongDialogComponent} from "./song/add-update-song-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from "@angular/material/button";
import {AppRoutingModule} from "./app-routing.module";
import {HttpService} from "./shared/services/http.service";
import {MatCardModule} from "@angular/material/card";
import {SongListComponent} from "./song/song-list.component";
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ConfirmDialogComponent} from "./shared/components/confirm-dialog/confirm-dialog.component";
import {SnackbarService} from "./shared/services/snackbar.service";
import {LogInComponent} from "./auth/log-in.component";
import {AuthService} from "./shared/services/auth.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "./shared/services/authInterceptor.service";
import {RegisterComponent} from "./auth/register.component";
import {SessionStorageService} from "./shared/services/session-storage.service";
import {ConcertComponent} from "./concert/concert.component";
import {ConcertListComponent} from "./concert/concert-list.component";
import {AddUpdateConcertDialogComponent} from "./concert/add-update-concert-dialog.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {HomeComponent} from "./home/home.component";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    ConcertComponent,
    ConcertListComponent,
    SongComponent,
    SongListComponent,
    LogInComponent,
    AddUpdateSongDialogComponent,
    AddUpdateConcertDialogComponent,
    ConfirmDialogComponent,
    RegisterComponent
  ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        FormsModule,
        MatIconModule,
        MatSnackBarModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        MatGridListModule,
        MatTabsModule
    ],
  providers: [
    HttpService,
    SnackbarService,
    AuthService,
    SessionStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
// @ts-ignore
export class AppModule { }
