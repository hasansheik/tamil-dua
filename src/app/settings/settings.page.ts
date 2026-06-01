import { Component, OnInit } from '@angular/core';
import { SettingService } from '../shared/service/setting.service';
import { RangeCustomEvent, AlertController, ToastController } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  // Font settings
  arabicFontSize: number = 32;
  tamilFontSize: number = 17;
  selectedArabicFont: string = 'arabic';
  arabicFont: string = 'defaultFont';
  showFontOptions: boolean = false;

  // Visibility settings
  showTamilDua: boolean = true;
  showTranslation: boolean = true;
  showHadees: boolean = true;

  // Backup / Restore data properties
  backupCode: string = '';
  restoreCode: string = '';



  constructor(
    private settingService: SettingService,
    private duaService: DuaService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    // Subscribe to settings changes
    this.settingService.observableSettings.subscribe(settings => {
      if (settings) {
        // Update font settings
        this.arabicFontSize = parseInt(settings.ArabicFontSize, 10);
        this.tamilFontSize = parseInt(settings.TamilFontSize, 10);
        this.selectedArabicFont = settings.ArabicFont;

        // Update visibility settings
        this.showTamilDua = settings.ShowTamilDua;
        this.showTranslation = settings.ShowTranslation;
        this.showHadees = settings.ShowHadees;



        this.duaService.clear_cache();
      }
    });
  }

  // Font size handlers
  increaseArabicFontSize() {
    this.arabicFontSize += 2;
    this.settingService.setArabicFontSize(this.arabicFontSize);
  }

  decreaseArabicFontSize() {
    if (this.arabicFontSize > 16) {
      this.arabicFontSize -= 2;
      this.settingService.setArabicFontSize(this.arabicFontSize);
    }
  }

  increaseTamilFontSize() {
    this.tamilFontSize += 2;
    this.settingService.setTamilFontSize(this.tamilFontSize);
  }

  decreaseTamilFontSize() {
    if (this.tamilFontSize > 12) {
      this.tamilFontSize -= 2;
      this.settingService.setTamilFontSize(this.tamilFontSize);
    }
  }

  // Font size change handlers
  onArabicFontSizeChange(event: any) {
    var fontSize = (event as RangeCustomEvent).detail.value;
    console.log('ionChange emitted value:', fontSize);
    this.settingService.setArabicFontSize(fontSize);
  }

  onTamilFontSizeChange(event: any) {
    var fontSize = (event as RangeCustomEvent).detail.value;
    console.log('ionChange emitted value:', fontSize);
    this.settingService.setTamilFontSize(fontSize);
  }

  // Font style handler
  onArabicFontChange(event?: any) {
    this.settingService.setArabicFont(this.selectedArabicFont);
    console.log('Arabic font changed', event);
  }

  // Visibility toggle handlers
  async onShowTamilDuaChange() {
    await this.settingService.setShowTamilDua(this.showTamilDua);
  }

  async onShowTranslationChange() {
    await this.settingService.setShowTranslation(this.showTranslation);
  }

  async onShowHadeesChange() {
    await this.settingService.setShowHadees(this.showHadees);
  }

  // Backup / Restore Favorites Methods
  async generateBackup() {
    try {
      const favorites = await this.settingService.getFavorites();
      if (favorites && favorites.length > 0) {
        this.backupCode = btoa(JSON.stringify(favorites));
        await Clipboard.write({ string: this.backupCode });
        const toast = await this.toastCtrl.create({
          message: 'காப்புப்பிரதி குறியீடு நகலெடுக்கப்பட்டது!',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
      } else {
        const toast = await this.toastCtrl.create({
          message: 'பிடித்தவைகளின் பட்டியல் காலியாக உள்ளது!',
          duration: 2000,
          color: 'warning',
          position: 'bottom'
        });
        await toast.present();
      }
    } catch (e) {
      console.error(e);
      const toast = await this.toastCtrl.create({
        message: 'காப்புப்பிரதி எடுப்பதில் பிழை!',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  async restoreBackup() {
    if (!this.restoreCode || !this.restoreCode.trim()) {
      const toast = await this.toastCtrl.create({
        message: 'குறியீட்டை உள்ளிடவும்!',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    try {
      const decoded = atob(this.restoreCode.trim());
      const favorites = JSON.parse(decoded);
      if (Array.isArray(favorites)) {
        await this.settingService.setFavorites(favorites);
        const toast = await this.toastCtrl.create({
          message: 'பிடித்தவைகள் வெற்றிகரமாக மீட்டெடுக்கப்பட்டன!',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
        this.restoreCode = '';
      } else {
        throw new Error('Invalid format');
      }
    } catch (e) {
      const toast = await this.toastCtrl.create({
        message: 'செல்லாத குறியீடு! மீண்டும் சரிபார்க்கவும்.',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  async resetDefaults() {
    const alert = await this.alertCtrl.create({
      header: 'அமைப்புகளை மீட்டமை',
      message: 'அனைத்து அமைப்புகளையும் இயல்புநிலைக்கு மீட்டமைக்க வேண்டுமா?',
      cssClass: 'premium-alert-theme',
      buttons: [
        {
          text: 'ரத்து செய்',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'ஆம், மீட்டமை',
          cssClass: 'alert-button-confirm',
          handler: async () => {
            await this.settingService.setArabicFontSize(32);
            await this.settingService.setTamilFontSize(17);
            await this.settingService.setArabicFont('arabic');
            await this.settingService.setShowTamilDua(true);
            await this.settingService.setShowTranslation(true);
            await this.settingService.setShowHadees(true);

            const toast = await this.toastCtrl.create({
              message: 'அமைப்புகள் மீட்டமைக்கப்பட்டன!',
              duration: 2000,
              color: 'success',
              position: 'bottom'
            });
            await toast.present();
          }
        }
      ]
    });
    await alert.present();
  }


}

