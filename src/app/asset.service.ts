import { Injectable } from '@angular/core';
import { BirdMap } from 'src/asset-maps/birdmap';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  public ASSET_SCALE;
  constructor() {}

  loadAssets(canvas, assetsName) {
    let allAssets = this.getAllAssets(assetsName);
    let staticAssets = allAssets.splice(0, 2);
    let textBoxes = canvas.getObjects().filter((obj) => obj.type === 'textBox');
    let dropZones = canvas
      .getObjects()
      .filter((obj) => obj.type === 'dropZone');
    this.setAssetScale(dropZones[0], BirdMap.scale);
    this.placeAssetsInDz(canvas, dropZones, staticAssets);
    this.placeText(canvas, textBoxes, staticAssets);
    // console.log(canvas.getObjects());

    let movableAssets = allAssets.splice(5, 5);
    this.placeMovables(canvas, movableAssets);
  }

  private getAllAssets(assetsName) {
    let arr = [];
    let basePath = BirdMap['base-path'];
    Object.keys(BirdMap.assets).forEach((key) => {
      let id = key;
      let assetName = BirdMap.assets[key].assetName;
      let name = BirdMap.assets[key].description;
      let path = `${basePath}${assetName}`;
      arr.push({ path: path, id: id, name: name });
    });
    return arr;
  }

  private placeMovables(canvas, movableAssets) {
    const assetContainer = canvas
      .getObjects()
      .find((obj) => obj.type === 'assetContainer');

    const containerGrid = this.getAssetGrid(
      assetContainer,
      movableAssets.length
    );
    for (let i = 0; i < movableAssets.length; i++) {
      fabric.loadSVGFromURL(movableAssets[i].path, (objects, options) => {
        let group = fabric.util.groupSVGElements(objects, options);

        group.scale(this.ASSET_SCALE);
        group.set({
          left: containerGrid[i].left,
          top: containerGrid[i].top,
          selectable: true,
          hasControls: false,
        });
        group['type'] = 'moveable';
        group['id'] = movableAssets[i].id;
        group['associatedDz'] = null;
        canvas.add(group);
      });
    }
  }

  private placeAssetsInDz(canvas, dropZones, assets) {
    for (let i = 0; i < assets.length; i++) {
      fabric.loadSVGFromURL(assets[i].path, (objects, options) => {
        let group = fabric.util.groupSVGElements(objects, options);

        group.scale(this.ASSET_SCALE);
        let left =
          dropZones[i].left +
          dropZones[i].width / 2 -
          (group.width * this.ASSET_SCALE) / 2;
        let top =
          dropZones[i].top +
          dropZones[i].height / 2 -
          (group.height * this.ASSET_SCALE) / 2;
        group.set({
          left: left,
          top: top,
          selectable: false,
        });
        dropZones[i].set({ stroke: 'transparent' });
        dropZones[i].empty = false;
        group['associatedDz'] = dropZones[i].id;
        canvas.add(group);
      });
    }
  }

  private placeText(canvas, textBoxes, assets) {
    for (let i = 0; i < assets.length; i++) {
      textBoxes[i].text = assets[i].name;
      textBoxes[i].set({ selectable: false, editable: false });
      canvas.renderAll();
    }
  }

  private setAssetScale(dz, scale: { height: number; width: number }) {
    let dzMin = Math.min(dz.height, dz.width);
    let assetMin = Math.min(scale.height, scale.width);
    this.ASSET_SCALE = dzMin / assetMin;
  }

  private getAssetGrid(assetContainer, assetLength) {
    if (assetLength > 10) throw new Error('Too many assets');

    const gridPositions: { left: number; top: number }[] = [];
    const rows = assetLength <= 5 ? 1 : 2;
    const itemsPerRow = Math.ceil(assetLength / rows);
    const itemWidth = assetContainer.width / itemsPerRow;
    const itemHeight = assetContainer.height / rows;

    for (let row = 0; row < rows; row++) {
      let top = assetContainer.top + itemHeight * row;
      // Adjust top for single row case to center vertically
      if (rows === 1) top += (assetContainer.height - itemHeight) / 2;

      for (let col = 0; col < itemsPerRow; col++) {
        // Only add positions for actual assets
        if (row * itemsPerRow + col >= assetLength) break;

        let left = itemWidth * col;
        gridPositions.push({ left, top });
      }
    }

    return gridPositions;
  }
}
