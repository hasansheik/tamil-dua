import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DuaService } from './shared/service/dua.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
      
  ];
  public labels = [];
  constructor( private platform: Platform, private duaService: DuaService) {
    this.InitializeApp();
  } 

  InitializeApp(){
    this.platform.ready().then(() => {
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
    //this.stateService.setSelectedPage(id);
    //this.router.navigate(['/list', {id: 123}])
  }
}
