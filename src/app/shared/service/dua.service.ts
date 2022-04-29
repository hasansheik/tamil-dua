import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {} from '@ionic/angular'
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { promise } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class DuaService {

  private pageList =[];
  private pageListSubject = new BehaviorSubject(this.pageList);
  observablePageList = this.pageListSubject.asObservable();
  private static lastDuaId = '2224867c-90f3-4311-9f35-5e0a7f4467d1';

  private static _instance: DuaService;


  public static get Instance()
  {
      // Do you need arguments? Make it a regular static method instead.
      return this._instance;
  }

  private duaPageArray: any;

  getDuaPageList() {
    if (DuaService._instance == undefined || DuaService._instance == null ) {
      if (this.pageList.length == 0) {
        this.http.get('assets/data/duaPages.json').toPromise().then(
          (data) => {
            this.duaPageArray = data;
            this.pageList = [];
            this.pageList.push({ title: 'முகவுரை', url: '/home', icon: 'mail' })
  
            //console.log(this.duaPageArray);
            for (let page of this.duaPageArray) {
              console.log(page.PageTitle);
              var menu = {
                title: page.PageTitle,
                url: '/folder/' + page.Id,
                icon: 'star',
                Id: page.Id
              };
              this.pageList.push(menu);
              console.log(menu);
            }
            this.pageListSubject.next(this.pageList);
            if ( DuaService._instance == undefined || DuaService._instance == null) {
              DuaService._instance = this;
            }
  
            // console.log(JSON.stringify(data)); 
          }
        ).catch((err) => { console.log(err) });
      }
      else {
        this.pageListSubject.next(this.pageList);
      }
    }
    else {
      
      this.pageListSubject.next(DuaService.Instance.pageList);
    }
  }

  constructor(private http: HttpClient) { }

  private _productURL = 'assets/data/1adhan.json';    

  getDua(): Promise<any> {
    return this.http.get('assets/data/duaPages.json').toPromise()
    // return new Promise(resolve => {
    //   this.http.get('assets/data/1adhan.json').pipe(map(data => {})).subscribe(result => {
    //     resolve(result);
    //   });
    // });
  }

  getLastDuaId(){
      return DuaService.lastDuaId;
  }

  getDuaById(id):any {
    if (this.duaPageArray )
    {
      for(let page of this.duaPageArray){
        if ( page.Id == id) {
          DuaService.lastDuaId = id;
          console.log("setting last dua id : "+id);
          return page;
        }
      }
    }
  }
}
