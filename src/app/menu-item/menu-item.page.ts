import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DuaService } from '../service/dua.service';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.page.html',
  styleUrls: ['./menu-item.page.scss'],
})
export class MenuItemPage implements OnInit {
  public appPages: any[] = [];

  constructor(private platform: Platform, private duaService: DuaService) { }

  ngOnInit() {
    this.initializeApp();
  }

  initializeApp() {
    this.appPages = [];

    this.platform.ready().then(() => {
      this.duaService.getDuaPageList();
    });

    this.duaService.observablePageList.subscribe((data) => {
      this.appPages = data;
    });
  }
}
