import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas.component';
import { SvgDisplayComponent } from './svg-display.component';
import { TextInputComponent } from './text-input.component';
import { SceneComponent } from './scene.component';

@NgModule({
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    CanvasComponent,
    SvgDisplayComponent,
    TextInputComponent,
    SceneComponent,
  ],
})
export class AppModule {}
