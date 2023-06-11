import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DuaService {
  private pageList: any[] = [];
  private pageListSubject = new BehaviorSubject<any[]>(this.pageList);
  observablePageList = this.pageListSubject.asObservable();
  private static lastDuaId = '2224867c-90f3-4311-9f35-5e0a7f4467d1';

  private duaPageArray: any;
  private bookmarkedItems: string[] = [];

  constructor(private http: HttpClient) {
    this.getDuaPageList();
    this.loadBookmarkedItems();
  }

  getDuaPageList() {
    if (!this.pageList.length) {
      this.http.get('assets/data/duaPages.json').toPromise().then(
        (data: any) => {
          this.duaPageArray = data;
          this.pageList = [
            { title: 'முகவுரை', url: '/home', icon: 'book' }
          ];

          for (const page of this.duaPageArray) {
            const menu = {
              title: page.PageTitle,
              url: '/folder/' + page.Id,
              icon: 'radio-button-off',
              Id: page.Id
            };
            this.pageList.push(menu);
          }

          this.pageListSubject.next(this.pageList);
        }
      ).catch((err) => {
        console.log(err);
      });
    } else {
      this.pageListSubject.next(this.pageList);
    }
  }

  getDua(): Promise<any> {
    return this.http.get('assets/data/duaPages.json').toPromise();
  }

  getLastDuaId(): string {
    return DuaService.lastDuaId;
  }

  getDuaById(id: string): any {
    if (this.duaPageArray) {
      for (const page of this.duaPageArray) {
        if (page.Id === id) {
          DuaService.lastDuaId = id;
          return page;
        }
      }
    }
  }

  toggleBookmark(itemId: string) {
    const index = this.bookmarkedItems.indexOf(itemId);
    if (index !== -1) {
      // Item is already bookmarked, remove it from the bookmarkedItems array
      this.bookmarkedItems.splice(index, 1);
    } else {
      // Item is not bookmarked, add it to the bookmarkedItems array
      this.bookmarkedItems.push(itemId);
    }

    // Save the bookmarked items to localStorage
    this.saveBookmarkedItems();
  }

  isBookmarked(itemId: string): boolean {
    return this.bookmarkedItems.includes(itemId);
  }

  private saveBookmarkedItems() {
    localStorage.setItem('bookmarkedItems', JSON.stringify(this.bookmarkedItems));
  }

  private loadBookmarkedItems() {
    const savedItems = localStorage.getItem('bookmarkedItems');
    if (savedItems) {
      this.bookmarkedItems = JSON.parse(savedItems);
    }
  }

  getBookmarkedItems(): string[] {
    return this.bookmarkedItems;
  }
}
