import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrayerAcceptancePage } from './prayer-acceptance.page';

describe('PrayerAcceptancePage', () => {
  let component: PrayerAcceptancePage;
  let fixture: ComponentFixture<PrayerAcceptancePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayerAcceptancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
