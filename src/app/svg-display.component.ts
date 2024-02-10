import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fabric } from 'fabric';
import { food } from './food-map';
@Component({
  selector: 'app-svg-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas
      height="700px"
      width="700px"
      style="border: 1px solid black; "
      #myCanvas
    ></canvas>
  `,
  styles: [],
})
export class SvgDisplayComponent implements AfterViewInit {
  canvas: fabric.Canvas;
  groups = [];
  @ViewChild('myCanvas') myCanvas!: ElementRef;

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas(this.myCanvas.nativeElement, {
      defaultCursor: 'pointer',
    });
    this.canvas.on('object:modified', function (e) {
      e.target.bringToFront();
      console.log(`top: ${e.target.top}, left: ${e.target.left}`);
    });
    let total = 20;
    food.map((item: any) => {
      fabric.loadSVGFromURL(item.path, (objects, options) => {
        let group = fabric.util.groupSVGElements(objects, options);
        group.scale(0.2);
        group.set({
          ...item.options,
        });

        this.canvas.add(group);

        if (group.selectable) {
          group.set({
            left: total,
            top: 500,
          });

          group.setCoords();
          let bounding = group.getBoundingRect();
          let s = new fabric.Ellipse({
            left: bounding.left,
            top: bounding.top + bounding.height - 35,
            rx: bounding.width / 2,
            ry: 20,
            fill: '#f5f75c',
            selectable: false,
          });
          this.canvas.add(s);
          this.canvas.sendToBack(s);
          let g = new fabric.Group([s, group], {});
          this.canvas.add(g);
        }
      });
    });
    this.canvas.renderAll();
  }
}

// group.setCoords();
// let bounding = group.getBoundingRect();
// let border = new fabric.Rect({
//   left: bounding.left, // Adjust as needed for border visibility
//   top: bounding.top,
//   width: bounding.width,
//   height: bounding.height,
//   rx: 20,
//   ry: 20,
//   fill: 'transparent',
//   stroke: 'rgba(166, 69, 119, 0.20)',
//   strokeWidth: 1,
//   selectable: false,
// });
// this.canvas.add(border);
// this.canvas.sendToBack(border);
// let g = new fabric.Group([border, group], {});
// this.canvas.add(g);
// }
