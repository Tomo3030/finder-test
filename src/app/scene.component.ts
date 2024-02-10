import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fabric } from 'fabric';
import { BackgroundService } from './background.service';
import { AssetService } from './asset.service';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #myCanvas></canvas>
    <button *ngIf="completed" class="button">Submit</button>
  `,
  styles: [
    `
      .button {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    `,
  ],
})
export class SceneComponent implements AfterViewInit {
  @ViewChild('myCanvas') myCanvas!: ElementRef;
  canvas: fabric.Canvas;
  dropZones;
  activeDz = null;
  completed = false;

  constructor(
    private background: BackgroundService,
    private assets: AssetService
  ) {}

  async ngAfterViewInit() {
    this.rezizeCanvas();
    this.canvas = new fabric.Canvas(this.myCanvas.nativeElement, {});

    // fabric.loadSVGFromURL(
    //   'assets/scenes/supermarket.svg',
    //   (objects, options) => {
    //     let group = fabric.util.groupSVGElements(objects, options);
    //     let scale = this.canvas.width / group.width;
    //     //this.BG_SCALE = scale;
    //     group.scale(scale);
    //     group.set({
    //       left: 0,
    //       top: 0,
    //       selectable: false,
    //     });
    //     this.canvas.add(group);
    //   }
    // );

    await this.background.loadBackground(this.canvas, 'museum');
    this.assets.loadAssets(this.canvas, 'birdmap');
    this.setCanvasListeners();
  }

  private setCanvasListeners() {
    this.dropZones = this.canvas
      .getObjects()
      .filter((obj) => obj.type === 'dropZone');

    this.canvas.on('object:moving', (e) => {
      this.handleIntersectedDz(e);
    });
    this.canvas.on('mouse:down', (e) => {
      let target = e.target as any;
      if (target.selectable && target.type === 'moveable') {
        this.animateAssetScale(e, 1);
      }
      if (
        target.selectable &&
        target.type === 'moveable' &&
        target.associatedDz
      ) {
        this.checkIfLeavingDz(target);
      }
    });

    this.canvas.on('object:modified', (e) => {});

    this.canvas.on('mouse:up', (e) => {
      if (e.target.selectable && e.target.type === 'moveable') {
        this.animateAssetScale(e, 0);
        let intersect = this.getIntersectedDz(e);
        if (!intersect) return;
        this.handleDzDrop(intersect, e);
      }
      this.checkIfAllDone();
    });
  }

  private checkIfAllDone() {
    let allDz = this.dropZones.filter((dz) => dz.empty === false);
    if (allDz.length !== this.dropZones.length) return;
    let AllTexts = this.canvas
      .getObjects()
      .filter((obj) => obj.type === 'textBox') as any;
    let textboxesModified = AllTexts.filter((text) => text.text !== '???');
    if (textboxesModified.length !== AllTexts.length) return;
    this.completed = true;
  }

  private checkIfLeavingDz(target) {
    let dz = this.dropZones.find((dz) => dz.id === target.associatedDz);
    this.activeDz = dz;
    dz.empty = true;
    dz.set('stroke', 'RGBA(0,0,0,0.3)');
    target.associatedDz = null;
  }

  private handleIntersectedDz(e) {
    let intersect = this.getIntersectedDz(e);

    if (intersect && intersect.empty) {
      if (this.activeDz && this.activeDz !== intersect) {
        this.activeDz.set('fill', 'transparent');
      }
      intersect.set('fill', 'rgba(0,0,0,0.1)');
      this.activeDz = intersect;
    } else if (this.activeDz?.id) {
      this.activeDz.set('fill', 'transparent');
      this.activeDz = null;
    }
  }

  private getIntersectedDz(e) {
    e.target.setCoords();
    let intersected = null;
    this.dropZones.forEach((dz) => {
      if (e.target.intersectsWithObject(dz)) {
        return (intersected = dz);
      }
    });
    return intersected;
  }

  private handleDzDrop(intersect, e) {
    let asset = e.target as any;
    if (intersect && !intersect.empty) {
      // DZ is occupied
      e.target.set({
        left: intersect.left * intersect.scaleX,
        top: intersect.top + intersect.height * intersect.scaleY,
      });
    }
    if (intersect && intersect.empty) {
      // DZ is empty
      this.activeDz.set('fill', 'transparent');
      this.activeDz = null;

      let left =
        intersect.left +
        (intersect.width * intersect.scaleX - asset.width * asset.scaleX);
      e.target.set({
        left: left,
        top: intersect.top,
      });

      asset.associatedDz = intersect.id;
      intersect.empty = false;
      intersect.set('stroke', 'RGBA(0,0,0,0.1)');
    }
  }

  private animateAssetScale(e, dir) {
    if (e.target) {
      fabric.util.animate({
        startValue: e.target.scaleX,
        endValue: dir
          ? this.assets.ASSET_SCALE * 1.15
          : this.assets.ASSET_SCALE,
        duration: 100,
        onChange: (value) => {
          e.target.scale(value);
          this.canvas.renderAll();
        },
        onComplete: function () {
          e.target.setCoords();
        },
      });
    }
  }

  private rezizeCanvas() {
    const aspectRatio = 9 / 16;
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

    this.myCanvas.nativeElement.width = canvasWidth;
    this.myCanvas.nativeElement.height = canvasHeight;
  }
}
