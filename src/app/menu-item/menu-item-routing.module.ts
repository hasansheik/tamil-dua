import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuItemPage } from './menu-item.page';

const routes: Routes = [
  {
    path: '',
    component: MenuItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuItemPageRoutingModule {}
