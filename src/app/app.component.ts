import { Component, Injector } from '@angular/core';

import { Platform, ToastController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { getBootstrapListener } from '@angular/router/src/router_module';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { StateService } from './shared/service/state.service';
import { DuaService } from './shared/service/dua.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  public appPages = [
    // {
    //   title: 'Home',
    //   url: '/home',
    //   icon: 'home'
    // },
    //  {
    //    title: 'List',
    //    url: '/list',
    //    icon: 'list'
    //  },
    // {
    //   title: 'DuaContainer',
    //   url: '/DuaListContainer',
    //   icon: 'list'
    // }
  ];

  constructor(
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, 
    private stateService: StateService,
    private injector: Injector,
    private duaService: DuaService,
    private toast: ToastController
      ) {
    this.initializeApp();
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.duaService.getDuaPageList();
    });

 
    this.duaService.observablePageList.subscribe(
      (data) => {this.appPages = data;}
    );
}
  selectedpage= 0;
  
  goto(id){
    //const stateservice = this.injector.get(StateService);
    //this.stateService.log();
    this.stateService.setSelectedPage(id);
    //this.router.navigate(['/list', {id: 123}])
  }
}
 