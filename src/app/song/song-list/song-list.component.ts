import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HttpService} from "../../shared/services/http.service";
import {Song} from "../Song.model";
import {EndPoints} from "../../shared/end-points";
import {AddSongDialogComponent} from "../add-song-dialog.component";

@Component({
  selector: 'app-song-list',
  templateUrl: 'song-list.component.html',
  styleUrls: ['song-list.component.css']
})
export class SongListComponent implements OnInit {

  public dialog: MatDialog;
  private httpService: HttpService;
  public songList: Array<Song>;

  constructor(dialog:MatDialog, httpService:HttpService) {
    this.dialog = dialog;
    this.httpService = httpService;
    this.songList = [];
  }

  ngOnInit() {
    this.httpService
      .get(EndPoints.SONG)
      .subscribe({
        next: (body: Array<Song>) => {
          this.songList = body;
          //console.log(this.song);
        },
        error: error => {
          console.log(error);
        },
      });
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(AddSongDialogComponent, {
      width: '40vw',
      height: '80vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
