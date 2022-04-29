import { Component } from '@angular/core';
import { Platform, IonRouterOutlet, NavController } from '@ionic/angular';
import { DuaService } from './shared/service/dua.service';
import { App } from '@capacitor/app';

// import { App } from '@capacitor/app';
//import { Location } from '@angular/common';
// import { alertController } from '@ionic/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
      
  ];
  public labels = [];
  constructor( private platform: Platform, private duaService: DuaService, private navController: NavController
    // ,private routerOutlet: IonRouterOutlet,
    // private _location: Location
    ) {
    this.InitializeApp();
  } 

  InitializeApp(){
    this.platform.ready().then(() => {
      this.duaService.getDuaPageList();
    });

    this.duaService.observablePageList.subscribe(
      (data) => {this.appPages = data;}
    );

    this.addBackButtonHandler();
  }
  selectedpage= 0;



addBackButtonHandler(){

  App.addListener('backButton', ({canGoBack}) => {
    if(!canGoBack){
      App.exitApp();
    } else {
      if ( window.location.href.match("(settings+)") ){
        this.navController.navigateBack('/folder/2224867c-90f3-4311-9f35-5e0a7f4467d1');
      }
      else {
        window.history.back();
      }
    }
  });
  // this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
  //   console.log('Back press handler!');
  //   if (this._location.isCurrentPathEqualTo('/home')) {
  //     // Show Exit Alert!
  //     console.log('Show Exit Alert!');
  //     alert('exit the app');
  //     processNextHandler();
  //   } else {
  //     // Navigate to back page
  //     console.log('Navigate to back page');
  //     this._location.back();
  //   }
  // });

  // App.addListener('backButton', () =>
  // {
  //   if (this._location.isCurrentPathEqualTo('/home'))
  //   {
  //     navigator['app'].exitApp();
  //   } 
  //   else
  //   {
  //     this._location.back();
  //   }
  // });
}

  goto(id){
    //const stateservice = this.injector.get(StateService);
    //this.stateService.log();
    //this.stateService.setSelectedPage(id);
    //this.router.navigate(['/list', {id: 123}])
  }
}
