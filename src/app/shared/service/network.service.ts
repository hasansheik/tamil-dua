import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private networkStatus = new BehaviorSubject<boolean>(true);

  constructor() {
    this.initializeNetworkMonitoring();
  }

  private async initializeNetworkMonitoring() {
    // Get initial network status
    const status = await Network.getStatus();
    this.networkStatus.next(status.connected);

    // Listen for network status changes
    Network.addListener('networkStatusChange', (status) => {
      this.networkStatus.next(status.connected);
    });
  }

  // Get current network status
  async isOnline(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }

  // Get network status as Observable
  getNetworkStatus(): Observable<boolean> {
    return this.networkStatus.asObservable();
  }
}
