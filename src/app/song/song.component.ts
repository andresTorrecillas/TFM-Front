import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Song} from "./Song.model";
import {AddSongDialogComponent} from "./add-song-dialog.component";

@Component({
  selector: 'app-song',
  templateUrl: 'song.component.html',
  styleUrls: ['song.component.css']
})

export class SongComponent implements OnInit {

  public dialog: MatDialog;
  private song: Song;

  constructor(dialog: MatDialog) {
    this.dialog = dialog;
    this.song = {title:"", lyrics:""};
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
  }
}


