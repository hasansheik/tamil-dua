import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  // Store data with a key
  async setData(key: string, data: any): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await Preferences.set({
        key,
        value: jsonData
      });
    } catch (error) {
      console.error('Error storing data:', error);
      throw error;
    }
  }

  // Get data by key
  async getData(key: string): Promise<any> {
    try {
      const result = await Preferences.get({ key });
      return result.value ? JSON.parse(result.value) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw error;
    }
  }

  // Remove data by key
  async removeData(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  // Clear all stored data
  async clearData(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // Check if data exists
  async hasData(key: string): Promise<boolean> {
    try {
      const result = await Preferences.get({ key });
      return !!result.value;
    } catch (error) {
      console.error('Error checking data:', error);
      throw error;
    }
  }

  // Get data as Observable
  getDataObservable(key: string): Observable<any> {
    return from(this.getData(key));
  }

  // Store data with timestamp
  async setDataWithTimestamp(key: string, data: any): Promise<void> {
    const dataWithTimestamp = {
      data,
      timestamp: new Date().getTime()
    };
    await this.setData(key, dataWithTimestamp);
  }

  // Get data with timestamp validation
  async getDataIfFresh(key: string, maxAgeMs: number): Promise<any> {
    const stored = await this.getData(key);
    if (!stored) return null;

    const now = new Date().getTime();
    if (now - stored.timestamp > maxAgeMs) {
      await this.removeData(key);
      return null;
    }
    return stored.data;
  }
}
