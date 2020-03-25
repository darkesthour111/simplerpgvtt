import { Injectable } from '@angular/core';
import Konva from 'konva';

@Injectable({
  providedIn: 'root'
})
export class BackgroundLayerService {

  constructor() { }
  
  setBackground(globalBackground: object, map: any, layer: Konva.Layer, dm: Boolean){

      let url = ''
       if (dm && map.dmmap != null){
         url = map.dmmap
       }
       else{
         url = map.playermap
       }
       Konva.Image.fromURL(url, function(oImg) {
          
           var minScale = Math.min((1920 / oImg.attrs.image.width), (1080 / oImg.attrs.image.height));
        
       oImg.setAttrs({
         x: 1920/2,
         y: 1080/2,
         offsetX: oImg.attrs.image.width/2,
         offsetY: oImg.attrs.image.height/2,
         scaleX: minScale,
         scaleY: minScale,
       

       });
       layer.add(oImg);
             
       layer.batchDraw();
       return oImg;
     });
     
  }
}
