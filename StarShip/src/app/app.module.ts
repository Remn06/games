import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './ui/app-root/app.component';
import { GameObjectComponent } from './ui/html-renderer/game-object/game-object.component';

@NgModule({
  declarations: [
    AppComponent,
    GameObjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
