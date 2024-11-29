import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { NetworkService } from './network.service';
import { firstValueFrom, BehaviorSubject, Observable } from 'rxjs';

const CACHE_KEY = 'dua_data';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

@Injectable({
  providedIn: 'root'
})
export class DuaService {
  private apiUrl = 'assets/data/duaPages.json';
  private duaData: any = null;
  private pageList: any[] = [];
  private pageListSubject = new BehaviorSubject<any[]>([]);
  observablePageList: Observable<any[]> = this.pageListSubject.asObservable();
  private loadingPromise: Promise<any> | null = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private networkService: NetworkService
  ) {}

  async loadDuaData() {
    try {
      // If already loading, return the existing promise
      if (this.loadingPromise) {
        console.log('DuaService - Already loading data'); 
        return this.loadingPromise;
      }

      console.log('DuaService - Loading data');

      // If data is already loaded, return it
      if (this.duaData) {
        console.log('DuaService - Using cached data');
        return this.duaData;
      }

      console.log('DuaService - Fetching fresh data');  
      // Create new loading promise
      this.loadingPromise = (async () => {
        try {
          console.log('DuaService - Loading data');
          const cachedData = await this.storageService.getData(CACHE_KEY);
          if (cachedData && !this.isCacheExpired(cachedData.timestamp)) {
            console.log('DuaService - Using cached data');
            this.duaData = cachedData.data;
            return this.duaData;
          }

          if (await this.networkService.isOnline()) {
            console.log('DuaService - Fetching fresh data');
            const response = await firstValueFrom(this.http.get(this.apiUrl));
            await this.storageService.setData(CACHE_KEY, {
              data: response,
              timestamp: Date.now()
            });
            this.duaData = response;
            return this.duaData;
          } else if (cachedData) {
            console.log('DuaService - Offline, using expired cache');
            this.duaData = cachedData.data;
            return this.duaData;
          }

          throw new Error('No data available offline and no cached data found');
        } finally {
          this.loadingPromise = null;
        }
      })();

      return this.loadingPromise;
    } catch (error) {
      console.error('DuaService - Error loading data:', error);
      this.loadingPromise = null;
      throw error;
    }finally {
      this.loadingPromise = null;
    }
  }

  private isCacheExpired(timestamp: number): boolean {
    return Date.now() - timestamp > CACHE_EXPIRY;
  }

  async getDuaById(id: string) {
    try {
      const data = await this.loadDuaData();
      return data?.find((dua: any) => dua.Id === id);
    } catch (error) {
      console.error('Error getting dua by id:', error);
      throw error;
    }
  }

  async getDuaGroupById(id: string) {
    try {
      console.log('DuaService - Getting dua group:', id);
      const data = await this.loadDuaData();
      console.log('DuaService - Loaded data:', data); 
      const group = data?.find((group: any) => group.Id === id);
      console.log('DuaService - Found group:', group ? 'yes' : 'no');
      console.log(group);
      return group;
    } catch (error) {
      console.error('DuaService - Error getting dua group:', error);
      throw error;
    }
  }

  async getAllDuaGroups() {
    try {
      const data = await this.loadDuaData();
      return data || [];
    } catch (error) {
      console.error('Error getting all dua groups:', error);
      throw error;
    }
  }

  async getFavoriteDuas(favoriteIds: string[]): Promise<any[]> {
    try {
      if (!favoriteIds || favoriteIds.length === 0) {
        return [];
      }

      const allDuas = await this.getAllDuas();
      return allDuas.filter(dua => favoriteIds.includes(dua.Id));
    } catch (error) {
      console.error('Error getting favorite duas:', error);
      throw error;
    }
  }

  async getAllDuas(): Promise<any[]> {
    try {
      const data = await this.loadDuaData();
      const allDuas: any[] = [];

      // Flatten all duas from all pages
      data?.forEach((page: any) => {
        if (page.DuaList && Array.isArray(page.DuaList)) {
          // Add page title reference to each dua
          const duasWithPageInfo = page.DuaList.map(dua => ({
            ...dua,
            PageTitle: page.PageTitle,
            PageId: page.Id
          }));
          allDuas.push(...duasWithPageInfo);
        }
      });

      return allDuas;
    } catch (error) {
      console.error('Error getting all duas:', error);
      throw error;
    }
  }

  async searchDuas(searchText: string): Promise<any[]> {
    try {
      if (!searchText || searchText.trim() === '') {
        return [];
      }

      const allDuas = await this.getAllDuas();
      const searchLower = searchText.toLowerCase();

      return allDuas.filter(dua => {
        // Safely check each field with null coalescing
        const title = dua.DuaTitle?.toLowerCase() ?? '';
        const arabic = dua.DuaContent?.ArabicDua?.toLowerCase() ?? '';
        const tamil = dua.DuaContent?.TamilDua?.toLowerCase() ?? '';
        const translation = dua.DuaContent?.Translation?.toLowerCase() ?? '';

        return title.includes(searchLower) ||
               arabic.includes(searchLower) ||
               tamil.includes(searchLower) ||
               translation.includes(searchLower);
      });
    } catch (error) {
      console.error('Error searching duas:', error);
      throw error;
    }
  }

  async getDuaPageList() {
    try {
      const data = await this.loadDuaData();
      
      // Create menu items from the data
      const menuItems = data.map((page: any) => ({
        title: page.PageTitle,
        url: `/folder/${page.Id}`,
        icon: 'book-outline',
        Id: page.Id
      }));

      // Add home page as first item
      const allPages = [
        { title: 'முகப்பு', url: '/home', icon: 'home-outline' },
        ...menuItems
      ];

      // Update the observable
      this.pageListSubject.next(allPages);
      
      return data;
    } catch (error) {
      console.error('Error getting dua page list:', error);
      return [];
    }
  }
}
