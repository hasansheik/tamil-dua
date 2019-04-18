import { Component, OnInit } from '@angular/core';
import { StateService } from '../shared/service/state.service';
import { DuaService } from '../shared/service/dua.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { SettingService } from '../shared/service/setting.service';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-dua-list-container',
  templateUrl: './dua-list-container.page.html',
  styleUrls: ['./dua-list-container.page.scss'],
})
export class DuaListContainerPage implements OnInit {

  // dataParams : any;
  // private dataSubject  = new BehaviorSubject(this.dataParams);
  
  // dataObservable = this.dataSubject.asObservable();
   duaList =[];
  title ="empty";
  duaContent : any;
  arabicFontSize = "20px";
  tamilFontSize = "12px";

  shareTemplate = "@title \n\r\n\r @arabic  \n\r\n\r தமிழ்: @tamilDua  \n\r\n\r பொருள்: @translation"

  duaPage: any;
  subscription : any;
//private router: Router,
  constructor( private platform : Platform, private socialSharing: SocialSharing,   private stateService: StateService, private duaService: DuaService, private settingService: SettingService, private navController: NavController) {
    this.subscription = this.platform.backButton.subscribe(()=>{
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
        for(let dua of this.duaList){
          if ( dua.Id == id) {          
            selectedDua = dua;
          }
        }

    if(selectedDua) {

      dataTeamplate = dataTeamplate.replace(/@title/gi, selectedDua.DuaTitle);
      dataTeamplate = dataTeamplate.replace(/@arabic/gi, selectedDua.DuaContent.ArabicDua);
      dataTeamplate = dataTeamplate.replace(/@tamilDua/gi, selectedDua.DuaContent.TamilDua);
      dataTeamplate = dataTeamplate.replace(/@translation/gi, selectedDua.DuaContent.Translation);

      this.socialSharing.shareWithOptions({
        message:dataTeamplate, 
        subject: 'Subject',
        chooserTitle: 'title'}).then(
          (data) => console.log("share success")
        );
    }
  }
     
   
  ngOnInit() {
    this.settingService.observableSettings.subscribe(
      (data) =>
          {
            if(data) {
              this.arabicFontSize = data.ArabicFontSize;
              this.tamilFontSize = data.TamilFontSize;              
            }
          }
    );
    this.title = "Tamil Dua of Muslims";
    this.stateService.observableSelectedPage.subscribe(
      
      (data) => { console.log(data);
        this.title = "Tamil Dua of Muslims";
        this.duaPage = this.duaService.getDuaById(data);
        if ( this.duaPage ) {
          this.title = this.duaPage.PageTitle;
          this.duaList = this.duaPage.DuaList;
        }
      }
    );
  }
}
