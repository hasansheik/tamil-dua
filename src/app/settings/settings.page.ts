/* eslint-disable eqeqeq */
import { Component, OnInit } from '@angular/core';
import { SettingService } from '../shared/service/setting.service';
import { Platform, NavController } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  arabicFontSize ='';
  tamilFontSize ='';
  arabicFont = '';

  arabColor = 'black';
  arab2Color = 'black';
  arab3Color = 'black';
  arColor = 'black';
  arabicColor = 'black';
  bgSelectedcolor ='rgb(210,240,210)';

  subscription: any;

  duaId: any;

  constructor(private settingService: SettingService,
    private platform: Platform,
    private navController: NavController,
    private duaService: DuaService) {
    //  this.platform.backButton.observers.

    // this.subscription = this.platform.backButton.subscribe(() => {
    //   this.navController.navigateForward('/home');

    //   // try {
    //   //   var id = this.duaService.getLastDuaId();
    //   // var url = '/folder/'+ id;

    //   // if (id == undefined || id == '') {
    //   //   url = '/home';
    //   // }
    //   // alert(url);
    //   // console.log('navigating to url '+url);
    //   // }
    //   // catch(error) {
    //   //   var msg = error + '';
    //   //   alert(error);
    //   //  }
    // });


    }


  //   ionViewDidEnter(){
  //     this.subscription = this.platform.backButton.subscribe(()=>{
  //       var url = '/folder/' + this.duaService.getLastDuaId();
  //       console.log(url);
  //        this.navController.navigateForward(url);
  //     });
  // }

  // ionViewWillLeave(){
  //     this.subscription.unsubscribe();
  // }

  // ionViewDidEnter() {
  //   this.subscription = this.platform.backButton.subscribe(() => {
  //     this.navController.navigateForward('/home');
  //   });
  // }

  // ionViewWillLeave() {
  //   this.subscription.unsubscribe();
  // }

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

  onArabicFontSelected(font)
  {
    this.setArabicFont(font);
    this.settingService.setArabicFont(font);
  }
  setArabicFont(font) {
    console.log('onArabic Font Selected Font Selected = ' + font );
    this.arabColor = '';
    this.arColor = '';
    this.arabicColor = '';
    this.arab2Color = '';
    this.arab3Color = '';


    this.arabicFont = font;

    if (font == 'arabic') {
      this.arabicColor = this.bgSelectedcolor;
    }
    if (font == 'ar') {
      this.arColor = this.bgSelectedcolor;
    }
    if (font == 'arab') {
      this.arabColor = this.bgSelectedcolor;
    }
    if (font == 'arab2') {
      this.arab2Color = this.bgSelectedcolor;
    }
    if (font == 'arab3') {
      this.arab3Color = this.bgSelectedcolor;
    }
  }

  ngOnInit() {
    this.settingService.observableSettings.subscribe(
      (data) => {
        if (data) {
          console.log('notification received for object', data);
          console.log('notification received for object', data.ArabicFont);
          this.arabicFontSize = data.ArabicFontSize;
          this.tamilFontSize = data.TamilFontSize;
          this.arabicFont = data.ArabicFont;
          this.setArabicFont(this.arabicFont);
          console.log('Notification received arabic font set ' + this.arabicFont);
          console.log('increased  notification received arabic font set is' + this.arabicFontSize);
          console.log('increased  notification received tamil font set is' + this.tamilFontSize);
        }
      }
    );
  //   var el = document.getElementById('tamilId');
  //   console.log(el);
  //   var style = window.getComputedStyle(el).getPropertyValue('font-size');
  //   console.log(style);
  //   //this.tamilFontSize = parseFloat(style);
  //   var e2 = document.getElementById('arabicId');
  //   var style2 = window.getComputedStyle(e2, null).getPropertyValue('font-size');
  //   console.log(style2);
  //  // var fontSize = parseFloat(style2);

  //   this.duaId = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
