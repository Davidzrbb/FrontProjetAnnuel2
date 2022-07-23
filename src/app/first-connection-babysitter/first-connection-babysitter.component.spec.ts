import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstConnectionBabysitterComponent } from './first-connection-babysitter.component';

describe('FirstConnectionBabysitterComponent', () => {
  let component: FirstConnectionBabysitterComponent;
  let fixture: ComponentFixture<FirstConnectionBabysitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstConnectionBabysitterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstConnectionBabysitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
