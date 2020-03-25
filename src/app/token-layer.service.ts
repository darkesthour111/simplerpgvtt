import { Injectable } from "@angular/core";
import Konva from "konva";
import io from "socket.io-client";
import { SoundLayerService } from './sound-layer.service';
@Injectable({
  providedIn: "root"
})
export class TokenLayerService {
  constructor(
    private sound: SoundLayerService
  ) {
  }
  generateToken(globalTokens: object, layer: Konva.Layer, data: object) {
    //why have two when updateToken can check and create?
  }
  updateToken(
    globalTokens: object,
    layer: Konva.Layer,
    data: {
      id: string;
      token: string;
      tokenurl: string;
      player: string;
      locked: string;
      hidden: string;
      angle: string;
      height: string;
      width: string;
      scalex: string;
      scaley: string;
      x: string;
      y: string;
      mapstate: string;
    },
    dm: boolean,
    socket: any,
    globalSoundPositions: any,
    globalHowls: any
  ) {
    if (!data) {
      return;
    }

    if (!globalTokens[data.id]) {
      var setSelectable = false;
      if (dm === true && parseFloat(data.hidden) === 0) {
        data.hidden = "0.5";
      }
      Konva.Image.fromURL(data.tokenurl, function(oImg) {
        oImg.setAttrs({
          x: parseFloat(data.x),
          y: parseFloat(data.y),
          width: parseFloat(data.width),
          height: parseFloat(data.height),
          id: data.id,
          token: data.token,
          tokenurl: data.tokenurl,
          scaleX: parseFloat(data.scalex),
          scaleY: parseFloat(data.scaley),
          rotation: parseFloat(data.angle),
          opacity: parseFloat(data.hidden),
          imageid: data.token,
          draggable: dm
        });
        globalTokens[data.id] = oImg;
        if (setSelectable == true) {
          oImg.borderStroke = "#6A5ACD"; //Actual unselected border color
          oImg.borderStrokeWidth = 15; //it's width.
          oImg.borderDash = [10, 5]; //The morse code of it.
        }
        if (dm) {
          oImg.on("contextmenu", function(evt) {
            evt.evt.preventDefault(); //stops default context menu on these.
          });
          oImg.on("mouseup transformend", function(data) {
            data.evt.preventDefault();
            if (data.evt.button === 2) {
              let hiddenTo = 1;
              if (this.attrs.opacity === 1) {
                hiddenTo = 0;
              }
              socket.emit("postUpdateToken", JSON.stringify({
                  id: this.attrs.id,
                  token: this.attrs.token,
                  tokenurl: this.attrs.tokenurl,
                  hidden: hiddenTo,
                  angle: this.attrs.rotation,
                  height: this.attrs.height,
                  width: this.attrs.width,
                  scalex: this.attrs.scaleX,
                  scaley: this.attrs.scaleY,
                  x: this.attrs.x,
                  y: this.attrs.y,
                  mapstate: this.attrs.mapstate
                })
              );
            }
            //if not right clicked.
            socket.emit(
              "postUpdateToken",
              JSON.stringify({
                id: this.attrs.id,
                token: this.attrs.token,
                tokenurl: this.attrs.tokenurl,
                angle: this.attrs.rotation,
                height: this.attrs.height,
                width: this.attrs.width,
                scalex: this.attrs.scaleX,
                scaley: this.attrs.scaleY,
                x: this.attrs.x,
                y: this.attrs.y,
                mapstate: this.attrs.mapstate
              })
            );

          //check to see if center of object is inside of sound rect, if so, call play on the sound
          var centerX = this.attrs.x + ((this.attrs.width * this.attrs.scaleX)/2)
          var centerY = this.attrs.y + ((this.attrs.height * this.attrs.scaleY)/2)
          for(let i in globalSoundPositions){
            if((globalSoundPositions[i].x < centerX && centerX < globalSoundPositions[i].xto) && (globalSoundPositions[i].y < centerY && centerY < globalSoundPositions[i].yto)){
              if(!globalHowls[globalSoundPositions[i].id].playing()){ 
                globalHowls[globalSoundPositions[i].id].play();
              }
              
            }
            else{
              let currentVolume = globalHowls[globalSoundPositions[i].id]._volume
              if(globalHowls[globalSoundPositions[i].id].playing()){ 
                globalHowls[globalSoundPositions[i].id].on('fade', function (id) {
                  this.stop();
                  globalHowls[globalSoundPositions[i].id]._volume = currentVolume
              })
              globalHowls[globalSoundPositions[i].id].fade(globalHowls[globalSoundPositions[i].id]._volume, 0, 1000);
              }
              
            }
          }
          });
          var tr = new Konva.Transformer();
          layer.add(tr);
          tr.attachTo(oImg);
        }
        layer.add(oImg);

        layer.draw();
      });
    } else {
      globalTokens[data.id].x(parseFloat(data.x));
      globalTokens[data.id].y(parseFloat(data.y));
      globalTokens[data.id].width(parseFloat(data.width));
      globalTokens[data.id].height(parseFloat(data.height));
      globalTokens[data.id].scaleX(parseFloat(data.scalex));
      globalTokens[data.id].scaleY(parseFloat(data.scaley));
      globalTokens[data.id].rotation(parseFloat(data.angle));
      if (dm === true && parseFloat(data.hidden) === 0) {
        globalTokens[data.id].opacity(0.5);
      } else {
        globalTokens[data.id].opacity(parseFloat(data.hidden));
      }
      layer.draw();
    }
  }
}
