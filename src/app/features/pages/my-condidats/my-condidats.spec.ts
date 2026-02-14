import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCondidats } from './my-condidats';

describe('MyCondidats', () => {
  let component: MyCondidats;
  let fixture: ComponentFixture<MyCondidats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCondidats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCondidats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
