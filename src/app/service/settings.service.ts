import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private DARK_MODE_KEY = 'darkMode';
  private TAMIL_FONT_SIZE_KEY = 'tamilFontSize';
  private ARABIC_FONT_SIZE_KEY = 'arabicFontSize';
  private SELECTED_ARABIC_FONT_KEY = 'arabic';

  // Default values
  private DARK_MODE_DEFAULT = false;
  private TAMIL_FONT_SIZE_DEFAULT = 16;
  private ARABIC_FONT_SIZE_DEFAULT = 16;

  // Settings structure
  public Settings = {
    darkMode: this.DARK_MODE_DEFAULT,
    tamilFontSize: this.TAMIL_FONT_SIZE_DEFAULT,
    arabicFontSize: this.ARABIC_FONT_SIZE_DEFAULT,
    selectedArabicFont: this.SELECTED_ARABIC_FONT_KEY
  };
  observableSettings = new BehaviorSubject<any>(this.Settings);

  constructor() {
    this.loadSettings();
    this.applyTheme();
  }

  private async loadSettings(): Promise<void> {
    this.Settings.darkMode = await this.getDarkMode();
    this.Settings.tamilFontSize = await this.getTamilFontSize();
    this.Settings.arabicFontSize = await this.getArabicFontSize();
  }

  async setDarkMode(value: boolean): Promise<void> {
    this.Settings.darkMode = value;
    await Preferences.set({ key: this.DARK_MODE_KEY, value: value.toString() });
    this.applyTheme();
  }

  async getDarkMode(): Promise<boolean> {
    const result = await Preferences.get({ key: this.DARK_MODE_KEY });
    return result.value === 'true';
  }

  async setTamilFontSize(size: number): Promise<void> {
    this.Settings.tamilFontSize = size;
    await Preferences.set({ key: this.TAMIL_FONT_SIZE_KEY, value: size.toString() });
  }

  async getTamilFontSize(): Promise<number> {
    const result = await Preferences.get({ key: this.TAMIL_FONT_SIZE_KEY });
    return parseInt(result.value || this.TAMIL_FONT_SIZE_DEFAULT.toString(), 10);
  }

  async setArabicFontSize(size: number): Promise<void> {
    this.Settings.arabicFontSize = size;
    await Preferences.set({ key: this.ARABIC_FONT_SIZE_KEY, value: size.toString() });
  }

  async getArabicFontSize(): Promise<number> {
    const result = await Preferences.get({ key: this.ARABIC_FONT_SIZE_KEY });
    return parseInt(result.value || this.ARABIC_FONT_SIZE_DEFAULT.toString(), 10);
  }

  async resetSettings(): Promise<void> {
    await this.setDarkMode(this.DARK_MODE_DEFAULT);
    await this.setTamilFontSize(this.TAMIL_FONT_SIZE_DEFAULT);
    await this.setArabicFontSize(this.ARABIC_FONT_SIZE_DEFAULT);
  }

  private applyTheme(): void {
    document.body.classList.toggle('dark', this.Settings.darkMode);
  }

  async getSettings(): Promise<any> {
    return this.Settings;
  }
}
