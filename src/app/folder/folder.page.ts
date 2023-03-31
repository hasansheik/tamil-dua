/* eslint-disable eqeqeq */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';
import { SettingService } from '../shared/service/setting.service';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  duaList = [];
  title = 'empty';
  duaContent: any;
  selectedArabicFont = 'arabic';
  arabicFontSize = '32px';
  tamilFontSize = '17px';
  duaGroupTitle ='முஸ்லீம்களின் அன்றாடப் பிரார்தனைகள்';
  shareTemplate = ' @title @notes \n\r\n\r @arabic  \n\r\n\r தமிழ்: @tamilDua  \n\r\n\r பொருள்: @translation';

  duaPage: any;
  subscription: any;
  constructor(private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private duaService: DuaService,
    private settingService: SettingService,
    private navController: NavController) {
    this.settingService.observableSettings.subscribe(
      (data) => {
        if (data) {
          this.arabicFontSize = data.ArabicFontSize;
          this.tamilFontSize = data.TamilFontSize;
          this.selectedArabicFont = data.ArabicFont;
        }
      }
    );
  }

//   ionViewDidEnter(){
//     this.subscription = this.platform.backButton.subscribe(()=>{
//        this.navController.navigateBack('\home');
//     });
//     this.duaService.getDuaPageList();
// }

// ionViewWillLeave(){
//     this.subscription.unsubscribe();
// }

  goToSettingsPage()
  {
    this.navController.navigateRoot('/settings');
  }

  onShare(id) {
    let dataTeamplate = this.shareTemplate;

    let selectedDua = null;
    for (const dua of this.duaList) {
      if (dua.Id == id) {
        selectedDua = dua;
      }
    }

    if (selectedDua) {

      dataTeamplate = dataTeamplate.replace(/@title/gi, selectedDua.DuaTitle);
      dataTeamplate = dataTeamplate.replace(/@notes/gi, selectedDua.Notes);
      dataTeamplate = dataTeamplate.replace(/@arabic/gi, selectedDua.DuaContent.ArabicDua);
      dataTeamplate = dataTeamplate.replace(/@tamilDua/gi, selectedDua.DuaContent.TamilDua);
      dataTeamplate = dataTeamplate.replace(/@translation/gi, selectedDua.DuaContent.Translation);

       Share.share({
        title: selectedDua.DuaTitle,
        text: dataTeamplate,
        dialogTitle: 'அன்றாடப் பிரார்தனைகள்',
      });
    }
  }

  hideNotes(duaContent) {
    if (typeof duaContent.Notes != 'undefined' && duaContent.Notes) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    // this.settingService.observableSettings.subscribe(
    //   (data) =>
    //       {
    //         if(data) {
    //           this.arabicFontSize = data.ArabicFontSize;
    //           this.tamilFontSize = data.TamilFontSize;
    //         }
    //       }
    // );
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.title = 'அன்றாடப் பிரார்தனைகள்';
    this.duaPage = this.duaService.getDuaById(id);

    if (this.duaPage) {
      this.title = this.duaPage.PageTitle;
      this.duaList = this.duaPage.DuaList;
      this.duaGroupTitle = this.duaPage.PageTitle;
    }
    this.settingService.readSettingsData();
    // (data) => { console.log(data);
    //   this.title = 'Tamil Dua of Muslims';
    //   this.duaPage = this.duaService.getDuaById(data);
    //   if ( this.duaPage ) {
    //     this.title = this.duaPage.PageTitle;
    //     this.duaList = this.duaPage.DuaList;
    //   }
  }

}
