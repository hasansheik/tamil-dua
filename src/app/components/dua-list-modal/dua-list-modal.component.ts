import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dua-list-modal',
  template: `
    <ion-header>
      <ion-toolbar class="modal-toolbar">
        <ion-title class="modal-title">அனைத்து துஆக்கள்</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()" class="modal-close-btn">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="modal-content">
      <ion-list class="modal-list">
        <ion-item *ngFor="let page of duaPages" 
                  [routerLink]="['/folder', page.PageId]" 
                  (click)="dismiss()"
                  class="modal-item ripple"
                  button
                  detail="false">
          <div class="modal-item-inner">
            <ion-icon name="book" class="modal-item-icon"></ion-icon>
            <ion-label class="modal-item-label">{{ page.PageTitle }}</ion-label>
            <div class="modal-item-end">
              <ion-badge class="modal-badge">{{ page.Duas?.length || 0 }}</ion-badge>
              <ion-icon name="chevron-forward" class="modal-chevron"></ion-icon>
            </div>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    .modal-toolbar {
      --background: linear-gradient(135deg, var(--ion-color-primary), var(--ion-color-primary-shade));
      --color: var(--ion-color-primary-contrast);
      
      .modal-title {
        font-family: var(--font-family-heading);
        font-weight: 700;
        font-size: 1.15rem;
      }
      
      .modal-close-btn {
        --color: var(--ion-color-primary-contrast);
      }
    }

    .modal-content {
      --background: var(--ion-background-color);
    }

    .modal-list {
      background: transparent;
      padding: 12px 8px;
    }

    .modal-item {
      --background: var(--ion-card-background);
      margin: 4px 0;
      border-radius: 10px;
      border: 1px solid var(--ion-border-color);
      transition: var(--premium-transition);
      --min-height: auto;
      
      &::part(native) {
        padding: 0;
      }

      &:hover {
        --background: rgba(var(--ion-color-primary-rgb), 0.04);
        border-color: rgba(var(--ion-color-primary-rgb), 0.15);
      }

      .modal-item-inner {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 12px 14px;
        gap: 12px;
      }

      .modal-item-icon {
        font-size: 18px;
        color: var(--ion-color-primary);
        opacity: 0.8;
      }

      .modal-item-label {
        font-family: var(--font-family-sans);
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--ion-text-color);
      }

      .modal-item-end {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;
      }

      .modal-badge {
        --background: rgba(var(--ion-color-primary-rgb), 0.08);
        --color: var(--ion-color-primary);
        font-family: var(--font-family-sans);
        font-size: 0.75rem;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 10px;
      }

      .modal-chevron {
        font-size: 14px;
        color: var(--ion-color-medium);
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
}
