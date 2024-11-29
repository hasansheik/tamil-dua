/* eslint-disable eqeqeq */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingService } from '../shared/service/setting.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  arabicFontSize: number = 30;
  tamilFontSize: number = 16;
  selectedArabicFont: string = 'arabic';
  private settingsSubscription: Subscription;

  constructor(private settingService: SettingService) {}

  ngOnInit() {
    // Subscribe to settings changes
    this.settingsSubscription = this.settingService.observableSettings.subscribe(settings => {
      if (settings) {
        this.arabicFontSize = parseInt(settings.ArabicFontSize);
        this.tamilFontSize = parseInt(settings.TamilFontSize);
        this.selectedArabicFont = settings.ArabicFont;
      }
    });
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  onArabicFontSizeChange(event: any) {
    const newSize = event.detail.value;
    this.settingService.setArabicFontSize(newSize);
  }

  onTamilFontSizeChange(event: any) {
    const newSize = event.detail.value;
    this.settingService.setTamilFontSize(newSize);
  }

  onArabicFontChange(event: any) {
    const newFont = event.detail.value;
    this.settingService.setArabicFont(newFont);
  }
}
