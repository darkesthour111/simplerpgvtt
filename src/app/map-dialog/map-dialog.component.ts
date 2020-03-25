import {  Component,  OnInit,  SimpleChanges, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import io  from 'socket.io-client'
@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.scss']
})
export class MapDialogComponent implements OnInit {
  selectedMap
  socket
  constructor(
    public dialogRef: MatDialogRef<MapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    changeMap(){
      
      this.selectedMap.campaign = this.data.campaignData.campaign.id
      this.socket.emit('updateMap', this.selectedMap)
    }
  ngOnInit(): void {
    this.socket = io('localhost:3000');
  }

}
