import { Component, OnInit } from '@angular/core';
import { Platform, ModalController, ToastController } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';
import { StorageService } from '../shared/service/storage.service';
import { SettingService } from '../shared/service/setting.service';
import { DuaListModalComponent } from '../components/dua-list-modal/dua-list-modal.component';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  subscription: any;
  duaPages: any[] = [];
  lastVisitedPages: any[] = [];
  
  // Premium properties
  greetingText = 'அஸ்ஸலாமு அலைக்கும்';
  greetingIcon = 'sunny-outline';
  greetingTime: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
  dailyDua: any = null;
  favoritesCount = 0;
  searchText = '';
  searchResults: any[] = [];

  // Redesign Properties
  activeTab: 'today' | 'chapters' | 'guidance' | 'about' = 'today';
  tamilDate = '';
  isDark = false;
  favorites: string[] = [];

  constructor(
    private platform: Platform, 
    private duaService: DuaService,
    private storageService: StorageService,
    private settingService: SettingService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.setGreeting();
    this.tamilDate = this.getTamilDate();
    await this.initTheme();
    await this.loadDuaData();
  }

  async ionViewWillEnter() {
    await this.loadFavorites();
    this.setGreeting();
  }

  async initTheme() {
    try {
      const pref = await this.storageService.getData('theme_preference');
      if (pref) {
        this.isDark = pref === 'dark';
      } else {
        this.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      this.applyTheme();
    } catch (e) {
      console.error('Error initializing theme:', e);
    }
  }

  applyTheme() {
    if (this.isDark) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }

  async toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme();
    await this.storageService.setData('theme_preference', this.isDark ? 'dark' : 'light');
    await this.triggerHapticFeedback();
    
    const toast = await this.toastCtrl.create({
      message: this.isDark ? 'இருண்ட பயன்முறை இயக்கப்பட்டது (Dark Mode Active)' : 'ஒளி பயன்முறை இயக்கப்பட்டது (Light Mode Active)',
      duration: 1500,
      position: 'bottom',
      cssClass: 'apple-toast'
    });
    await toast.present();
  }

  getTamilDate(): string {
    const days = ['ஞாயிற்றுக்கிழமை', 'திங்கட்கிழமை', 'செவ்வாய்க்கிழமை', 'புதன்கிழமை', 'வியாழக்கிழமை', 'வெள்ளிக்கிழமை', 'சனிக்கிழமை'];
    const months = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
    
    const d = new Date();
    const dayName = days[d.getDay()];
    const dateNum = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    
    return `${dateNum} ${monthName} ${year}, ${dayName}`;
  }

  setGreeting() {
    const hours = new Date().getHours();
    let activeTime: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
    
    if (hours >= 5 && hours < 12) {
      activeTime = 'morning';
    } else if (hours >= 12 && hours < 17) {
      activeTime = 'afternoon';
    } else if (hours >= 17 && hours < 21) {
      activeTime = 'evening';
    } else {
      activeTime = 'night';
    }
    
    this.greetingTime = activeTime;

    if (activeTime === 'morning') {
      this.greetingText = 'காலை வணக்கம்';
      this.greetingIcon = 'sunny-outline';
    } else if (activeTime === 'afternoon') {
      this.greetingText = 'மதிய வணக்கம்';
      this.greetingIcon = 'partly-sunny-outline';
    } else if (activeTime === 'evening') {
      this.greetingText = 'மாலை வணக்கம்';
      this.greetingIcon = 'cloudy-night-outline';
    } else {
      this.greetingText = 'இரவு வணக்கம்';
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
      await this.loadFavorites();
    } catch (error) {
      console.error('Error loading dua pages:', error);
    }
  }

  async loadFavorites() {
    try {
      this.favorites = await this.settingService.getFavorites();
      this.favoritesCount = this.favorites.length;
    } catch (e) {
      this.favoritesCount = 0;
      this.favorites = [];
    }
  }

  isFavorite(duaId: string): boolean {
    return this.favorites.includes(duaId);
  }

  async toggleFavorite(dua: any) {
    if (!dua) return;
    
    await this.triggerHapticFeedback();
    
    if (this.favorites.includes(dua.Id)) {
      this.favorites = this.favorites.filter(id => id !== dua.Id);
      const toast = await this.toastCtrl.create({
        message: 'பிடித்தவை பட்டியலிலிருந்து நீக்கப்பட்டது',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    } else {
      this.favorites.push(dua.Id);
      const toast = await this.toastCtrl.create({
        message: 'விருப்பமானவற்றில் சேர்க்கப்பட்டது',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    }
    
    await this.settingService.setFavorites(this.favorites);
    this.favoritesCount = this.favorites.length;
  }

  async loadDailyDua() {
    try {
      const allDuas = await this.duaService.getAllDuas();
      if (allDuas && allDuas.length > 0) {
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
      handle: true,
      cssClass: 'dua-list-modal'
    });

    await modal.present();
  }

  selectTab(tab: 'today' | 'chapters' | 'guidance' | 'about') {
    this.activeTab = tab;
    this.triggerHapticFeedback();
  }

  getChapterGradientClass(index: number): string {
    const classes = [
      'gradient-purple-indigo',
      'gradient-pink-red',
      'gradient-blue-teal',
      'gradient-orange-yellow',
      'gradient-green-emerald',
      'gradient-coral-pink'
    ];
    return classes[index % classes.length];
  }

  async triggerHapticFeedback() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      console.log('Haptics failed/unsupported', e);
    }
  }

  async onShare(dua: any) {
    if (!dua) return;
    await this.triggerHapticFeedback();
    
    let readableReference = '';
    if (dua.DuaContent?.HadithReferences?.length > 0) {
      readableReference = dua.DuaContent.HadithReferences[0].ReadableReference;
    }

    const shareTemplate = ' *@title* \n\n\r@notes \n\r\n\r @arabic  \n\r\n\r *தமிழ்:* @tamilDua  \n\r\n\r *பொருள்:* @translation \n\n\r *ஆதாரம்:* \n\n\r @evidence';
    const shareText = shareTemplate
      .replace(/@title/gi, dua.DuaTitle)
      .replace(/@notes/gi, dua.DuaContent.Notes || '')
      .replace(/@arabic/gi, dua.DuaContent.ArabicDua || '')
      .replace(/@tamilDua/gi, dua.DuaContent.TamilDua || '')
      .replace(/@translation/gi, dua.DuaContent.Translation || '')
      .replace(/@evidence/gi, readableReference);

    try {
      await Share.share({
        title: dua.DuaTitle,
        text: shareText,
        dialogTitle: 'அன்றாடப் பிரார்த்தனைகள்',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  async copyToClipboard(dua: any) {
    if (!dua) return;
    const text = `${dua.DuaTitle}\n\n${dua.DuaContent.ArabicDua || ''}\n\nதமிழ்: ${dua.DuaContent.TamilDua || ''}\n\nபொருள்: ${dua.DuaContent.Translation || ''}`;

    await Clipboard.write({ string: text });
    await this.triggerHapticFeedback();

    const toast = await this.toastCtrl.create({
      message: 'நகலெடுக்கப்பட்டது',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
