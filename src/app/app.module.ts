import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavController } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {SocialSharing} from '@awesome-cordova-plugins/social-sharing/ngx';
import {NativeStorage} from '@awesome-cordova-plugins/native-storage/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [ AppRoutingModule, BrowserModule, IonicModule.forRoot(),  HttpClientModule],
  providers: [SocialSharing, NativeStorage, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
