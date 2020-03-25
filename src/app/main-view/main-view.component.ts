import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client'
@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {
  campaigns;
  selectedCampaign;
  selectedTable;
  tables = [{
    name: 'Tokens',
    id: 'tokens'
  },
  {
    name: 'Campaigns',
    id: 'campaigns'
  },
  {
    name: 'Maps',
    id: 'maps'
  },
  {
    name: 'Campaign Maps',
    id: 'campaignmaps'
  },
  {
    name: 'Sounds',
    id: 'sounds'
  },
]
  constructor() { }

  ngOnInit(): void {
    var socket = io('localhost:3000');

     
    socket.on('campaigns', (msg) => { //Arrow functions use the correct this context. function(msg) would not.
      this.campaigns = JSON.parse(msg);
    })
    socket.emit('getCampaigns');
    
  }

}
