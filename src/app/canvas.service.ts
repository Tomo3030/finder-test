import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  scale;

  constructor() {}

  public async loadSvgs(canvas: any, images: any) {
    const promises = images.map((image) => this.loadSVGFromURLPromise(image));
    const results = await Promise.all(promises);
    console.log(results);
    results.forEach(({ group, image, options }) => {
      if (image?.id === 'bg') {
        this.setScale(group, canvas);
      }

      let opts = this.getOptions(image, canvas);
      group.scale(this.scale);
      group.set({
        ...opts,
      });
      canvas.add(group);
      if (image?.id === 'text-box') {
        this.addTextBox(group, canvas);
      }
    });
    // images.forEach((image: any) => {
    //   fabric.loadSVGFromURL(image.path, (objects, options) => {
    //     let group = fabric.util.groupSVGElements(objects, options);
    //     if (image?.id === 'bg') {
    //       this.setScale(group, canvas);
    //     }

    //     let opts = this.getOptions(image, canvas);
    //     console.log(opts);

    //     group.scale(this.scale);
    //     group.set({
    //       ...opts,
    //     });
    //     canvas.add(group);
    //   });
    // });
  }

  private addTextBox(group, canvas) {
    console.log(group);
    let text = new fabric.Textbox('$423.88', {
      left: group.left,
      top: group.top,
      width: group.width * this.scale,
      fontSize: 20,
      fill: 'black',
    });

    canvas.add(text);
  }

  private setScale(bgSVG, canvas) {
    let scale = canvas.width / bgSVG.width;

    this.scale = scale;
  }

  private getOptions(imageMap, canvas) {
    let top = (imageMap.percentTop / 100) * canvas.height;
    let left = (imageMap.percentLeft / 100) * canvas.width;
    return {
      ...imageMap.options,
      top: top,
      left: left,
    };
  }

  private loadSVGFromURLPromise(image) {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromURL(image.path, (objects, options) => {
        let group = fabric.util.groupSVGElements(objects, options);
        resolve({ group, image, options }); // Resolve with relevant data
      });
    });
  }

  private addSelectableShadow() {}

  private setCoords() {}
}
