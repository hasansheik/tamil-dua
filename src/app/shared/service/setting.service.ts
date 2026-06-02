/* eslint-disable eqeqeq */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  fontSizeIncrease = 3;
  arabicFontSize = 28;
  tamilFontSize = 15;
  arabicfont = 'arabic';
  
  private settingsData = {
    ArabicFontSize: '28px',
    TamilFontSize: '15px',
    ArabicFont: 'arabic',
    ShowTamilDua: true,
    ShowTranslation: true,
    ShowHadees: true,
    ThemeAccent: 'gold'
  };

  private settingsSubject = new BehaviorSubject(this.settingsData);
  observableSettings = this.settingsSubject.asObservable();

  private readonly FAVORITES_KEY = 'favorites';

  constructor() {
    this.initializeSettings();
  }

  private async initializeSettings() {
    // Initialize visibility settings first time
    const showTamilDua = await Preferences.get({ key: 'ShowTamilDua' });
    const showTranslation = await Preferences.get({ key: 'ShowTranslation' });
    const showHadees = await Preferences.get({ key: 'ShowHadees' });
    const themeAccent = await Preferences.get({ key: 'ThemeAccent' });

    if (showTamilDua.value === null) {
      await Preferences.set({ key: 'ShowTamilDua', value: 'true' });
    }
    if (showTranslation.value === null) {
      await Preferences.set({ key: 'ShowTranslation', value: 'true' });
    }
    if (showHadees.value === null) {
      await Preferences.set({ key: 'ShowHadees', value: 'true' });
    }
    if (themeAccent.value === null) {
      await Preferences.set({ key: 'ThemeAccent', value: 'gold' });
    }

    await this.readSettingsData();
  }

  async readSettingsData() {
    try {
      const [arabicFontSize, tamilFontSize, arabicFont, showTamilDua, showTranslation, showHadees, themeAccent] = 
        await Promise.all([
          Preferences.get({ key: 'ArabicFontSize' }),
          Preferences.get({ key: 'TamilFontSize' }),
          Preferences.get({ key: 'ArabicFont' }),
          Preferences.get({ key: 'ShowTamilDua' }),
          Preferences.get({ key: 'ShowTranslation' }),
          Preferences.get({ key: 'ShowHadees' }),
          Preferences.get({ key: 'ThemeAccent' })
        ]);

      // Migrate old defaults or initialize if null
      let rawArabic = arabicFontSize.value;
      let rawTamil = tamilFontSize.value;

      if (rawArabic === null || rawArabic === '32') {
        rawArabic = '28';
        await Preferences.set({ key: 'ArabicFontSize', value: '28' });
      }
      if (rawTamil === null || rawTamil === '17') {
        rawTamil = '15';
        await Preferences.set({ key: 'TamilFontSize', value: '15' });
      }

      this.arabicFontSize = Number(rawArabic);
      this.settingsData.ArabicFontSize = this.arabicFontSize + 'px';

      this.tamilFontSize = Number(rawTamil);
      this.settingsData.TamilFontSize = this.tamilFontSize + 'px';

      if (arabicFont.value) {
        this.arabicfont = arabicFont.value;
        this.settingsData.ArabicFont = this.arabicfont;
      }

      // Update visibility settings with default to true if not set
      this.settingsData.ShowTamilDua = showTamilDua.value !== 'false';
      this.settingsData.ShowTranslation = showTranslation.value !== 'false';
      this.settingsData.ShowHadees = showHadees.value !== 'false';

      if (themeAccent.value) {
        this.settingsData.ThemeAccent = themeAccent.value;
        this.applyThemeAccent(themeAccent.value);
      } else {
        this.settingsData.ThemeAccent = 'gold';
        this.applyThemeAccent('gold');
      }

      // Notify subscribers of the updated settings
      this.settingsSubject.next({...this.settingsData});
    } catch (error) {
      console.error('Error reading settings:', error);
    }
  }

  increaseArabicFont(): any {
    if(this.arabicFontSize <= 15) {
      this.arabicFontSize = 15;
    }
    this.arabicFontSize = this.arabicFontSize + this.fontSizeIncrease;
    this.setArabicFontSize(this.arabicFontSize );
  }
  decreaseArabicFont(): any {
    if (this.arabicFontSize <= 15 ) {
      this.arabicFontSize = 15;
      return;
    }
    this.arabicFontSize = this.arabicFontSize - this.fontSizeIncrease;
    this.setArabicFontSize(this.arabicFontSize );
  }

  increaseTamilFont(): any {
    this.tamilFontSize = this.tamilFontSize + this.fontSizeIncrease;
    this.setTamilFontSize(this.tamilFontSize );
  }
  decreaseTamilFont(): any {
    // eslint-disable-next-line eqeqeq
    if (this.tamilFontSize == 8)
      {return;}
    this.tamilFontSize = this.tamilFontSize - this.fontSizeIncrease;
    this.setTamilFontSize(this.tamilFontSize );
  }

   getSettingData(): any {
     return this.settingsData;
   }

   refreshSettingData(){
    this.settingsSubject.next(Object.assign({}, this.settingsData));
   }

    async resetToDefaults() {
      try {
        await Promise.all([
          Preferences.set({ key: 'ArabicFontSize', value: '28' }),
          Preferences.set({ key: 'TamilFontSize', value: '15' }),
          Preferences.set({ key: 'ThemeAccent', value: 'gold' })
        ]);
        await this.readSettingsData();
      } catch (e) {
        console.error('Error resetting settings to defaults:', e);
      }
    }

  setArabicFontSize(arabicFontSize){
    this.settingsData.ArabicFontSize = arabicFontSize + 'px';
    this.arabicFontSize = arabicFontSize; 
    Preferences.set({
      key: 'ArabicFontSize',
      value: arabicFontSize.toString(),
    }).then(data=>{
      this.readSettingsData();
    });
  }

  setTamilFontSize(tamilFont){
    this.settingsData.TamilFontSize = tamilFont+ 'px';
    this.tamilFontSize = tamilFont;
    Preferences.set({
      key: 'TamilFontSize',
      value: this.tamilFontSize.toString(),
    }).then(data=>{
      this.readSettingsData();
    });
  }

  setArabicFont(font) {
    this.arabicfont = font;
    this.settingsData.ArabicFont = font;
    Preferences.set({
      key: 'ArabicFont',
      value: this.arabicfont.toString(),
    }).then(data=>{
      this.readSettingsData();
    });
  }

  async setShowTamilDua(show: boolean) {
    this.settingsData.ShowTamilDua = show;
    await Preferences.set({
      key: 'ShowTamilDua',
      value: show.toString()
    });
    this.settingsSubject.next({...this.settingsData});
  }

  async setShowTranslation(show: boolean) {
    this.settingsData.ShowTranslation = show;
    await Preferences.set({
      key: 'ShowTranslation',
      value: show.toString()
    });
    this.settingsSubject.next({...this.settingsData});
  }

  async setShowHadees(show: boolean) {
    this.settingsData.ShowHadees = show;
    await Preferences.set({
      key: 'ShowHadees',
      value: show.toString()
    });
    this.settingsSubject.next({...this.settingsData});
  }

  applyThemeAccent(accent: string) {
    const themes = ['theme-gold', 'theme-emerald', 'theme-crimson', 'theme-sapphire', 'theme-rosegold', 'theme-amethyst'];
    themes.forEach(t => document.body.classList.remove(t));
    document.body.classList.add(`theme-${accent}`);
  }

  async setThemeAccent(accent: string) {
    this.settingsData.ThemeAccent = accent;
    await Preferences.set({
      key: 'ThemeAccent',
      value: accent
    });
    this.applyThemeAccent(accent);
    this.settingsSubject.next({...this.settingsData});
  }



   updateSettings() {
   // this.nativeStore.setItem('settingData', this.settingsData);
  }

  async getFavorites(): Promise<string[]> {
    const result = await Preferences.get({ key: this.FAVORITES_KEY });
    return result.value ? JSON.parse(result.value) : [];
  }

  async setFavorites(favorites: string[]): Promise<void> {
    await Preferences.set({
      key: this.FAVORITES_KEY,
      value: JSON.stringify(favorites)
    });
  }
}
