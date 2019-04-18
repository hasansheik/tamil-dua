import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StateService } from '../shared/service/state.service';
import { DuaService } from '../shared/service/dua.service';
import { Http } from '@angular/http';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
  providers: [Http]
})
export class ListPage implements OnInit {
  public appPages = [];
  
  constructor(private route: ActivatedRoute, 
    private stateService: StateService, 
    private duaService: DuaService,
    private router: Router) {
    
    this.duaService.observablePageList.subscribe(
      (data) => {this.appPages = data}
    );
  }

  ngOnInit() {
  
  }
  goto(id){
    //const stateservice = this.injector.get(StateService);
    //this.stateService.log();
    this.stateService.setSelectedPage(id);
    //this.router.navigate(['/list', {id: 123}])
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
