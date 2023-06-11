import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  pageTitle = 'தமிழ் துஆ';
  bookDescription = 'முஸ்லீம்களின் அன்றாடப் பிரார்தனைகள் எனும் நூலில் தொகுக்கப்பட்ட துஆக்களை, மொபைல் போன் பயன்பாட்டாளர்களின் வசதிக்காக இந்த ஆண்ட்ராய்டு அப்ளிகேஷனில் கொடுத்துள்ளோம்.';
  additionalLinks = [
    {
      label: 'ஜமாஅத்துல் முஸ்லிமீன், ஏத்தாலை, புத்தளம் - இலங்கை',
      url: 'http://onlinemuslims.blogspot.in/'
    }
  ];
  contactEmail = 'hasansexperiment@gmail.com';
  aboutBook = 'சகோதரர்களே "முஸ்லிம்களின் அன்றாடப் பிரார்த்தனைகள்" எனும் நூலை கணிணிப் படுத்த வேண்டும் என்ற விருப்பத்தில் அல்லாஹ்வின் பேரருளால் நான் செய்த இந்த சிறு முயற்சியை அல்லாஹ் பொருத்திக் கொண்டு, எனக்கும் என் குடும்பத்தாருக்கும் ஹிதாயத் அளிக்க துஆ செய்யுமாறு அன்போடு கேட்டுக் கொள்கின்றேன்.';
  duaListLabel = 'துஆ அட்டவணை';

  constructor() { }

  ngOnInit() {
  }
}
