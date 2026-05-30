import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dua-list-modal',
  template: `
    <ion-header class="ion-no-border apple-header-glass">
      <ion-toolbar class="apple-toolbar-glass">
        <div class="apple-header-title">துஆக்கள்</div>
        <ion-buttons slot="end">
          <button (click)="dismiss()" class="apple-nav-btn-action" aria-label="Close">
            <ion-icon name="close"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="modal-content-bg ion-padding">
      <div class="modal-layout-container">
        
        <!-- Modal Section Title -->
        <div class="apple-section-header ion-margin-bottom">
          <span class="apple-section-title">அனைத்து பிரிவுகள்</span>
        </div>

        <!-- Premium Redesigned Grouped List -->
        <div class="apple-grouped-list-modal">
          <div 
            *ngFor="let page of duaPages; let i = index" 
            [routerLink]="['/folder', page.PageId]" 
            (click)="dismiss()"
            class="modal-chapter-item ripple-item"
          >
            <div class="chapter-icon-box" [class]="getIconColorClass(i)">
              <ion-icon name="bookmark"></ion-icon>
            </div>
            
            <div class="chapter-details">
              <span class="chapter-title">{{ page.PageTitle }}</span>
            </div>
            
            <div class="chapter-end-wrap">
              <span class="chapter-count-badge">{{ page.Duas?.length || 0 }}</span>
              <ion-icon name="chevron-forward" class="chapter-chevron"></ion-icon>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
  `,
  styles: [`
    /* Force Light Mode variables */
    :host {
      --modal-bg: #f2f2f7;
      --modal-card-bg: #ffffff;
      --modal-card-border: rgba(0, 0, 0, 0.05);
      --modal-text-main: #1c1c1e;
      --modal-text-muted: #8e8e93;
      --modal-accent: #007aff;
      --modal-accent-rgb: 0, 122, 255;
      --modal-search-bg: rgba(0, 0, 0, 0.04);
      --modal-badge-bg: rgba(0, 122, 255, 0.08);
      --modal-list-item-hover: rgba(0, 0, 0, 0.02);
      
      --glass-bg: rgba(255, 255, 255, 0.85);
      --glass-border: rgba(0, 0, 0, 0.06);
    }

    /* Dark Mode variables override */
    @media (prefers-color-scheme: dark) {
      :host {
        --modal-bg: #000000;
        --modal-card-bg: #1c1c1e;
        --modal-card-border: rgba(255, 255, 255, 0.06);
        --modal-text-main: #f5f5f7;
        --modal-text-muted: #86868b;
        --modal-accent: #0a84ff;
        --modal-accent-rgb: 10, 132, 255;
        --modal-search-bg: rgba(255, 255, 255, 0.06);
        --modal-badge-bg: rgba(10, 132, 255, 0.12);
        --modal-list-item-hover: rgba(255, 255, 255, 0.03);
        
        --glass-bg: rgba(28, 28, 30, 0.85);
        --glass-border: rgba(255, 255, 255, 0.05);
      }
    }

    /* Active theme overrides from document body class */
    :host-context(body.light) {
      --modal-bg: #f2f2f7 !important;
      --modal-card-bg: #ffffff !important;
      --modal-card-border: rgba(0, 0, 0, 0.05) !important;
      --modal-text-main: #1c1c1e !important;
      --modal-text-muted: #8e8e93 !important;
      --modal-accent: #007aff !important;
      --modal-accent-rgb: 0, 122, 255 !important;
      --modal-search-bg: rgba(0, 0, 0, 0.04) !important;
      --modal-badge-bg: rgba(0, 122, 255, 0.08) !important;
      --modal-list-item-hover: rgba(0, 0, 0, 0.02) !important;
      --glass-bg: rgba(255, 255, 255, 0.85) !important;
      --glass-border: rgba(0, 0, 0, 0.06) !important;
    }

    :host-context(body.dark) {
      --modal-bg: #000000 !important;
      --modal-card-bg: #1c1c1e !important;
      --modal-card-border: rgba(255, 255, 255, 0.06) !important;
      --modal-text-main: #f5f5f7 !important;
      --modal-text-muted: #86868b !important;
      --modal-accent: #0a84ff !important;
      --modal-accent-rgb: 10, 132, 255 !important;
      --modal-search-bg: rgba(255, 255, 255, 0.06) !important;
      --modal-badge-bg: rgba(10, 132, 255, 0.12) !important;
      --modal-list-item-hover: rgba(255, 255, 255, 0.03) !important;
      --glass-bg: rgba(28, 28, 30, 0.85) !important;
      --glass-border: rgba(255, 255, 255, 0.05) !important;
    }

    /* Toolbar & Glass Headers */
    .apple-header-glass {
      background: var(--glass-bg) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      border-bottom: 0.5px solid var(--glass-border) !important;
    }

    .apple-toolbar-glass {
      --background: transparent !important;
      --border-width: 0px !important;
      border: none !important;
      padding: 8px 12px !important;
      display: flex !important;
      align-items: center !important;
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

    /* Content & Layout Container */
    .modal-content-bg {
      --background: var(--modal-bg) !important;
    }

    .modal-layout-container {
      display: flex;
      flex-direction: column;
      max-width: 600px;
      margin: 0 auto;
      padding: 4px 4px 40px 4px;
      box-sizing: border-box !important;
      width: 100%;
    }

    /* Section Header */
    .apple-section-header {
      margin: 4px 6px 12px 6px;
    }

    .apple-section-title {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--modal-text-muted);
      letter-spacing: 0.5px;
      font-family: var(--font-family-heading);
    }

    /* Redesigned Apple Grouped List */
    .apple-grouped-list-modal {
      background: var(--modal-card-bg);
      border: 0.5px solid var(--modal-card-border);
      border-radius: 14px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      width: 100%;
      box-sizing: border-box;
    }

    .modal-chapter-item {
      text-decoration: none;
      color: inherit;
      background: transparent;
      border-bottom: 0.5px solid var(--modal-card-border);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      width: 100%;
      box-sizing: border-box;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: var(--modal-list-item-hover);
      }

      /* Premium Chapter Icon Container */
      .chapter-icon-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        font-size: 16px;
        flex-shrink: 0;

        /* Accented icon backgrounds */
        &.icon-purple { color: #5e5ce6; background: rgba(94, 92, 230, 0.1); }
        &.icon-green { color: #34c759; background: rgba(52, 199, 89, 0.1); }
        &.icon-orange { color: #ff9500; background: rgba(255, 149, 0, 0.1); }
        &.icon-gray { color: var(--modal-text-muted); background: var(--modal-search-bg); }
        &.icon-blue { color: var(--modal-accent); background: rgba(var(--modal-accent-rgb), 0.1); }
        &.icon-teal { color: #30b0c6; background: rgba(48, 176, 198, 0.1); }
        &.icon-pink { color: #ff2d55; background: rgba(255, 45, 85, 0.1); }
      }

      .chapter-details {
        display: flex;
        flex-direction: column;
        gap: 1px;
        flex: 1;
        min-width: 0; /* Important for flex truncation prevention */
      }

      .chapter-title {
        font-family: var(--font-family-sans);
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--modal-text-main);
        line-height: var(--tamil-line-height, 1.4);
        /* Secure word fitting */
        word-wrap: break-word;
        white-space: normal;
      }

      .chapter-end-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }

      .chapter-count-badge {
        font-family: var(--font-family-sans);
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--modal-accent);
        background: var(--modal-badge-bg);
        padding: 3px 8px;
        border-radius: 50px;
      }

      .chapter-chevron {
        font-size: 13px;
        color: var(--modal-text-muted);
        opacity: 0.5;
      }
    }

    /* Micro Animations */
    .ripple-item {
      position: relative;
      overflow: hidden;
      transition: background-color 0.15s ease, transform 0.15s ease;

      &:active {
        transform: scale(0.99);
        background-color: var(--modal-list-item-hover);
      }
    }
  `]
})
export class DuaListModalComponent {
  @Input() duaPages: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
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
