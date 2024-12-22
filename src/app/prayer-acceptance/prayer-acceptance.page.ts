import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-prayer-acceptance',
  templateUrl: './prayer-acceptance.page.html',
  styleUrls: ['./prayer-acceptance.page.scss'],
})
export class PrayerAcceptancePage implements OnInit {
  data: any[] = [];
  dataFile: string = "";
  PageTitle: String = "Prayer Acceptance";
  constructor(private http: HttpClient, private route: ActivatedRoute) {

  }
  ngOnInit() {

    this.route.params
      .subscribe(params => {
        const id = params['id'];
        if (id == "1") {
          this.PageTitle = "முன்னுரை";
          this.dataFile = "BookPreface.json";
        }
        else if (id == 2) {
          this.PageTitle = "பிரார்த்தனைகளும் அது சம்பந்தப்பட்டவைகளும்";
          this.dataFile = "PrayerAcceptance.json";
        }
        else if (id == 3) {
          this.PageTitle = "சத்தியத்தைத் தேடும் உள்ளங்களே!";
          this.dataFile = "InSearchOfTruth.json";

        }
        else if (id == 4) {
          this.PageTitle = "முந்தைய பதிப்புகளின் துஆக்கள் மற்றும் திருத்தங்கள்";
          this.dataFile = "Corrections.json";

        }


        this.loadData(id);
      });



    // this.http.get<any[]>('assets/data/preface1.json').subscribe(
    //   (response) => {
    //     this.data = response;
    //   },
    //   (error) => {
    //     console.error('Error fetching data:', error);
    //   }
    // );
  }

  loadData(id: string) {
    let filePath = `assets/data/${this.dataFile}`;
    this.http.get<any[]>(filePath).subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
