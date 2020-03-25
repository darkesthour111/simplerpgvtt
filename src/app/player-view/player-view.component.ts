import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Konva from 'konva'
import io from 'socket.io-client'
import { MainStageService } from '../main-stage.service'
import { BackgroundLayerService } from '../background-layer.service'
import { TokenLayerService } from '../token-layer.service';
import { FogLayerService } from '../fog-layer.service';
import { VideoLayerService } from '../video-layer.service';
@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent implements OnInit {
  stage: Konva.Stage;
  mapLayer: Konva.Layer;
  fogLayer: Konva.Layer;
  tokenLayer: Konva.Layer;
  videoLayer: Konva.Layer;
  socket: io;
  
  //Global tracking of KonvaObjects so we can update as needed.
  globalBackground = {'backgroundImage': ''};
  globalTokens = {};
  globalFog = {};
  globalVideo = {};
  globalFogTransformers = {};

  campaignData: any;
  constructor(
    private mainStage: MainStageService,
     private background: BackgroundLayerService,
     private token: TokenLayerService,
     private fog: FogLayerService,
     private video: VideoLayerService,
     private route: ActivatedRoute
     ) { 
  }
  stageSetup() {
    let width = window.innerWidth * 0.9;
    let height = window.innerHeight;
    this.stage = new Konva.Stage({
      container: 'rpg',
      width: 1920,
      height: 1080,
      draggable: true
    });
    this.mapLayer = new Konva.Layer();
    this.mapLayer.getCanvas()._canvas.id = 'Background';
    this.stage.add(this.mapLayer);

    this.fogLayer = new Konva.Layer();
    this.fogLayer.getCanvas()._canvas.id = 'Fog';
    this.stage.add(this.fogLayer);

    this.tokenLayer = new Konva.Layer();
    this.tokenLayer.getCanvas()._canvas.id = 'Tokens';
    this.stage.add(this.tokenLayer);

    this.videoLayer = new Konva.Layer();
    this.videoLayer.getCanvas()._canvas.id = 'Video';
    this.stage.add(this.videoLayer);
    this.globalVideo['dom'] = document.createElement('video');
    this.globalVideo['dom'].setAttribute("id", "VideoElement");

  }
  generateAllTokens(){
    for (let i of this.campaignData.tokenState) { //let of provides actual value instead of just the index
      this.token.updateToken(this.globalTokens, this.tokenLayer, i, false, this.socket, null, null)  
    }
  }
  generateAllFog(){
    for (let i of this.campaignData.fogState) { //let of provides actual value instead of just the index
      this.fog.updateFog(this.globalFog, this.fogLayer, i, false, this.socket, this.globalFogTransformers)  
    }
  }
  changeMap(){
    //rebuild from "getCurrentScreen"
    this.mapLayer.destroyChildren();
    this.fogLayer.destroyChildren();

    this.tokenLayer.destroyChildren();
    this.globalTokens = {};
    this.globalFog = {};

    this.videoLayer.destroyChildren();
    if(this.globalVideo['dom'] != undefined){
      this.globalVideo['dom'].pause()
    }
    
      if(this.campaignData.map.playervideo != null){
        this.video.setBackground(this.globalVideo, this.campaignData.map, this.mapLayer, false);
      }else{
      this.background.setBackground(this.globalBackground, this.campaignData.map, this.mapLayer, false);
      }
    // this.background.setBackground(this.globalBackground, this.campaignData.map, this.mapLayer, false);
    //FogLayer FOW
    var backgroundColor = new Konva.Rect({
      x: 0,
      y: 0,
      fill: 'black',
      width: 1920,
      height: 1080,
  });
    this.fogLayer.add(backgroundColor);
    this.fogLayer.batchDraw();
    this.tokenLayer.batchDraw();
    // this.mainStage.textNode(this.stage, this.tokenLayer, this.socket); //just for debugging

    this.generateAllTokens();
    this.generateAllFog();
  }
  getCurrentData() {
    this.socket.on('RefreshScreen', (msg) => {
      this.campaignData = JSON.parse(msg);
      this.changeMap();
   })
    this.socket.emit('getCurrentScreen', this.route.snapshot.params.campaignID)
  }
  setupSockets(){
    this.socket = io('localhost:3000');
    this.socket.on('changeMap', (msg) => { 
      this.getCurrentData();      
    })
    this.socket.on('updateToken', (msg) => { 
      this.token.updateToken(this.globalTokens, this.tokenLayer, JSON.parse(msg), false, this.socket, null, null)  
    })
    this.socket.on('updateFog', (msg) => {
      this.fog.updateFog(this.globalFog, this.fogLayer, JSON.parse(msg), false, this.socket, this.globalFogTransformers)  
    })
    this.socket.on('removeFog', (msg) =>{
      this.globalFog[msg].destroy();
      this.globalFogTransformers[msg].destroy();
      this.fogLayer.batchDraw();
    })
  }
  ngOnInit() {
    
    this.stageSetup();
    this.mainStage.stageSetup(this.stage)
    this.setupSockets();
    this.getCurrentData();
    
  }

}
