/* eslint-disable eqeqeq */
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, NavController, LoadingController, ToastController, ActionSheetController, IonContent } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';
import { SettingService } from '../shared/service/setting.service';
import { NetworkService } from '../shared/service/network.service';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Subscription } from 'rxjs';
import { StorageService } from '../shared/service/storage.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
  shareTemplate = ' *@title* \n\n\r@notes \n\r\n\r @arabic  \n\r\n\r *தமிழ்:* @tamilDua-  \n\r\n\r *பொருள்:* @translation \n\n\r *ஆதாரம்:* \n\n\r @evidence';
  isLoading = false;
  isOffline = false;
  showSearch = false;
  searchText = '';
  favorites: string[] = [];
  currentlyPlaying: string | null = null;
  showTamilDua: boolean = true;
  showTranslation: boolean = true;
  showHadees: boolean = true;
  showNavigationMenu: boolean = true; // Controls visibility of the navigation menu
  isReaderMode: boolean = false; // New: distraction-free reader mode toggle

  private networkSubscription: Subscription | null = null;
  private settingsSubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;
  private pageId: string | null = null;

  @ViewChild('duaContent', { static: false }) duaContent: IonContent;

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
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) { }

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

    // Subscribe to settings changes
    this.settingsSubscription = this.settingService.observableSettings.subscribe(settings => {
      if (settings) {
        // Update font settings
        this.arabicFontSize = settings.ArabicFontSize;
        this.tamilFontSize = settings.TamilFontSize;
        this.selectedArabicFont = settings.ArabicFont;

        // Update visibility settings
        this.showTamilDua = settings.ShowTamilDua;
        this.showTranslation = settings.ShowTranslation;
        this.showHadees = settings.ShowHadees;
      }
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
        this.duaGroupTitle = duaGroup.PageTitle || 'முஸ்லீம்களின் அன்றாடப் பிரார்த்தனைகள்';
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

      if (this.showSearch && this.searchText) {
        const query = this.searchText.toLowerCase().trim();
        filtered = this.duaList.filter(dua => {
          const title = dua.DuaTitle?.toLowerCase() ?? '';
          const arabic = dua.DuaContent?.ArabicDua?.toLowerCase() ?? '';
          const tamil = dua.DuaContent?.TamilDua?.toLowerCase() ?? '';
          const translation = dua.DuaContent?.Translation?.toLowerCase() ?? '';

          return title.includes(query) ||
            arabic.includes(query) ||
            tamil.includes(query) ||
            translation.includes(query);
        });
      } else {
        filtered = [...this.duaList];
      }

      this.filteredDuas = filtered;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error in filterDuas:', error);
      this.filteredDuas = [];
    }
  }

  // Search and Filter Functions
  async toggleSearchBar() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchText = '';
    }
    await this.filterDuas();
  }

  // Favorites Management
  async loadFavorites() {
    try {
      this.favorites = await this.settingService.getFavorites();
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
    await this.triggerHapticFeedback();
    this.cdr.detectChanges();
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


  isPlaying(dua: any): boolean {
    return this.currentlyPlaying === dua.Id;
  }

  // Copy to Clipboard
  async copyToClipboard(dua: any) {
    const text = `${dua.DuaTitle}\n\n${dua.DuaContent.ArabicDua}\n\nதமிழ்: ${dua.DuaContent.TamilDua}\n\nபொருள்: ${dua.DuaContent.Translation}`;

    await Clipboard.write({ string: text });
    await this.triggerHapticFeedback();

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
      header: 'வழிசெலுத்தல் (Navigation)',
      buttons: [
        {
          text: 'விருப்பமானவை (Favorites)',
          icon: 'heart',
          handler: () => {
            this.navController.navigateForward('/favorites');
          }
        },
        {
          text: 'இப்பக்கத்தில் தேடுக (Search in Page)',
          icon: 'search',
          handler: () => {
            this.toggleSearchBar();
          }
        },
        {
          text: 'முகப்பு (Home)',
          icon: 'home',
          handler: () => {
            this.navController.navigateRoot('/home');
          }
        },
        {
          text: 'அமைப்புகள் (Settings)',
          icon: 'settings',
          handler: () => {
            this.navController.navigateForward('/settings');
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

    var readableReference = "";

    if (dua.DuaContent.HadithReferences != null && dua.DuaContent.HadithReferences.length != 0) {
      readableReference = dua.DuaContent.HadithReferences[0].ReadableReference;
      console.log("Hadees Reference Object : -", dua.DuaContent.HadithReferences[0]);
      console.log("readable Reference : ", readableReference);
    }
    else {
      console.log("Hadees  Reference  is empty : ", dua.DuaContent.HadithReferences);

    }

    let shareText = this.shareTemplate
      .replace(/@title/gi, dua.DuaTitle)
      .replace(/@notes/gi, dua.DuaContent.Notes || '')
      .replace(/@arabic/gi, dua.DuaContent.ArabicDua)
      .replace(/@tamilDua/gi, dua.DuaContent.TamilDua)
      .replace(/@translation/gi, dua.DuaContent.Translation)
      .replace(/@evidence/gi, readableReference);

    try {
      await Share.share({
        title: dua.DuaTitle,
        text: shareText,
        dialogTitle: 'அன்றாடப் பிரார்த்தனைகள்',
      });
      await this.triggerHapticFeedback();
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

  // Navigation Menu Functions
  toggleNavigationMenu(event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent the card click event from firing
    }
    this.showNavigationMenu = !this.showNavigationMenu;
  }

  async scrollToDua(index: number) {
    const targetId = `dua-${index}`;
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Scroll to the selected dua with smooth behavior
      await this.duaContent.scrollToPoint(0, targetElement.offsetTop, 500);

      // Find the card element inside and highlight it
      const card = targetElement.querySelector('.ios-dua-card');
      if (card) {
        card.classList.add('highlight-glow');
        setTimeout(() => {
          card.classList.remove('highlight-glow');
        }, 2500); // Remove after animation completes
      }
    }
  }

  scrollToTop() {
    this.duaContent.scrollToTop(500);
  }

  // Premium Customizer & Helpers
  async triggerHapticFeedback() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      console.log('Haptics failed/unsupported', e);
    }
  }

  get arabicFontSizeVal(): number {
    return parseInt(this.arabicFontSize) || 32;
  }

  get tamilFontSizeVal(): number {
    return parseInt(this.tamilFontSize) || 17;
  }

  onArabicSizeChange(event: any) {
    const val = event.detail.value;
    this.settingService.setArabicFontSize(val);
  }

  onTamilSizeChange(event: any) {
    const val = event.detail.value;
    this.settingService.setTamilFontSize(val);
  }

  toggleReaderMode() {
    this.isReaderMode = !this.isReaderMode;
    this.triggerHapticFeedback();
  }
}
