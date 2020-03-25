import {  Component,  OnInit,  HostListener, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import io  from 'socket.io-client'
@Component({
  selector: 'app-token-dialog',
  templateUrl: './token-dialog.component.html',
  styleUrls: ['./token-dialog.component.scss']
})
export class TokenDialogComponent implements OnInit {
//html models
selectedTokens;
tokenNameIncrement
tokenIncrement
tokenSize
tokens
socket: any

  constructor(
    public dialogRef: MatDialogRef<TokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  createToken() {
    if (!(this.selectedTokens === undefined || this.selectedTokens.length === 0)) {
      for (var x in this.selectedTokens) {
        let newScale = 1;
        if(this.tokenSize != '' && this.tokenSize != undefined){
          newScale = parseFloat(this.tokenSize) / parseFloat(this.selectedTokens[x].sizey)
        }
        this.socket.emit('createToken', JSON.stringify({
          locked: 0,
            hidden: 1,
            angle: 0,
            height: parseInt(this.selectedTokens[x].sizey),
            width: parseInt(this.selectedTokens[x].sizex),
            scalex: newScale,
            scaley: newScale,
            x: 50,
            y: 50,
            mapstate: this.data.campaignData.mapState.id,
            player: '', //future usage
            token: this.selectedTokens[x].id,
            tokenurl: this.selectedTokens[x].url
        }))
      }

    }
  }
  ngOnInit() {
    this.socket = io('localhost:3000');
  }

}

