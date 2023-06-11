import { Component, OnInit } from '@angular/core';
import { DuaService } from '../service/dua.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {
  bookmarkedDuas: any[] = [];

  constructor(private duaService: DuaService, private platform: Platform) { }

  ngOnInit() {
    this.loadBookmarkedDuas();
  }

  loadBookmarkedDuas() {
    const bookmarkedIds = this.duaService.getBookmarkedItems();
    this.duaService.observablePageList.subscribe((data) => {
      this.bookmarkedDuas = [];
      bookmarkedIds.forEach((id) => {
        const dua = this.duaService.getDuaById(id);
        if (dua) {
          this.bookmarkedDuas.push(dua);
        }
      });
    });
  }
}
