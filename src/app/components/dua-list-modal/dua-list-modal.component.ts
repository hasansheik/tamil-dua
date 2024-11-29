import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dua-list-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>அனைத்து துஆக்கள்</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item *ngFor="let page of duaPages" 
                  [routerLink]="['/folder', page.PageId]" 
                  (click)="dismiss()"
                  button>
          <ion-icon name="book-outline" slot="start"></ion-icon>
          <ion-label>{{ page.PageTitle }}</ion-label>
          <ion-note slot="end">{{ page.Duas?.length || 0 }}</ion-note>
          <ion-icon name="chevron-forward" slot="end"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    ion-header ion-toolbar {
      --background: var(--ion-color-primary);
      --color: var(--ion-color-primary-contrast);
    }

    ion-content {
      --background: var(--ion-color-light);
    }

    ion-list {
      background: transparent;
      padding: 0;
    }

    :is(ion-item) {
      --padding-start: 8px;
      --padding-end: 8px;
      --min-height: 56px;
      margin: 4px 0;
      border-radius: 8px;
      --background: var(--ion-color-light);
      
      &:hover {
        --background: var(--ion-color-light-shade);
      }

      :is(ion-icon) {
        font-size: 20px;
        margin-right: 12px;
        color: var(--ion-color-medium);

        &[name="chevron-forward"] {
          margin-right: 0;
          font-size: 16px;
        }
      }

      :is(ion-label) {
        font-size: min(3.8vw, 15px);
        font-weight: 500;
        color: var(--ion-color-dark);
      }

      :is(ion-note) {
        font-size: min(3.2vw, 13px);
        padding: 4px 8px;
        border-radius: 12px;
        background: var(--ion-color-light-shade);
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
