import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Song} from "./Song.model";
import {AddSongDialogComponent} from "./add-song-dialog.component";
import { ActivatedRoute } from '@angular/router';
import {HttpService} from "../shared/services/http.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-song',
  templateUrl: 'song.component.html',
  styleUrls: ['song.component.css']
})
export class SongComponent implements OnInit {

  static END_POINT: string = environment.REST_SERVER + '/song';
  public dialog: MatDialog;
  private route: ActivatedRoute;
  private httpService: HttpService;
  private id: Number;
  public song: Song;

  constructor(dialog: MatDialog, route: ActivatedRoute, httpService: HttpService) {
    this.dialog = dialog;
    this.route = route;
    this.song = {title:"", lyrics:""};
    this.id = 0;
    this.httpService = httpService;
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(AddSongDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.song = result;
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id']??0;
    });
    this.httpService
      .param("id",this.id.toString())
      .get(SongComponent.END_POINT)
      .subscribe({
          next: (body: Song) => {
            this.song.title = body.title;
            this.song.lyrics = body.lyrics;
            console.log(this.song);
          },
          error: error => {
            this.song.title = "ERROR";
            console.log(error);
          },
        });
  }
}


