import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuItemPageRoutingModule } from './menu-item-routing.module';

import { MenuItemPage } from './menu-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuItemPageRoutingModule
  ],
  declarations: [MenuItemPage]
})
export class MenuItemPageModule {}
