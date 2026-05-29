import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';
import { SettingService } from '../shared/service/setting.service';
import { Subscription } from 'rxjs';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit, OnDestroy {
  favoriteDuas: any[] = [];
  favorites: string[] = [];
  selectedArabicFont = 'arabic';
  arabicFontSize = '32px';
  tamilFontSize = '17px';
  showTamilDua: boolean = true;
  showTranslation: boolean = true;
  showHadees: boolean = true;
  isLoading = false;
  isReaderMode = false;
  shareTemplate = ' *@title* \n\n\r@notes \n\r\n\r @arabic  \n\r\n\r *தமிழ்:* @tamilDua-  \n\r\n\r *பொருள்:* @translation \n\n\r *ஆதாரம்:* \n\n\r @evidence';

  private settingsSubscription: Subscription | null = null;

  constructor(
    private duaService: DuaService,
    private settingService: SettingService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navController: NavController,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    // Subscribe to settings changes
    this.settingsSubscription = this.settingService.observableSettings.subscribe(settings => {
      if (settings) {
        this.arabicFontSize = settings.ArabicFontSize;
        this.tamilFontSize = settings.TamilFontSize;
        this.selectedArabicFont = settings.ArabicFont;
        this.showTamilDua = settings.ShowTamilDua;
        this.showTranslation = settings.ShowTranslation;
        this.showHadees = settings.ShowHadees;
      }
    });
  }

  async ionViewWillEnter() {
    await this.loadFavorites();
  }

  ngOnDestroy() {
    this.settingsSubscription?.unsubscribe();
  }

  async loadFavorites() {
    this.isLoading = true;
    try {
      this.favorites = await this.settingService.getFavorites();
      if (this.favorites && this.favorites.length > 0) {
        this.favoriteDuas = await this.duaService.getFavoriteDuas(this.favorites);
      } else {
        this.favoriteDuas = [];
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async toggleFavorite(dua: any) {
    const index = this.favorites.indexOf(dua.Id);
    if (index !== -1) {
      this.favorites.splice(index, 1);
      await this.settingService.setFavorites(this.favorites);
      await this.triggerHapticFeedback();
      
      // Animate item removal locally
      this.favoriteDuas = this.favoriteDuas.filter(d => d.Id !== dua.Id);
      
      const toast = await this.toastCtrl.create({
        message: 'பிடித்தவைகளிலிருந்து நீக்கப்பட்டது',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
      this.cdr.detectChanges();
    }
  }

  isFavorite(dua: any): boolean {
    return this.favorites.includes(dua.Id);
  }

  async copyToClipboard(dua: any) {
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

  async onShare(dua: any) {
    var readableReference = "";
    if (dua.DuaContent.HadithReferences && dua.DuaContent.HadithReferences.length > 0) {
      readableReference = dua.DuaContent.HadithReferences[0].ReadableReference;
    }

    let shareText = this.shareTemplate
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
      await this.triggerHapticFeedback();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  async triggerHapticFeedback() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      console.log('Haptics failed/unsupported', e);
    }
  }

  goToSettingsPage() {
    this.navController.navigateForward('/settings');
  }

  toggleReaderMode() {
    this.isReaderMode = !this.isReaderMode;
    this.triggerHapticFeedback();
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
}
