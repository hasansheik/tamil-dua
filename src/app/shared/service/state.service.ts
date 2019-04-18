import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private selectedPage : any;
  private dataSubject = new BehaviorSubject(this.selectedPage);
  observableSelectedPage = this.dataSubject.asObservable();
  constructor(private stateService : StateService) { }

  public log()
  {
    console.log("Hello World!");
  }

  setSelectedPage(pageSelected) {
    this.selectedPage = pageSelected;
    this.dataSubject.next(this.selectedPage);
  }
}
