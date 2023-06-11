import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItemPage } from './menu-item.page';

describe('MenuItemPage', () => {
  let component: MenuItemPage;
  let fixture: ComponentFixture<MenuItemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MenuItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
