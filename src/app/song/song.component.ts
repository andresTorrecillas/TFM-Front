import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Song} from "./Song.model";
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

  public song: Song;

  constructor(dialog: MatDialog, route: ActivatedRoute, httpService: HttpService) {
    this.dialog = dialog;
    this.route = route;
    this.song = {id:0, title:"", lyrics:""};
    this.httpService = httpService;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')??"";

    this.httpService
      .get(SongComponent.END_POINT + "/" + id)
      .subscribe({
          next: (body: Song) => {
            this.song.title = body.title;
            this.song.lyrics = body.lyrics;
          },
          error: error => {
            this.song.title = "ERROR";
            console.log(error);
          },
        });
  }

  isLyricsSet(): boolean{
    return this.song.lyrics !== null && this.song.lyrics !== "";
  }
}


