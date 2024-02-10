import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { config } from 'src/scene-config/museum';
@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  constructor() {}
  BG_SCALE;
  DZ_HEIGHT;

  async loadBackground(canvas, sceneName) {
    await this.loadBackgroundImage(canvas, sceneName);
    await this.loadDropZones(canvas);
    await this.loadTextBoxes(canvas);
    this.loadAssetContainer(canvas);
  }

  private loadBackgroundImage(canvas, name) {
    let path = `assets/scenes/${name}.svg`;

    return new Promise((resolve, reject) => {
      fabric.loadSVGFromURL(path, (objects, options) => {
        let group = fabric.util.groupSVGElements(objects, options);
        let scale = canvas.width / group.width;
        this.BG_SCALE = scale;
        group.scale(this.BG_SCALE);
        group.set({
          left: 0,
          top: 0,
          selectable: false,
        });
        canvas.add(group);

        resolve(() => {
          return group;
        });
      });
    });
  }

  private loadDropZones(canvas) {
    return new Promise((resolve, reject) => {
      if (!this.DZ_HEIGHT) {
        this.DZ_HEIGHT = config.dropZones[0].height * this.BG_SCALE;
        console.log(this.BG_SCALE);
      }
      for (let dropZone of config.dropZones) {
        let rect = new fabric.Rect({
          left: dropZone.left * this.BG_SCALE,
          top: dropZone.top * this.BG_SCALE,
          width: dropZone.width * this.BG_SCALE,
          height: dropZone.height * this.BG_SCALE,
          fill: 'transparent',
          stroke: 'RGBA(0,0,0,0.3)',
          rx: 10,
          ry: 10,
          strokeWidth: 3,
          strokeDashArray: [10, 10],
          selectable: false,
        });
        rect['id'] = dropZone.id;
        rect['type'] = 'dropZone';
        rect['empty'] = true;

        canvas.add(rect);
      }
      resolve(() => {
        return;
      });
    });
  }

  private loadTextBoxes(canvas) {
    return new Promise((resolve, reject) => {
      let fontSize = this.BG_SCALE * 30;

      for (let textBox of config.textBoxes) {
        let text = new fabric.Textbox('???', {
          left: textBox.left * this.BG_SCALE,
          top: textBox.top * this.BG_SCALE,
          width: textBox.width * this.BG_SCALE,
          height: textBox.height * this.BG_SCALE,
          fill: 'black',
          fontSize: fontSize,
          fontFamily: 'Arial',
          textAlign: 'center',
          editable: true,
          selectable: true,
          hasControls: false,
          editingBorderColor: '#03A9F4',
          borderScaleFactor: 2,
          borderColor: '#03A9F4',
          lockMovementX: true,
          lockMovementY: true,
          padding: 10,
        });
        text['id'] = textBox.id;
        text['type'] = 'textBox';
        text.on('mousedown', function (e) {
          let fill = text.editable ? '#03A9F4' : 'red';
          let rect = new fabric.Rect({
            left: text.left! + text.width! / 2,
            top: text.top! - 3,
            width: text.width! + 6,
            height: text.height! + 6,
            scaleX: 0.01,
            opacity: 0.5,
            originX: 'center',
            fill: fill,
            selectable: false,
          });

          canvas.add(rect);

          rect.animate('scaleX', 1, {
            duration: 100,
            onChange: canvas.renderAll.bind(canvas),
          });

          rect.animate('opacity', 0, {
            duration: 300,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: () => canvas.remove(rect),
          });

          rect.animate;

          if (text.selectable) {
            text.enterEditing();
            text.selectAll();
            text.isEditing = true;
          }
        });
        canvas.add(text);
      }
      resolve(() => {
        return;
      });
    });
  }

  private loadAssetContainer(canvas) {
    return new Promise((resolve, reject) => {
      let container = config.assetContainer;
      let rect = new fabric.Rect({
        left: container.left * this.BG_SCALE,
        top: container.top * this.BG_SCALE,
        width: container.width * this.BG_SCALE,
        height: container.height * this.BG_SCALE,
        fill: 'transparent',
        selectable: false,
      });
      rect['id'] = 'assetContainer';
      rect['type'] = 'assetContainer';
      canvas.add(rect);
      resolve(() => {
        return;
      });
    });
  }
}
