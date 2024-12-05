/* eslint-disable eqeqeq */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  fontSizeIncrease = 3;
  arabicFontSize = 32;
  tamilFontSize = 17;
  arabicfont = 'arabic';
  
  private settingsData = {
    ArabicFontSize: '32px',
    TamilFontSize: '17px',
    ArabicFont: 'arabic',
    ShowTamilDua: true,
    ShowTranslation: true,
    ShowHadees: true
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

    if (showTamilDua.value === null) {
      await Preferences.set({ key: 'ShowTamilDua', value: 'true' });
    }
    if (showTranslation.value === null) {
      await Preferences.set({ key: 'ShowTranslation', value: 'true' });
    }
    if (showHadees.value === null) {
      await Preferences.set({ key: 'ShowHadees', value: 'true' });
    }

    await this.readSettingsData();
  }

  async readSettingsData() {
    try {
      const [arabicFontSize, tamilFontSize, arabicFont, showTamilDua, showTranslation, showHadees] = 
        await Promise.all([
          Preferences.get({ key: 'ArabicFontSize' }),
          Preferences.get({ key: 'TamilFontSize' }),
          Preferences.get({ key: 'ArabicFont' }),
          Preferences.get({ key: 'ShowTamilDua' }),
          Preferences.get({ key: 'ShowTranslation' }),
          Preferences.get({ key: 'ShowHadees' })
        ]);

      // Update font settings
      if (arabicFontSize.value) {
        this.arabicFontSize = Number(arabicFontSize.value);
        this.settingsData.ArabicFontSize = this.arabicFontSize + 'px';
      }
      if (tamilFontSize.value) {
        this.tamilFontSize = Number(tamilFontSize.value);
        this.settingsData.TamilFontSize = this.tamilFontSize + 'px';
      }
      if (arabicFont.value) {
        this.arabicfont = arabicFont.value;
        this.settingsData.ArabicFont = this.arabicfont;
      }

      // Update visibility settings with default to true if not set
      this.settingsData.ShowTamilDua = showTamilDua.value !== 'false';
      this.settingsData.ShowTranslation = showTranslation.value !== 'false';
      this.settingsData.ShowHadees = showHadees.value !== 'false';

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

  setArabicFontSize(arabicFontSize){
    this.settingsData.ArabicFontSize = arabicFontSize + 'px';
    Preferences.set({
      key: 'ArabicFontSize',
      value: this.arabicFontSize.toString(),
    }).then(data=>{
      this.readSettingsData();
    });
  }

  setTamilFontSize(tamilFont){
    this.settingsData.TamilFontSize = tamilFont+ 'px';
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
