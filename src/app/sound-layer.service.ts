import { Injectable } from '@angular/core';
import Konva from 'konva';
import {Howl, Howler} from 'howler'; //Howler is global stuff, Howl is individual sounds.
@Injectable({
  providedIn: 'root'
})
export class SoundLayerService {

  constructor() { }
  updateSound(globalSound: object, layer: Konva.Layer, data: {
    id: string,
    active: string,
    angle: string,
    height: string,
    width: string,
    scalex: string,
    scaley: string,
    x: string,
    y: string,
    mapstate: string,
    sound: string,
    icon: string,

  },
  dm: boolean, socket: any, globalSoundTransformer: any, globalHowls: any, sounds: any, globalSoundPositions: any){
    if(!globalSound[data.id]){
    var rand = new Konva.Rect({
      x: parseFloat(data.x),
      y: parseFloat(data.y),
      width: parseFloat(data.width),
      height: parseFloat(data.height),
      id: data.id,
      scaleX: parseFloat(data.scalex),
      scaleY: parseFloat(data.scaley),
      rotation: parseFloat(data.angle),
      stroke: 'black',
      strokeWidth: 2,
      mapstate: data.mapstate,
      sound: data.id,
      draggable: dm
  });
  
  globalSound[data.id] = rand;
  globalSoundPositions[data.id] = {
    x: parseFloat(data.x),
    y:parseFloat(data.y),
    xto: parseFloat(data.x) + parseFloat(data.width) * parseFloat(data.scalex),
    yto: parseFloat(data.y) + parseFloat(data.height) * parseFloat(data.scaley),
    id: data.id
  }
  layer.add(rand); 
  let imageObj = new Image();
  imageObj.onload = function() {
    rand.fillPatternImage(imageObj);
    rand.fillPriority('pattern');
    layer.draw()
  };
  imageObj.src = sounds[data.sound].icon; 
if(dm){
  rand.on('contextmenu', function(data){
    data.evt.preventDefault();
  })
  rand.on('mouseup transformend',function(data){
    data.evt.preventDefault();
    if(data.evt.button === 2){ //right click
      socket.emit('sendRemoveSound', { 
        id: this.attrs.id
      })
    }else{
    socket.emit('postUpdateSound',{  
      "id":this.attrs.id,
      "angle":this.attrs.rotation,
      "height":this.attrs.height,
      "width":this.attrs.width,
      "scalex":this.attrs.scaleX,
      "scaley":this.attrs.scaleY,
      "x":(this.attrs.x),
      "y":(this.attrs.y),
      "mapstate":this.attrs.mapstate})
    }
  });
  globalSoundTransformer[data.id] = new Konva.Transformer({keepRatio: false});
  layer.add(globalSoundTransformer[data.id]);
  globalSoundTransformer[data.id].attachTo(rand);


  //Howl setup
  globalHowls[data.id] = new Howl({
    src: [sounds[data.sound].url],
    volume: sounds[data.sound].default_vol,
    loop: sounds[data.sound].loop
  });
   

  }

  layer.batchDraw(); //was batch draw
  }
  else{
      globalSound[data.id].x(parseFloat(data.x));
      globalSound[data.id].y(parseFloat(data.y));
      globalSound[data.id].width(parseFloat(data.width));
      globalSound[data.id].height(parseFloat(data.height));
      globalSound[data.id].scaleX(parseFloat(data.scalex));
      globalSound[data.id].scaleY(parseFloat(data.scaley));
      globalSound[data.id].rotation(parseFloat(data.angle));
      globalSoundPositions[data.id].x = parseFloat(data.x),
      globalSoundPositions[data.id].y = parseFloat(data.y),
      globalSoundPositions[data.id].xto = parseFloat(data.x) + parseFloat(data.width) * parseFloat(data.scalex),
      globalSoundPositions[data.id].yto = parseFloat(data.y) + parseFloat(data.height) * parseFloat(data.scaley),
      layer.draw();
  }
}
}
