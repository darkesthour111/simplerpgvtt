import {  Component,  OnInit,  HostListener, Inject} from '@angular/core';
import {  ActivatedRoute} from '@angular/router';

import Konva from 'konva'
import io from 'socket.io-client'
import {  MainStageService} from '../main-stage.service'
import {  BackgroundLayerService} from '../background-layer.service'
import {  TokenLayerService} from '../token-layer.service';
import {  FogLayerService} from '../fog-layer.service';
import {  VideoLayerService} from '../video-layer.service';
import { SoundLayerService } from '../sound-layer.service';


@Component({
  selector: 'app-dm-view',
  templateUrl: './dm-view.component.html',
  styleUrls: ['./dm-view.component.scss']
})
export class DmViewComponent implements OnInit {
  stage: Konva.Stage;
  mapLayer: Konva.Layer;
  fogLayer: Konva.Layer;
  soundLayer: Konva.Layer;
  tokenLayer: Konva.Layer;
  videoLayer: Konva.Layer;
  socket: io;
  tokens: {};
  sounds = {};
  soundsArray: [];
  //Global tracking of KonvaObjects so we can update as needed.
  globalBackground = {
    'backgroundImage': ''
  }; //TOOD might not be needed.
  globalTokens = {};
  globalFog = {};
  globalSound = {};
  globalHowls = {};
  globalVideo = {};
  globalFogTransformers = {};
  globalSoundTransformers = {};
  globalSoundPositions = {};
  soundLayerHidden = 0;
  campaignData: any;
  
  //html models
  selectedTokens
  selectedSounds
  tokenNameIncrement
  tokenIncrement
  tokenSize
  constructor(
    private mainStage: MainStageService,
    private background: BackgroundLayerService,
    private token: TokenLayerService,
    private fog: FogLayerService,
    private sound: SoundLayerService,
    private video: VideoLayerService,
    private route: ActivatedRoute,
  ) {}
  getTokenList() { 
    this.socket.on('receiveTokenList', (msg) => {
      this.tokens = msg; 
    })
    this.socket.emit('getTokenList');
  }
  getSoundList(){
    this.socket.on('receiveSoundList', (msg) => {
      this.soundsArray = msg;
      for(let i in msg){
        this.sounds[msg[i].id] = msg[i]
      }
    })
    this.socket.emit('getSoundList');
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

    this.soundLayer = new Konva.Layer();
    this.soundLayer.getCanvas()._canvas.id = 'Sound';
    this.stage.add(this.soundLayer);

    this.tokenLayer = new Konva.Layer();
    this.tokenLayer.getCanvas()._canvas.id = 'Tokens';
    this.stage.add(this.tokenLayer);

    this.videoLayer = new Konva.Layer();
    this.videoLayer.getCanvas()._canvas.id = 'Video';
    this.stage.add(this.videoLayer);
    this.globalVideo['dom'] = document.createElement('video');
    this.globalVideo['dom'].setAttribute("id", "VideoElement");


    this.stage.draw();

  }
  generateAllTokens() {
    for (let i of this.campaignData.tokenState) { //let of provides actual value instead of just the index
      this.token.updateToken(this.globalTokens, this.tokenLayer, i, true, this.socket, this.globalSoundPositions, this.globalHowls)
    }
  }
  generateAllFog() {
    for (let i of this.campaignData.fogState) { //let of provides actual value instead of just the index
      this.fog.updateFog(this.globalFog, this.fogLayer, i, true, this.socket, this.globalFogTransformers)
    }
  }
  generateAllSound(){
    for (let i of this.campaignData.soundState) { //let of provides actual value instead of just the index
      this.sound.updateSound(this.globalSound, this.soundLayer, i, true, this.socket, this.globalSoundTransformers, this.globalHowls, this.sounds, this.globalSoundPositions)
    }
  }
  changeMap() {
    //rebuild from "getCurrentScreen"
    this.videoLayer.destroyChildren();
    if(this.globalVideo['dom'] != undefined){
    this.globalVideo['dom'].pause()
    }
    this.mapLayer.destroyChildren();
    this.fogLayer.destroyChildren();
    this.soundLayer.destroyChildren();
    this.tokenLayer.destroyChildren();
    this.globalTokens = {};

    this.globalFog = {};
    this.globalFogTransformers = {};
    this.globalSound = {};
    this.globalSoundPositions = {};
    this.globalSoundTransformers = {};

    this.videoLayer.destroyChildren();
    if(this.campaignData.map.playervideo != null || this.campaignData.dmvideo != null){
      this.video.setBackground(this.globalVideo, this.campaignData.map, this.mapLayer, true);
    }else{
    this.background.setBackground(this.globalBackground, this.campaignData.map, this.mapLayer, true);
    }
    //FogLayer FOW
    var backgroundColor = new Konva.Rect({
      x: 0,
      y: 0,
      fill: 'red',
      width: 1920,
      height: 1080,
      opacity: 0.5
    });
    this.fogLayer.add(backgroundColor);
    this.fogLayer.batchDraw();
    this.soundLayer.batchDraw();
    this.tokenLayer.batchDraw();
    

    this.generateAllTokens();
    this.generateAllFog();
    this.generateAllSound();
  }
  getCurrentData() {
    this.socket.emit('getCurrentScreen', this.route.snapshot.params.campaignID)
  }
  setupSockets() {
    this.socket = io('localhost:3000');
    this.socket.on('changeMap', (msg) => { 
      this.getCurrentData();
    })
    this.socket.on('RefreshScreen', (msg) => {
      this.campaignData = JSON.parse(msg);
      this.changeMap();
    })
    this.socket.on('updateToken', (msg) => { 
      this.token.updateToken(this.globalTokens, this.tokenLayer, JSON.parse(msg), true, this.socket, this.globalSoundPositions, this.globalHowls)
    })
    this.socket.on('updateSound', (msg) => { 
      this.sound.updateSound(this.globalSound, this.soundLayer, msg, true, this.socket, this.globalSoundTransformers, this.globalHowls, this.sounds, this.globalSoundPositions)
    })
    this.socket.on('updateFog', (msg) => { 
      this.fog.updateFog(this.globalFog, this.fogLayer, JSON.parse(msg), true, this.socket, this.globalFogTransformers)
    })
    this.socket.on('removeFog', (msg) =>{
      this.globalFog[msg].destroy();
      this.globalFogTransformers[msg].destroy();
      this.fogLayer.batchDraw();
    })
    this.socket.on('removeSound', (msg) =>{
      this.globalSound[msg].destroy();
      this.globalSoundTransformers[msg].destroy();
      this.soundLayer.batchDraw();
      delete this.globalSoundPositions[msg]
    })
  }

  ngOnInit() {
    
    this.setupSockets();
    this.getTokenList();
    this.getSoundList();
    this.stageSetup();
    this.mainStage.stageSetup(this.stage)
    
    this.getCurrentData();

  }

}
