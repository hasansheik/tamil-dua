import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  subscription: any;
  constructor(private platform: Platform, private duaService: DuaService) {

  }
}
