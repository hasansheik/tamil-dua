/* eslint-disable eqeqeq */
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, NavController, LoadingController, ToastController, ActionSheetController, IonContent } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';
import { SettingService } from '../shared/service/setting.service';
import { NetworkService } from '../shared/service/network.service';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Subscription } from 'rxjs';
import { StorageService } from '../shared/service/storage.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit, OnDestroy {
  duaList = [];
  filteredDuas = [];
  selectedArabicFont = 'arabic';
  arabicFontSize = '32px';
  tamilFontSize = '17px';
  duaGroupTitle = 'முஸ்லீம்களின் அன்றாடப் பிரார்தனைகள்';
  shareTemplate = ' @title @notes \n\r\n\r @arabic  \n\r\n\r தமிழ்: @tamilDua  \n\r\n\r பொருள்: @translation';
  isLoading = false;
  isOffline = false;
  showSearch = false;
  searchText = '';
  selectedCategory = 'all';
  favorites: string[] = [];
  currentlyPlaying: string | null = null;

  private networkSubscription: Subscription | null = null;
  private settingsSubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;
  private pageId: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private duaService: DuaService,
    private settingService: SettingService,
    private networkService: NetworkService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private navController: NavController,
    private storageService: StorageService
  ) {}

  ionViewWillEnter() {
    console.log('ionViewWillEnter - Checking if reload needed');
    // Only reload if we have a pageId but no data
    if (this.pageId && (!this.duaList || this.duaList.length === 0)) {
      console.log('ionViewWillEnter - Reloading data');
      this.loadDuaGroup(this.pageId);
    }
  }

  async ngOnInit() {
    console.log('ngOnInit - Initializing page');
    await this.initializeSubscriptions();
    await this.loadFavorites();
    
    // Subscribe to route changes
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      if (!paramMap.has('id')) {
        this.navController.navigateRoot('/home');
        return;
      }

      const id = paramMap.get('id');
      this.pageId = id;
      console.log('Route changed - Loading dua group:', id);
      if (!this.isLoading) {  // Only load if not already loading
        await this.loadDuaGroup(id!);
      }
      console.log('Route changed - Updating last visited pages');
      await this.updateLastVisitedPages(id!);
    });
  }

  ngOnDestroy() {
    console.log('ngOnDestroy - Cleaning up subscriptions');
    this.networkSubscription?.unsubscribe();
    this.settingsSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  private async initializeSubscriptions() {
    // Initialize network status subscription
    this.networkSubscription = this.networkService.getNetworkStatus().subscribe(async (isOnline) => {
      const wasOffline = this.isOffline;
      this.isOffline = !isOnline;
      // Only refresh if we're coming back online
      if (isOnline && wasOffline) {
        await this.refreshData();
      }
    });

    // Initialize settings subscription
    this.settingsSubscription = this.settingService.observableSettings.subscribe((data) => {
      if (data) {
        this.arabicFontSize = data.ArabicFontSize;
        this.tamilFontSize = data.TamilFontSize;
        this.selectedArabicFont = data.ArabicFont;
      }
    });
  }

  async loadDuaGroup(id: string) {
    console.log('loadDuaGroup - Starting to load:', id);
    if (this.isLoading) {
      console.log('loadDuaGroup - Already loading, skipping');
      return;
    }

    this.isLoading = true;
    this.duaList = [];
    this.filteredDuas = [];
    
    const loading = await this.loadingCtrl.create({
      message: 'தரவுகளை ஏற்றுகிறது...',
    });

    try {
      await loading.present();
      console.log('loadDuaGroup - Fetching data from service');
      const duaGroup = await this.duaService.getDuaGroupById(id);
      if (duaGroup) {
        console.log('loadDuaGroup - Data received, updating view');
        this.duaList = duaGroup.DuaList || [];
        this.duaGroupTitle = duaGroup.PageTitle || 'முஸ்லீம்களின் அன்றாடப் பிரார்தனைகள்';
        await this.filterDuas();
      } else {
        console.log('loadDuaGroup - No data received');
        this.showErrorToast();
      }
    } catch (error) {
      console.error('loadDuaGroup - Error:', error);
      this.showErrorToast();
    } finally {
      console.log('loadDuaGroup - Finished loading');
      this.isLoading = false;
      if (loading) {
        await loading.dismiss().catch(err => console.error('Error dismissing loading:', err));
      }
    }
  }

  async filterDuas() {
    try {
      let filtered: any[] = [];

      if (this.selectedCategory === 'search') {
        if (this.searchText) {
          filtered = await this.duaService.searchDuas(this.searchText);
          this.duaGroupTitle = 'தேடல் முடிவுகள்';
        } else {
          filtered = [];
          this.duaGroupTitle = 'தேடல் செய்ய உள்ளிடவும்';
        }
      } else if (this.selectedCategory === 'favorites') {
        console.log('filterDuas - Favorites selected'); 
        filtered = await this.duaService.getFavoriteDuas(this.favorites);
        console.log('filterDuas - Favorites received'); 
        this.duaGroupTitle = 'நெஞ்சில் நின்றவை';
      } else {
        filtered = [...this.duaList];
        console.log('filterDuas - All duas selected');
        // Reset title to the original dua group title when showing all
        const duaGroup = await this.duaService.getDuaGroupById(this.pageId!);
        if (duaGroup) {
          this.duaGroupTitle = duaGroup.PageTitle || 'முஸ்லீம்களின் அன்றாடப் பிரார்தனைகள்';
        }
      }

      this.filteredDuas = filtered;
      console.log('filterDuas - Filtered duas:', this.filteredDuas);
    } catch (error) {
      console.error('Error in filterDuas:', error);
      this.filteredDuas = [];
    }
  }

  // Search and Filter Functions
  toggleSearchBar() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchText = '';
      this.filterDuas();
    }
  }

  onCategoryChange() {
    if (this.selectedCategory === 'search' && !this.showSearch) {
      this.showSearch = true;
    } else if (this.selectedCategory !== 'search' && this.showSearch) {
      this.showSearch = false;
      this.searchText = '';
    }
    this.filterDuas();
  }

  // Favorites Management
  async loadFavorites() {
    try {
      this.favorites = await this.settingService.getFavorites();
      // If viewing favorites, refresh the filtered list
      if (this.selectedCategory === 'favorites') {
        this.filterDuas();
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.favorites = [];
    }
  }

  async toggleFavorite(dua: any) {
    const index = this.favorites.indexOf(dua.Id);
    if (index === -1) {
      this.favorites.push(dua.Id);
    } else {
      this.favorites.splice(index, 1);
    }
    await this.settingService.setFavorites(this.favorites);

    const message = index === -1 ? 'பிடித்தவைகளில் சேர்க்கப்பட்டது' : 'பிடித்தவைகளிலிருந்து நீக்கப்பட்டது';
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  isFavorite(dua: any): boolean {
    return this.favorites.includes(dua.Id);
  }

  // Audio Playback
  toggleAudioPlay(dua: any) {
    if (!dua.hasAudio) return;

    if (this.currentlyPlaying === dua.Id) {
      // Stop playing
      this.currentlyPlaying = null;
    } else {
      // Start playing
      this.currentlyPlaying = dua.Id;
    }
  }

  isPlaying(dua: any): boolean {
    return this.currentlyPlaying === dua.Id;
  }

  // Copy to Clipboard
  async copyToClipboard(dua: any) {
    const text = `${dua.DuaTitle}\n\n${dua.DuaContent.ArabicDua}\n\nதமிழ்: ${dua.DuaContent.TamilDua}\n\nபொருள்: ${dua.DuaContent.Translation}`;

    await Clipboard.write({ string: text });

    const toast = await this.toastCtrl.create({
      message: 'நகலெடுக்கப்பட்டது',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  // Action Sheet
  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'மேலும் விருப்பங்கள்',
      buttons: [
        {
          text: 'பிடித்தவைகளை காட்டு',
          icon: 'heart',
          handler: () => {
            this.selectedCategory = 'favorites';
            this.filterDuas();
          }
        },
        {
          text: 'அனைத்தையும் காட்டு',
          icon: 'list',
          handler: () => {
            this.selectedCategory = 'all';
            this.filterDuas();
          }
        },
        {
          text: 'தேடல்',
          icon: 'search',
          handler: () => {
            this.toggleSearchBar();
          }
        },
        {
          text: 'மூடு',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  private async refreshData() {
    if (!this.isOffline && this.pageId) {
      await this.loadDuaGroup(this.pageId);
    }
  }

  private async showOfflineToast() {
    const toast = await this.toastCtrl.create({
      message: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். சில உள்ளடக்கம் கிடைக்காமல் போகலாம்.',
      duration: 3000,
      position: 'bottom',
      color: 'warning'
    });
    await toast.present();
  }

  private async showErrorToast() {
    const toast = await this.toastCtrl.create({
      message: 'துஆக்களை ஏற்றுவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }

  async onShare(id: string) {
    const dua = this.duaList.find(d => d.Id === id);
    if (!dua) return;

    let shareText = this.shareTemplate
      .replace(/@title/gi, dua.DuaTitle)
      .replace(/@notes/gi, dua.DuaContent.Notes || '')
      .replace(/@arabic/gi, dua.DuaContent.ArabicDua)
      .replace(/@tamilDua/gi, dua.DuaContent.TamilDua)
      .replace(/@translation/gi, dua.DuaContent.Translation);

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

  hideNotes(duaContent: any): boolean {
    return !duaContent?.Notes;
  }

  goToSettingsPage() {
    this.navController.navigateRoot('/settings');
  }

  private async updateLastVisitedPages(pageId: string) {
    try {
      // Get current list of last visited pages
      let lastVisited: string[] = await this.storageService.getData('lastVisitedPages') || [];
      
      // Remove the current page if it exists in the list
      lastVisited = lastVisited.filter(id => id !== pageId);
      
      // Add the current page to the beginning
      lastVisited.unshift(pageId);
      
      // Keep only the last 10 visited pages
      lastVisited = lastVisited.slice(0, 10);
      
      // Save back to storage
      await this.storageService.setData('lastVisitedPages', lastVisited);
    } catch (error) {
      console.error('Error updating last visited pages:', error);
    }
  }
}
