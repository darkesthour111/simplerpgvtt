import { Injectable } from '@angular/core';
import Konva from 'konva'
@Injectable({
  providedIn: 'root'
})
export class VideoLayerService {

  constructor() { }

  setBackground(globalVideo: any, map: any, layer: Konva.Layer, dm: Boolean){
    if(dm && map.dmvideo != null){
    globalVideo.dom.src = map.dmvideo;
    }
    else{
      globalVideo.dom.src = map.playervideo;
    }
    if(!dm){
      globalVideo.dom.volume = 0;
    }
    globalVideo.dom.loop = true;

      var image = new Konva.Image({
        image: globalVideo.dom,
        draggable: true,
        width: 1920,
        height: 1080,
        x: 0,
        y: 0
      });
      layer.add(image);
      var anim = new Konva.Animation(function() {
        // do nothing, animation just need to update the layer
      }, layer);
      globalVideo.dom.play();
        anim.start();
  }
}
