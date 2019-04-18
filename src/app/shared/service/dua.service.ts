import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {} from '@ionic/angular'
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { promise } from 'protractor';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable({
  providedIn: 'root'
})
export class DuaService {

  private pageList =[];
  private pageListSubject = new BehaviorSubject(this.pageList);
  observablePageList = this.pageListSubject.asObservable();

  private duaPageArray: any;

  getDuaPageList() {
    this.http.get('assets/data/duaPages.json').toPromise().then(
      (data) => {
        this.duaPageArray = data.json();
        for(let page of this.duaPageArray){
          this.pageList.push( {
            title: page.PageTitle,
            url:  '/DuaListContainer',
            icon: 'star',
            Id: page.Id
          });          
        }
        this.pageListSubject.next(this.pageList);
        console.log(data.json()); 
      }
    )
  }

  constructor(private http: Http) { }

  private _productURL = 'assets/data/1adhan.json';    

  getDua(): Promise<any> {
    return this.http.get('assets/data/duaPages.json').toPromise()
    // return new Promise(resolve => {
    //   this.http.get('assets/data/1adhan.json').pipe(map(data => {})).subscribe(result => {
    //     resolve(result);
    //   });
    // });
  }

  getDuaById(id):any {
    if (this.duaPageArray )
    {
      for(let page of this.duaPageArray){
        if ( page.Id == id) {
          return page;
        }
      }
    }
  }
}
