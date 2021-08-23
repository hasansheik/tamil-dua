import { Component, OnInit } from '@angular/core';
import { DuaService } from '../shared/service/dua.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.page.html',
  styleUrls: ['./menu-item.page.scss'],
})
export class MenuItemPage implements OnInit {
  public appPages = [
      
  ];
  constructor( private platform: Platform, private duaService: DuaService) {
    this.InitializeApp();
  } 

  InitializeApp(){
    this.appPages = [];
    this.platform.ready().then(() => {
      this.duaService.getDuaPageList();
    });

    this.duaService.observablePageList.subscribe(
      (data) => {this.appPages = data; }
    );
  }
  selectedpage= 0;
  
  ngOnInit() {
  }

}
