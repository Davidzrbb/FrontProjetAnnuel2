import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeUserComponent } from './subscribe-user.component';

describe('SubscribeUserComponent', () => {
  let component: SubscribeUserComponent;
  let fixture: ComponentFixture<SubscribeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribeUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
