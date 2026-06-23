import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DuaService } from './shared/service/dua.service';
import { SettingService } from './shared/service/setting.service';
import { StorageService } from './shared/service/storage.service';
import { NetworkService } from './shared/service/network.service';
import { customPageTransition } from './shared/animations/page-transition';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        IonicModule.forRoot({
            mode: 'ios',
            animated: true,
            navAnimation: customPageTransition
        }),
        AppRoutingModule], providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        DuaService,
        SettingService,
        StorageService,
        NetworkService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
