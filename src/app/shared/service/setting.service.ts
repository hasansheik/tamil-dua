import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  fontSizeIncrease= 3;
  
  increaseArabicFont(): any {
    if(this.arabicFontSize <= 15) {
      this.arabicFontSize = 15;
    }
    this.arabicFontSize = this.arabicFontSize + this.fontSizeIncrease;
    this.setArabicFontSize(this.arabicFontSize +"px");
  }
  decreaseArabicFont(): any {
    if (this.arabicFontSize <= 15 ) {
      this.arabicFontSize = 15;
      return;
    }      
    this.arabicFontSize = this.arabicFontSize - this.fontSizeIncrease;
    this.setArabicFontSize(this.arabicFontSize +"px");
  }

  increaseTamilFont(): any {
    this.tamilFontSize = this.tamilFontSize + this.fontSizeIncrease;
    this.setTamilFontSize(this.tamilFontSize +"px");
  }
  decreaseTamilFont(): any {
    if (this.tamilFontSize == 8)
      return;
    this.tamilFontSize = this.tamilFontSize - this.fontSizeIncrease;
    this.setTamilFontSize(this.tamilFontSize +"px");
  }

  arabicFontSize = 30;
  tamilFontSize = 16;

  private settingsData = {ArabicFontSize: "30px" , TamilFontSize : '16px', ArabicFont :"arabic"};
  private settingsSubject = new BehaviorSubject(this.settingsData);
  observableSettings = this.settingsSubject.asObservable();

  constructor(private nativeStore: NativeStorage) {
   
    this.nativeStore.getItem('settingData').then(
      (data) => {
        if (data) {         
          if (this.settingsData.ArabicFont != undefined ||
            this.settingsData.ArabicFontSize != undefined ||
            this.settingsData.TamilFontSize != undefined) {
            this.settingsData = data;
            this.settingsSubject.next(this.settingsData);
            this.arabicFontSize = Number(this.settingsData.ArabicFontSize.substring(0, this.settingsData.ArabicFontSize.length - 3));
            this.tamilFontSize = Number(this.settingsData.TamilFontSize.substring(0, this.settingsData.TamilFontSize.length - 3));
          }
          else {
            this.updateSettings();
          }
        }
      },
      (err) => {
       this.updateSettings();
        
      }).catch((err) => {
        this.updateSettings();
       
      })  
      this.settingsSubject.next(this.settingsData);
   }
   getSettingData() : any {
     return this.settingsData;
   }

  setArabicFontSize(arabicFontSize){
    this.settingsData.ArabicFontSize = arabicFontSize;
    this.updateSettings();
  }
  
  setTamilFontSize(tamilFont){
    this.settingsData.TamilFontSize = tamilFont;
    this.updateSettings();
  }

  setInitialValues(tFs, aFs) {
    this.settingsData.ArabicFont = aFs;
    this.settingsData.TamilFontSize = tFs;
    this.updateSettings();
  }

  setArabicFont(font) {
    this.settingsData.ArabicFont = font;
    this.updateSettings();
  }
  updateSettings() {
    if (this.settingsData == undefined) {
      this.settingsData = {ArabicFontSize: "30px" , TamilFontSize : '16px', ArabicFont :"arabic"};
    }
    console.log(this.settingsData);    
    this.settingsSubject.next(this.settingsData);
    this.nativeStore.setItem('settingData', this.settingsData);
  }
}
