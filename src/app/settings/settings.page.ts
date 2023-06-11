import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../service/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  darkMode: boolean = false;
  tamilFontSize: number = 16;
  arabicFontSize: number = 16;

  constructor(private settingService: SettingsService) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  ionViewWillEnter() {
    this.loadSettings();
  }

  async loadSettings() {
    this.darkMode = await this.settingService.getDarkMode();
    this.tamilFontSize = await this.settingService.getTamilFontSize();
    this.arabicFontSize = await this.settingService.getArabicFontSize();
  }

  async toggleDarkMode() {
    await this.settingService.setDarkMode(this.darkMode);
  }

  async changeTamilFontSize() {
    await this.settingService.setTamilFontSize(this.tamilFontSize);
  }

  async changeArabicFontSize() {
    await this.settingService.setArabicFontSize(this.arabicFontSize);
  }

  async resetSettings() {
    await this.settingService.resetSettings();
    this.loadSettings();
  }
}
