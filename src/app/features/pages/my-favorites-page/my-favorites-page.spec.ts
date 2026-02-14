import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFavoritesPage } from './my-favorites-page';

describe('MyFavoritesPage', () => {
  let component: MyFavoritesPage;
  let fixture: ComponentFixture<MyFavoritesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFavoritesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFavoritesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
