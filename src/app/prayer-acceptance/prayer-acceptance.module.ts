import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrayerAcceptancePageRoutingModule } from './prayer-acceptance-routing.module';

import { PrayerAcceptancePage } from './prayer-acceptance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrayerAcceptancePageRoutingModule
  ],
  declarations: [PrayerAcceptancePage]
})
export class PrayerAcceptancePageModule {}
