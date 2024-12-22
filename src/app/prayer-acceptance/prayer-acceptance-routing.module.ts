import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrayerAcceptancePage } from './prayer-acceptance.page';

const routes: Routes = [
  {
    path: '',
    component: PrayerAcceptancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrayerAcceptancePageRoutingModule {}
