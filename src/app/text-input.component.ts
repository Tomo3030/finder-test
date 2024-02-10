import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { fabric } from 'fabric';
import { CanvasService } from './canvas.service';
import { birds } from './bird-map';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule],
  template: ` <canvas #myCanvas></canvas> `,
  styles: [],
})
export class TextInputComponent implements AfterViewInit {
  constructor(private canvasService: CanvasService) {}
  canvas: fabric.Canvas;
  groups = [];
  container: ElementRef;

  @ViewChild('myCanvas') myCanvas!: ElementRef;

  ngAfterViewInit(): void {
    console.log(this.myCanvas);
    this.rezizeCanvas();
    this.canvas = new fabric.Canvas(this.myCanvas.nativeElement, {});

    console.log(this.canvas);
    this.canvas.on('object:modified', function (e) {
      let canvasH = e.target.canvas.height;
      let canvasW = e.target.canvas.width;
      let top = e.target.top;
      let left = e.target.left;
      let topPercent = (top / canvasH) * 100;
      let leftPercent = (left / canvasW) * 100;
      console.log(`topPercent: ${topPercent}, leftPercent: ${leftPercent}%`);
    });

    this.canvas.on('mouse:dblclick', (e) => {
      let t = new fabric.Textbox('Hello World', {});
      t.set({
        left: e.pointer.x,
        top: e.pointer.y,
      });
      this.canvas.add(t);
    });

    this.canvasService.loadSvgs(this.canvas, birds);
  }

  rezizeCanvas() {
    // console.log(this.myCanvas.nativeElement.height);

    // this.myCanvas.nativeElement.width = window.innerWidth;
    // this.myCanvas.nativeElement.height = window.innerWidth * 1.5;
    const aspectRatio = 1 / 1.5;
    const windowRatio = window.innerWidth / window.innerHeight;
    let canvasWidth, canvasHeight;

    if (windowRatio > aspectRatio) {
      // Window is wider than needed for the aspect ratio
      canvasHeight = window.innerHeight;
      canvasWidth = canvasHeight * aspectRatio;
    } else {
      // Window is taller
      canvasWidth = window.innerWidth;
      canvasHeight = canvasWidth / aspectRatio;
    }

    console.log(canvasWidth, canvasHeight);

    this.myCanvas.nativeElement.width = canvasWidth;
    this.myCanvas.nativeElement.height = canvasHeight;
  }
}
