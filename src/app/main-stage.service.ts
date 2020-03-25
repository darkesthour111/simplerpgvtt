import { Injectable } from '@angular/core';
import Konva from 'konva'
@Injectable({
  providedIn: 'root'
})
export class MainStageService {
  
  constructor() { }
  stageSetup(stage: Konva.Stage) {
    stage.on("wheel", (e) =>  {  //zoom in/out setup
      let scaleBy = 1.05
      e.evt.preventDefault();
      var oldScale = stage.scaleX();
      var mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
      };
      var newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({
        x: newScale,
        y: newScale
      });
      var newPos = {
        x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
        y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
      };
      stage.position(newPos);
      stage.batchDraw();
    });  
  
  
}
}