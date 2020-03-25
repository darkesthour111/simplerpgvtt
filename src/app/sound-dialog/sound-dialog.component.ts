import {  Component,  OnInit,  HostListener, Inject} from '@angular/core';
import {  ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import io  from 'socket.io-client'

@Component({
  selector: 'app-sound-dialog',
  templateUrl: './sound-dialog.component.html',
  styleUrls: ['./sound-dialog.component.scss']
})
export class SoundDialogComponent implements OnInit {
  selectedSounds;
  socket;
  constructor(
    public dialogRef: MatDialogRef<SoundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    onNoClick(): void {
      this.dialogRef.close();
    }
    createSound() {
      if (!(this.selectedSounds === undefined || this.selectedSounds.length === 0)) {
        for (var x in this.selectedSounds) {
          this.socket.emit('createSound',{
              active: 1,
              angle: 0,
              height: 100,
              width: 100,
              scalex: 1,
              scaley: 1,
              x: 50,
              y: 50,
              mapstate: this.data.campaignData.mapState.id,
              sound: this.selectedSounds[x].id
          })
        }
  
      }
    }
    showHideSoundLayer = function () { //fuck yeah got it to work.
      if(this.soundLayerHidden === 1){
        this.data.soundLayer.show();
        this.data.soundLayer.draw();
        this.soundLayerHidden = 0;
      }
      else{
        this.data.soundLayer.hide();
        this.soundLayerHidden = 1;
      }
    }
  ngOnInit(): void {
    this.socket = io('localhost:3000');
  }

}
