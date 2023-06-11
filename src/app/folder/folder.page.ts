/* eslint-disable eqeqeq */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { DuaService } from '../service/dua.service';
import { SettingsService } from '../service/settings.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  folder!: string;
  duaList: any[] = [];
  title = 'empty';
  duaContent: any;
  selectedArabicFont = 'arabic';
  arabicFontSize = '32px';
  tamilFontSize = '17px';
  duaGroupTitle = 'முஸ்லீம்களின் அன்றாடப் பிரார்தனைகள்';
  shareTemplate = '@title @notes \n\r\n\r @arabic  \n\r\n\r தமிழ்: @tamilDua  \n\r\n\r பொருள்: @translation';

  duaPage: any;
  subscription: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private duaService: DuaService,
    private settingService: SettingsService,
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.title = 'அன்றாடப் பிரார்தனைகள்';
    this.duaPage = this.duaService.getDuaById(id!);

    if (this.duaPage) {
      this.title = this.duaPage.PageTitle;
      this.duaList = this.duaPage.DuaList;
      this.duaGroupTitle = this.duaPage.PageTitle;
    }

    this.settingService.observableSettings.subscribe((data: any) => {
      if (data) {
        this.arabicFontSize = data.arabicFontSize + 'px';
        this.tamilFontSize = data.tamilFontSize + 'px';
        this.selectedArabicFont = data.selectedArabicFont;
      }
    });

    this.settingService.getSettings();
  }

  onShare(id: any) {
    const selectedDua = this.duaList.find((dua) => dua.Id == id);

    if (selectedDua) {
      let dataTemplate = this.shareTemplate;
      dataTemplate = dataTemplate.replace(/@title/gi, selectedDua.DuaTitle);
      dataTemplate = dataTemplate.replace(/@notes/gi, selectedDua.Notes);
      dataTemplate = dataTemplate.replace(/@arabic/gi, selectedDua.DuaContent.ArabicDua);
      dataTemplate = dataTemplate.replace(/@tamilDua/gi, selectedDua.DuaContent.TamilDua);
      dataTemplate = dataTemplate.replace(/@translation/gi, selectedDua.DuaContent.Translation);

      Share.share({
        title: selectedDua.DuaTitle,
        text: dataTemplate,
        dialogTitle: 'அன்றாடப் பிரார்தனைகள்',
      });
    }
  }

  hideNotes(duaContent: any) {
    return !(typeof duaContent.Notes != 'undefined' && duaContent.Notes);
  }

  toggleBookmark() {
    const duaId = this.activatedRoute.snapshot.paramMap.get('id');
    this.duaService.toggleBookmark(duaId as string);
  }

  isBookmarked(): boolean {
    const duaId = this.activatedRoute.snapshot.paramMap.get('id');
    return this.duaService.isBookmarked(duaId as string);
  }
}
