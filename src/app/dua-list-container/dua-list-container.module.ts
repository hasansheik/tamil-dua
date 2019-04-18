import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DuaListContainerPage } from './dua-list-container.page';

const routes: Routes = [
  {
    path: '',
    component: DuaListContainerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DuaListContainerPage]
})
export class DuaListContainerPageModule {}
