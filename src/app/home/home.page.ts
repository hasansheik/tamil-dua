import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { DuaService } from '../shared/service/dua.service';
import { StorageService } from '../shared/service/storage.service';
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
  
  constructor(
    private platform: Platform, 
    private duaService: DuaService,
    private storageService: StorageService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
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
        .filter((page: any) => page) // Remove any undefined entries
        .slice(0, 5); // Get only last 5 visited pages

      // If no last visited pages, show first 5 pages
      if (this.lastVisitedPages.length === 0) {
        this.lastVisitedPages = this.duaPages.slice(0, 5);
      }
    } catch (error) {
      console.error('Error loading dua pages:', error);
      this.duaPages = [];
      this.lastVisitedPages = [];
    }
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
