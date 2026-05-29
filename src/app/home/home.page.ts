import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';
import { StorageService } from '../shared/service/storage.service';
import { SettingService } from '../shared/service/setting.service';
import { DuaListModalComponent } from '../components/dua-list-modal/dua-list-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  subscription: any;
  duaPages: any[] = [];
  lastVisitedPages: any[] = [];
  
  // New properties for premium features
  greetingText = 'அஸ்ஸலாமு அலைக்கும்';
  greetingIcon = 'sunny-outline';
  dailyDua: any = null;
  favoritesCount = 0;
  searchText = '';
  searchResults: any[] = [];

  constructor(
    private platform: Platform, 
    private duaService: DuaService,
    private storageService: StorageService,
    private settingService: SettingService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.setGreeting();
    await this.loadDuaData();
  }

  ionViewWillEnter() {
    this.loadFavoritesCount();
  }

  setGreeting() {
    const hours = new Date().getHours();
    if (hours < 12 && hours >= 5) {
      this.greetingText = 'காலை வணக்கம் (Good Morning)';
      this.greetingIcon = 'sunny-outline';
    } else if (hours >= 12 && hours < 17) {
      this.greetingText = 'மதிய வணக்கம் (Good Afternoon)';
      this.greetingIcon = 'partly-sunny-outline';
    } else if (hours >= 17 && hours < 21) {
      this.greetingText = 'மாலை வணக்கம் (Good Evening)';
      this.greetingIcon = 'sunset-outline';
    } else {
      this.greetingText = 'இரவு வணக்கம் (Peaceful Night)';
      this.greetingIcon = 'moon-outline';
    }
  }

  async loadDuaData() {
    try {
      const pages = await this.duaService.getDuaPageList();
      this.duaPages = pages.map(page => ({
        PageTitle: page.PageTitle,
        PageId: page.Id,
        Duas: page.DuaList || []
      }));
      
      // Get last visited pages from storage
      const lastVisited = await this.storageService.getData('lastVisitedPages') || [];
      this.lastVisitedPages = lastVisited
        .map((pageId: string) => this.duaPages.find(page => page.PageId === pageId))
        .filter((page: any) => page)
        .slice(0, 5);

      if (this.lastVisitedPages.length === 0) {
        this.lastVisitedPages = this.duaPages.slice(0, 5);
      }

      await this.loadDailyDua();
      await this.loadFavoritesCount();
    } catch (error) {
      console.error('Error loading dua pages:', error);
    }
  }

  async loadFavoritesCount() {
    try {
      const favs = await this.settingService.getFavorites();
      this.favoritesCount = favs.length;
    } catch (e) {
      this.favoritesCount = 0;
    }
  }

  async loadDailyDua() {
    try {
      const allDuas = await this.duaService.getAllDuas();
      if (allDuas && allDuas.length > 0) {
        // Select a random dua based on the day of the year (so it changes daily, not on every page reload)
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000);
        const index = dayOfYear % allDuas.length;
        this.dailyDua = allDuas[index];
      }
    } catch (error) {
      console.error('Error loading daily dua:', error);
    }
  }

  async onSearchInput() {
    if (!this.searchText || this.searchText.trim() === '') {
      this.searchResults = [];
      return;
    }
    this.searchResults = await this.duaService.searchDuas(this.searchText);
  }

  clearSearch() {
    this.searchText = '';
    this.searchResults = [];
  }

  async showAllPages() {
    const modal = await this.modalCtrl.create({
      component: DuaListModalComponent,
      componentProps: {
        duaPages: this.duaPages
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8,
      cssClass: 'dua-list-modal'
    });

    await modal.present();
  }
}
