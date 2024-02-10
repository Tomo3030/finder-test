import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  _DATA = {
    scene: 'museum',
    assets: 'birdmap',
    players: ['Tim', 'Tom'],
    created: new Date(),
  };

  getGameData() {}
}
