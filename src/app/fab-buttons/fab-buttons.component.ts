import { Component, OnInit, Input } from '@angular/core';
import { fabButtonsAnimation } from './fab-buttons.animation'
import { TokenDialogComponent } from '../token-dialog/token-dialog.component'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import io from 'socket.io-client'
import { SoundDialogComponent } from '../sound-dialog/sound-dialog.component';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';
@Component({
  selector: 'app-fab-buttons',
  templateUrl: './fab-buttons.component.html',
  styleUrls: ['./fab-buttons.component.scss'],
  animations: fabButtonsAnimation
})
export class FabButtonsComponent implements OnInit {
  @Input() tokens: any
  @Input() campaignData: any
  @Input() sounds: any
  @Input() soundLayer: any
  

  socket
  constructor(
    public dialog: MatDialog
  ) { }
  


  fabButtons = [
    {
      icon: 'cloud',
      tooltip: 'Add Fog'
    },
    {
      icon: 'person_add',
      tooltip: 'Open Token Dialog'
    },
    {
      icon: 'play_circle_filled',
      tooltip: 'Open Sound Dialog'
    },
    {
      icon: 'wallpaper',
      tooltip: 'Change Map'
    }
  ];
  buttons = [];
  fabTogglerState = 'inactive';

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }
  createFog() {
    this.socket.emit('createFog', this.campaignData.mapState.id)
  }
  /* dialogs */
  openDialog(button){
    if(button === 'person_add'){
      this.openTokenDialog();
    }
    else if(button === 'cloud'){
      this.createFog();
    }
    else if(button === 'play_circle_filled'){
      this.openSoundDialog()
    }
    else if(button === 'wallpaper'){
      this.openMapDialog()
    }
  }
  openTokenDialog(): void {
    const dialogRef = this.dialog.open(TokenDialogComponent, {
      width: '250px',
      data: {tokens: this.tokens, campaignData: this.campaignData}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      
    });
  }
  openSoundDialog(): void {
    
    const dialogRef = this.dialog.open(SoundDialogComponent, {
      width: '250px',
      data: {sounds: this.sounds, campaignData: this.campaignData, soundLayer: this.soundLayer}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      
    });
  }

  openMapDialog(): void {
    const dialogRef = this.dialog.open(MapDialogComponent, {
      width: '250px',
      data: {campaignData: this.campaignData}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      
    });
  }
  ngOnInit(): void {
    this.socket = io('localhost:3000')
  }
}