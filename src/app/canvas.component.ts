import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { fabric } from 'fabric';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas
      height="700px"
      width="700px"
      background-color="#eee"
      #myCanvas
    ></canvas>
  `,
  styles: [
    `
      .canvas {
        border: 1px solid black;
        height: 600px;
        width: 100%;
      }
    `,
  ],
})
export class CanvasComponent implements AfterViewInit {
  constructor() {
    console.log('CanvasComponent constructor');
  }
  c: any;

  shadow = new fabric.Shadow({
    color: 'rgba(0,0,0,0.3)',
    blur: 10,
  });

  objArray: any[] = [
    {
      id: 'a',
      radius: 30,
      hasControls: false,
      top: 100,
      left: 100,
      shadow: this.shadow,
    },
    {
      id: 'b',
      radius: 30,
      hasControls: false,
      top: 100,
      left: 100,
    },
    {
      id: 'c',
      radius: 30,
      hasControls: false,
      top: 100,
      left: 100,
    },
  ];

  circle = new fabric.Circle({
    radius: 30,
    fill: '#f55',
    top: 100,
    left: 100,
    hasControls: false,
    padding: 10,
  });

  square = new fabric.Rect({
    left: 400,
    top: 400,
    strokeWidth: 10,
    stroke: 'green',
    fill: 'transparent',
    width: 90,
    height: 90,
    selectable: false,
  });

  square2 = new fabric.Rect({
    left: 200,
    top: 200,
    strokeWidth: 10,
    stroke: 'green',
    fill: 'transparent',
    width: 90,
    height: 90,
    selectable: false,
  });

  @ViewChild('myCanvas') canvas!: ElementRef;
  ngAfterViewInit(): void {
    this.circle['id'] = 'circle';

    this.c = new fabric.Canvas(this.canvas.nativeElement);
    this.c.on('object:moving', (e: any) => {
      let obj = e.target;
      obj.setCoords();
      // if (obj.intersectsWithObject(this.square)) {
      //   console.log('intersect');
      // }
      this.c.forEachObject((o: any) => {
        if (!o.dropZone) return;
        if (o === obj) return;
        if (obj.intersectsWithObject(o)) {
          obj['intersected'] = true;
          o.set({ fill: 'orange' });

          console.log('intersect' + o);
        } else {
          o.set({ fill: 'transparent' });
          obj['intersected'] = false;
        }
      });
    });

    this.c.on('object:modified', (e: any) => {
      console.log(e.target.id);
      if (e.target.intersected) {
        console.log('this inside');
      } else {
        console.log('this outside');
      }
    });

    this.c.selectionBorderColor = 'blue';
    this.c.seclectionLineWidth = 10;
    this.c.add(this.square);
    this.c.add(this.square2);
    this.square['dropZone'] = true;
    this.square2['dropZone'] = true;
    this.objArray.forEach((obj) => {
      this.c.add(new fabric.Circle(obj));
    });
  }
}
