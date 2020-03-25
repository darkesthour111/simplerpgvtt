import { Injectable } from '@angular/core';
import Konva from 'konva';
@Injectable({
  providedIn: 'root'
})
export class FogLayerService {

  constructor() { }
  updateFog(globalFog: object, layer: Konva.Layer, data: {
    id: string,
    locked: string,
    hidden: string,
    angle: string,
    height: string,
    width: string,
    scalex: string,
    scaley: string,
    x: string,
    y: string,
    mapstate: string
  },
  dm: boolean, socket: any, globalFogTransformer: any){
    if(!globalFog[data.id]){
    var rand = new Konva.Rect({
      x: parseFloat(data.x),
      y: parseFloat(data.y),
      fill: 'white',
      width: parseFloat(data.width),
      height: parseFloat(data.height),
      id: data.id,
      scaleX: parseFloat(data.scalex),
      scaleY: parseFloat(data.scaley),
      rotation: parseFloat(data.angle),
      mapstate: data.mapstate,
      globalCompositeOperation: 'destination-out',
      draggable: dm
  });
  globalFog[data.id] = rand;
  layer.add(rand);  
if(dm){
  rand.on('contextmenu', function(data){
    data.evt.preventDefault();
  })
  rand.on('mouseup transformend',function(data){
    data.evt.preventDefault();
    if(data.evt.button === 2){ //right click
      socket.emit('sendRemoveFog', {
        id: this.attrs.id
      })
    }else{
    socket.emit('postUpdateFog',JSON.stringify({
      "id":this.attrs.id,
      "height":this.attrs.height,
      "width":this.attrs.width,
      "scalex":this.attrs.scaleX,
      "scaley":this.attrs.scaleY,
      "x":(this.attrs.x),
      "y":(this.attrs.y),
      "mapstate":this.attrs.mapstate}))
    }
  });

  globalFogTransformer[data.id] = new Konva.Transformer({keepRatio: false});
  layer.add(globalFogTransformer[data.id]);
  globalFogTransformer[data.id].attachTo(rand);
  }
  layer.batchDraw();
  }
  else{
    globalFog[data.id].x(parseFloat(data.x));
      globalFog[data.id].y(parseFloat(data.y));
      globalFog[data.id].width(parseFloat(data.width));
      globalFog[data.id].height(parseFloat(data.height));
      globalFog[data.id].scaleX(parseFloat(data.scalex));
      globalFog[data.id].scaleY(parseFloat(data.scaley));
      globalFog[data.id].rotation(parseFloat(data.angle));
      layer.draw();
  }
}
}
