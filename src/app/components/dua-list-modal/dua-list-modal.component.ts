import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-dua-list-modal',
    template: `
    <ion-header class="ion-no-border apple-header-glass">
      <ion-toolbar class="apple-toolbar-glass">
        <div class="apple-header-title">அனைத்து பிரிவுகள்</div>
        <ion-buttons slot="end">
          <button (click)="dismiss()" class="apple-nav-btn-action" aria-label="Close">
            <ion-icon name="close"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>

      <!-- Spotlight search inside the header sub-toolbar -->
      <ion-toolbar class="apple-search-toolbar">
        <div class="modal-search-wrapper">
          <div class="modal-search-container">
            <ion-icon name="search-outline" class="modal-search-icon"></ion-icon>
            <input 
              type="text" 
              [(ngModel)]="searchText" 
              (input)="onSearchInput()" 
              placeholder="தலைப்பைத் தேடுக..." 
              class="modal-search-input"
            />
            <button 
              *ngIf="searchText" 
              (click)="clearSearch()" 
              class="modal-search-clear-btn"
              aria-label="Clear search"
            >
              <ion-icon name="close-circle"></ion-icon>
            </button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="modal-content-bg ion-padding">
      <div class="modal-layout-container">
        
        <!-- Premium Cards List of Dua Pages -->
        <div class="chapters-card-flow animate-in" *ngIf="filteredPages.length > 0">
          <div 
            *ngFor="let page of filteredPages; let i = index" 
            [routerLink]="['/folder', page.PageId]" 
            (click)="dismiss()"
            class="chapter-card ripple-item"
          >
            <div class="card-left-wrap">
              <div class="chapter-badge-wrapper" [class]="getIconColorClass(i)">
                <ion-icon name="book"></ion-icon>
              </div>
              <div class="chapter-info">
                <span class="chapter-title">{{ page.PageTitle }}</span>
                <span class="chapter-subtitle">{{ page.Duas?.length || 0 }} பிரார்த்தனைகள்</span>
              </div>
            </div>
            <div class="card-right-wrap">
              <ion-icon name="chevron-forward-outline" class="chevron-arrow"></ion-icon>
            </div>
          </div>
        </div>

        <!-- Spotlight search empty state -->
        <div *ngIf="filteredPages.length === 0" class="modal-empty-state animate-fade">
          <ion-icon name="alert-circle-outline" class="empty-icon"></ion-icon>
          <h2>தலைப்புகள் ஏதுமில்லை</h2>
          <p>வேறு வார்த்தைகளைத் தட்டச்சு செய்து தேடவும்</p>
        </div>

        <!-- Safe area spacer to prevent clipping under home indicator / drawer frame -->
        <div class="bottom-spacer"></div>

      </div>
    </ion-content>
  `,
    styles: [`
    /* Dynamic Theme Variables mapping to body variables */
    :host {
      display: flex !important;
      flex-direction: column !important;
      height: 100% !important;
      overflow: hidden !important;
      
      --modal-bg: var(--home-bg);
      --modal-card-bg: var(--home-card-bg);
      --modal-card-border: var(--home-card-border);
      --modal-text-main: var(--home-text-main);
      --modal-text-muted: var(--home-text-muted);
      --modal-accent: var(--home-accent);
      --modal-accent-rgb: var(--home-accent-rgb);
      --modal-accent-tint: var(--home-accent-tint);
      
      --modal-search-bg: var(--home-search-bg);
      --modal-badge-bg: var(--home-badge-bg);
      --modal-list-item-hover: rgba(var(--home-accent-rgb), 0.04);
      --glass-bg: var(--glass-bg);
      --glass-border: var(--glass-border);
    }

    /* Toolbar & Glass Headers */
    .apple-header-glass {
      background: var(--glass-bg) !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      border-bottom: 0.5px solid var(--glass-border) !important;
      flex-shrink: 0;
      will-change: transform;
      contain: layout style;
      transform: translateZ(0);
    }

    .apple-toolbar-glass {
      --background: transparent !important;
      --border-width: 0px !important;
      border: none !important;
      padding: 18px 12px 4px 12px !important;
      display: flex !important;
      align-items: center !important;
      box-shadow: none !important;
    }

    .apple-search-toolbar {
      --background: transparent !important;
      --border-width: 0px !important;
      border: none !important;
      padding: 0 !important;
      box-shadow: none !important;
      min-height: 48px !important;
    }

    .apple-header-title {
      font-family: var(--font-family-heading);
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--modal-text-main);
      margin-left: 6px;
      flex: 1;
    }

    .apple-nav-btn-action {
      border: none !important;
      background: var(--modal-search-bg) !important;
      border-radius: 50% !important;
      width: 32px !important;
      height: 32px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: var(--modal-text-main) !important;
      cursor: pointer;
      outline: none;
      transition: all 0.2s ease;

      &:active {
        transform: scale(0.9);
      }

      ion-icon {
        font-size: 16px;
      }
    }

    /* Spotlight Search inside the header */
    .modal-search-wrapper {
      padding: 0 16px 12px 16px;
      background: transparent;
      width: 100%;
      box-sizing: border-box;
    }

    .modal-search-container {
      display: flex;
      align-items: center;
      background: var(--modal-search-bg);
      border: 1px solid var(--modal-card-border);
      border-radius: 10px;
      padding: 0 10px;
      height: 36px;
      width: 100%;
      box-sizing: border-box;
      transition: all 0.2s ease;

      &:focus-within {
        border-color: var(--modal-accent);
        box-shadow: 0 0 0 1px rgba(var(--modal-accent-rgb), 0.2);
      }
    }

    .modal-search-icon {
      font-size: 16px;
      color: var(--modal-text-muted);
      margin-right: 8px;
    }

    .modal-search-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-family: var(--font-family-sans);
      font-size: 0.88rem;
      color: var(--modal-text-main);
      padding: 0;
      width: 100%;

      &::placeholder {
        color: var(--modal-text-muted);
        opacity: 0.65;
      }
    }

    .modal-search-clear-btn {
      background: transparent;
      border: none;
      outline: none;
      padding: 0;
      color: var(--modal-text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      ion-icon {
        font-size: 16px;
      }
    }

    /* Content & Layout Container */
    .modal-content-bg {
      --background: var(--modal-bg) !important;
      --padding-bottom: 120px !important;
      flex: 1 1 0% !important;
      min-height: 0 !important;
    }

    .modal-layout-container {
      display: flex;
      flex-direction: column;
      max-width: 600px;
      margin: 0 auto;
      padding: 4px 2px 20px 2px;
      box-sizing: border-box !important;
      width: 100%;
      flex-grow: 1;
    }

    /* Chapters Card Flow list */
    .chapters-card-flow {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      box-sizing: border-box;
    }

    .chapter-card {
      text-decoration: none;
      color: inherit;
      background: var(--modal-card-bg);
      border: 1px solid var(--modal-card-border);
      border-radius: 14px;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(162, 132, 94, 0.03);
      width: 100%;
      box-sizing: border-box;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

      :host-context(body.dark) & {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      }

      .card-left-wrap {
        display: flex;
        align-items: center;
        gap: 14px;
        flex: 1;
        min-width: 0;
      }

      .card-right-wrap {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      /* Premium Icon Badges using matching sidebar colors */
      .chapter-badge-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        font-size: 16px;
        flex-shrink: 0;
        border: 0.5px solid rgba(var(--modal-accent-rgb), 0.1);

        &.icon-purple { color: #5e5ce6; background: rgba(94, 92, 230, 0.1); }
        &.icon-green { color: #34c759; background: rgba(52, 199, 89, 0.1); }
        &.icon-orange { color: #ff9500; background: rgba(255, 149, 0, 0.1); }
        &.icon-gray { color: var(--modal-text-muted); background: var(--modal-search-bg); }
        &.icon-blue { color: var(--modal-accent); background: rgba(var(--modal-accent-rgb), 0.1); }
        &.icon-teal { color: #30b0c6; background: rgba(48, 176, 198, 0.1); }
        &.icon-pink { color: #ff2d55; background: rgba(255, 45, 85, 0.1); }
      }

      .chapter-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 0;
      }

      .chapter-title {
        font-family: var(--font-family-heading);
        font-size: 0.94rem;
        font-weight: 600;
        color: var(--modal-text-main);
        line-height: 1.4;
        word-wrap: break-word;
        white-space: normal;
      }

      .chapter-subtitle {
        font-family: var(--font-family-sans);
        font-size: 0.76rem;
        color: var(--modal-text-muted);
        font-weight: 500;
      }

      .chevron-arrow {
        font-size: 16px;
        color: var(--modal-text-muted);
        opacity: 0.65;
        transition: transform 0.2s ease;
      }

      &:active {
        transform: scale(0.985);
        background: var(--modal-list-item-hover);

        .chevron-arrow {
          transform: translateX(3px);
          color: var(--modal-accent);
        }
      }
    }

    /* Spotlight Empty State */
    .modal-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px 20px;
      width: 100%;
      box-sizing: border-box;

      .empty-icon {
        font-size: 40px;
        color: var(--modal-text-muted);
        opacity: 0.6;
        margin-bottom: 12px;
      }

      h2 {
        font-family: var(--font-family-heading);
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--modal-text-main);
        margin: 0 0 6px 0;
      }

      p {
        font-family: var(--font-family-sans);
        font-size: 0.82rem;
        color: var(--modal-text-muted);
        margin: 0;
      }
    }

    /* Entrance Animations */
    .animate-in {
      animation: slideUpFade 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .animate-fade {
      animation: fadeIn 0.2s ease both;
    }

    @keyframes slideUpFade {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .ripple-item {
      position: relative;
      overflow: hidden;
    }

    .bottom-spacer {
      height: calc(90px + env(safe-area-inset-bottom, 0px));
      width: 100%;
      pointer-events: none;
      background: transparent;
      flex-shrink: 0;
    }
  `],
    standalone: false
})
export class DuaListModalComponent implements OnInit {
  @Input() duaPages: any[] = [];
  searchText = '';
  filteredPages: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.filteredPages = [...this.duaPages];
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  clearSearch() {
    this.searchText = '';
    this.filteredPages = [...this.duaPages];
  }

  onSearchInput() {
    if (!this.searchText || this.searchText.trim() === '') {
      this.filteredPages = [...this.duaPages];
      return;
    }
    const query = this.searchText.toLowerCase().trim();
    this.filteredPages = this.duaPages.filter(page => 
      page.PageTitle.toLowerCase().includes(query)
    );
  }

  getIconColorClass(index: number): string {
    const classes = [
      'icon-purple',
      'icon-green',
      'icon-orange',
      'icon-blue',
      'icon-teal',
      'icon-pink',
      'icon-gray'
    ];
    return classes[index % classes.length];
  }
}
