import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  fontSizeIncrease= 3;
  
  increaseArabicFont(): any {
    this.arabicFont = this.arabicFont + this.fontSizeIncrease;
    this.setArabicFont(this.arabicFont +"px");
  }
  decreaseArabicFont(): any {
    if (this.arabicFont == 10)
      return;
    this.arabicFont = this.arabicFont - this.fontSizeIncrease;
    this.setArabicFont(this.arabicFont +"px");
  }

  increaseTamilFont(): any {
    this.tamilFont = this.tamilFont + this.fontSizeIncrease;
    this.setTamilFont(this.tamilFont +"px");
  }
  decreaseTamilFont(): any {
    if (this.tamilFont == 8)
      return;
    this.tamilFont = this.tamilFont - this.fontSizeIncrease;
    this.setTamilFont(this.tamilFont +"px");
  }

  arabicFont = 30;
  tamilFont = 17;

  private settingsData = {ArabicFontSize: "30px" , TamilFontSize : '17px'};
  private settingsSubject = new BehaviorSubject(this.settingsData);
  observableSettings = this.settingsSubject.asObservable();

  constructor(private nativeStore: NativeStorage) {
   
    this.nativeStore.getItem('settingData').then(
      (data) => {
        if (data) {
          this.settingsData = data;
        }
      },
      (err) => {
        this.nativeStore.setItem('settingData', this.settingsData);
      });
   
    this.settingsSubject.next(this.settingsData);
   }

  setArabicFont(arabicFont){
    this.settingsData.ArabicFontSize = arabicFont;
    this.settingsSubject.next(this.settingsData);
    this.nativeStore.setItem('settingData', this.settingsData);

  }

  setTamilFont(tamilFont){
    this.settingsData.TamilFontSize = tamilFont;
    this.settingsSubject.next(this.settingsData);
    this.nativeStore.setItem('settingData', this.settingsData);
  }  
}
