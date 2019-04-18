import { Component, OnInit } from '@angular/core';
import { SettingService } from '../shared/service/setting.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  arabicFontSize ="12ef";
  tamilFontSize ="12ef";
  constructor(private settingService: SettingService) {
    
    this.settingService.observableSettings.subscribe(
      (data) =>
          {
            if(data) {
              this.arabicFontSize = data.ArabicFontSize;
              this.tamilFontSize = data.TamilFontSize;
              console.log("increased  notification received arabic font set is" + this.arabicFontSize);
              console.log("increased  notification received tamil font set is" + this.tamilFontSize);
            }
          }
    );

   }

   increaseArabicSize(){
     this.settingService.increaseArabicFont();
   }

   decreaseArabicSize(){
    this.settingService.decreaseArabicFont();
  }

  increaseTamilSize(){
    this.settingService.increaseTamilFont();
  }

  decreaseTamilSize(){
    this.settingService.decreaseTamilFont();
  }


  ngOnInit() {
  }

}
