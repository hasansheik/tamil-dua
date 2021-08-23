import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';
import { SettingService } from '../shared/service/setting.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  duaList = [];
  title = "empty";
  duaContent: any;
  arabicFontSize = "32px";
  tamilFontSize = "17px";
  duaGroupTitle ="முஸ்லீம்களின் அன்றாடப் பிரார்தனைகள்"
  shareTemplate = " @title @notes \n\r\n\r @arabic  \n\r\n\r தமிழ்: @tamilDua  \n\r\n\r பொருள்: @translation"

  duaPage: any;
  subscription: any;
  constructor(private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private socialSharing: SocialSharing,
    private duaService: DuaService,
    private settingService: SettingService,
    private navController: NavController) {
    this.subscription = this.platform.backButton.subscribe(() => {
      this.navController.navigateForward("/home");
    });
  }

  goToSettingsPage()
  {
    this.navController.navigateForward("/settings");
    //this.router.navigate(["/settings"]);
  }

  onShare(id) {
    let dataTeamplate = this.shareTemplate;

    let selectedDua = null;
    for (let dua of this.duaList) {
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

      this.socialSharing.shareWithOptions({
        message: dataTeamplate,
        subject: 'Subject',
        chooserTitle: 'title'
      }).then(
        (data) => console.log("share success")
      );
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
    var id = this.activatedRoute.snapshot.paramMap.get('id');
    this.title = "Tamil Dua of Muslims";
    this.duaPage = this.duaService.getDuaById(id);
    
    if (this.duaPage) {
      this.title = this.duaPage.PageTitle;
      this.duaList = this.duaPage.DuaList;
      this.duaGroupTitle = this.duaPage.PageTitle;
    }
    // (data) => { console.log(data);
    //   this.title = "Tamil Dua of Muslims";
    //   this.duaPage = this.duaService.getDuaById(data);
    //   if ( this.duaPage ) {
    //     this.title = this.duaPage.PageTitle;
    //     this.duaList = this.duaPage.DuaList;
    //   }
  }

}
