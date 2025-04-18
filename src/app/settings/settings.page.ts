/* eslint-disable eqeqeq */
import { Component, OnInit } from '@angular/core';
import { SettingService } from '../shared/service/setting.service';
import { RangeCustomEvent } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  // Font settings
  arabicFontSize: number = 32;
  tamilFontSize: number = 17;
  selectedArabicFont: string = 'arabic';
  arabicFont: string = 'defaultFont';

  // Visibility settings
  showTamilDua: boolean = true;
  showTranslation: boolean = true;
  showHadees: boolean = true;

  constructor(private settingService: SettingService, private duaService: DuaService) { }

  ngOnInit() {
    // Subscribe to settings changes
    this.settingService.observableSettings.subscribe(settings => {
      if (settings) {
        // Update font settings
        this.arabicFontSize = parseInt(settings.ArabicFontSize, 10);
        this.tamilFontSize = parseInt(settings.TamilFontSize, 10);
        this.selectedArabicFont = settings.ArabicFont;

        // Update visibility settings
        this.showTamilDua = settings.ShowTamilDua;
        this.showTranslation = settings.ShowTranslation;
        this.showHadees = settings.ShowHadees;
        this.duaService.clear_cache();
      }
    });
  }

  // Font size handlers
  increaseArabicFontSize() {
    this.arabicFontSize += 2;
    this.settingService.setArabicFontSize(this.arabicFontSize);
  }

  decreaseArabicFontSize() {
    if (this.arabicFontSize > 16) {
      this.arabicFontSize -= 2;
      this.settingService.setArabicFontSize(this.arabicFontSize);
    }
  }

  increaseTamilFontSize() {
    this.tamilFontSize += 2;
    this.settingService.setTamilFontSize(this.tamilFontSize);
  }

  decreaseTamilFontSize() {
    if (this.tamilFontSize > 12) {
      this.tamilFontSize -= 2;
      this.settingService.setTamilFontSize(this.tamilFontSize);
    }
  }

  // Font size change handlers
  onArabicFontSizeChange(event: any) {
    var fontSize = (event as RangeCustomEvent).detail.value;
    console.log('ionChange emitted value:', fontSize);
    this.settingService.setArabicFontSize(fontSize);
  }

  onTamilFontSizeChange(event: any) {
    var fontSize = (event as RangeCustomEvent).detail.value;
    console.log('ionChange emitted value:', fontSize);
    this.settingService.setTamilFontSize(fontSize);
  }

  // Font style handler
  onArabicFontChange(event?: any) {
    this.settingService.setArabicFont(this.selectedArabicFont);
    console.log('Arabic font changed', event);
  }

  // Visibility toggle handlers
  async onShowTamilDuaChange() {
    await this.settingService.setShowTamilDua(this.showTamilDua);
  }

  async onShowTranslationChange() {
    await this.settingService.setShowTranslation(this.showTranslation);
  }

  async onShowHadeesChange() {
    await this.settingService.setShowHadees(this.showHadees);
  }
}
