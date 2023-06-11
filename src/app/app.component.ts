import { Component, OnInit } from '@angular/core';
import { SettingsService } from './service/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public duaList: any[] = [];
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Dua List', url: '/menu-item', icon: 'list' },
    { title: 'Bookmarks', url: '/bookmarks', icon: 'bookmarks' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
  ];
  constructor(private settingService: SettingsService) { }

  ngOnInit(): void {
    this.loadApp();
  }

  loadApp() {
    this.settingService.getDarkMode().then((data) => {
      this.checkToggle(data);
    });
  }

  checkToggle(shouldCheck: boolean) {
    this.settingService.setDarkMode(shouldCheck);
  }
}
