/* eslint-disable eqeqeq */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  fontSizeIncrease= 3;
  arabicFontSize = 30;
  tamilFontSize = 16;
  arabicfont ='arabic';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private settingsData = {ArabicFontSize: '30px' , TamilFontSize : '16px', ArabicFont :'arabic'};

  private settingsSubject = new BehaviorSubject(this.settingsData);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  observableSettings = this.settingsSubject.asObservable();


  constructor() {

    // this.nativeStore.getItem('settingData').then(
    //   (data) => {
    //     if (data) {
    //       if (this.settingsData.ArabicFont != undefined ||
    //         this.settingsData.ArabicFontSize != undefined ||
    //         this.settingsData.TamilFontSize != undefined) {
    //         this.settingsData = data;
    //         this.settingsSubject.next(this.settingsData);
    //         this.arabicFontSize = Number(this.settingsData.ArabicFontSize.substring(0, this.settingsData.ArabicFontSize.length - 3));
    //         this.tamilFontSize = Number(this.settingsData.TamilFontSize.substring(0, this.settingsData.TamilFontSize.length - 3));
    //       }
    //       else {
    //         this.updateSettings();
    //       }
    //     }
    //   },
    //   (err) => {
    //    this.updateSettings();

    //   }).catch((err) => {
    //     this.updateSettings();

    //   });
      this.settingsSubject.next(this.settingsData);
   }
   readSettingsData(){

    Preferences.get({ key: 'ArabicFontSize' }).then(data=>{
      console.log('call back invoked for read ');

      if (Number(data) ){
        console.log('reading data call back in place ');
        this.arabicFontSize = Number(data);
      this.settingsData.ArabicFontSize=this.arabicFontSize+'px';
      }
      Preferences.get({ key: 'TamilFontSize' }).then(data1=>{
        if (Number(data) ){
          this.tamilFontSize = Number(data1);
        this.settingsData.TamilFontSize=this.tamilFontSize+'px';
        }
        Preferences.get({ key: 'ArabicFont' }).then(data2=>{
          this.arabicfont = data2.value+'';
          this.settingsData.ArabicFont=this.arabicfont;
          this.settingsSubject.next(this.settingsData);
        });
      });
    });
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

   updateSettings() {
   // this.nativeStore.setItem('settingData', this.settingsData);
  }
}
