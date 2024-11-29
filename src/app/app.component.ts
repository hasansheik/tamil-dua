import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { DuaService } from './shared/service/dua.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: any[] = [];
  public labels = [];
  selectedPage = 0;

  constructor(
    private platform: Platform,
    private duaService: DuaService,
    private navController: NavController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    
    // Load initial dua pages
    await this.duaService.getDuaPageList();

    // Subscribe to page list changes
    this.duaService.observablePageList.subscribe(
      (pages) => {
        this.appPages = pages;
      }
    );

    this.addBackButtonHandler();
  }

  addBackButtonHandler() {
    App.addListener('backButton', ({canGoBack}) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        if (window.location.href.match("(settings+)")) {
          this.navController.navigateBack('/folder/2224867c-90f3-4311-9f35-5e0a7f4467d1');
        } else {
          window.history.back();
        }
      }
    });
  }
}
