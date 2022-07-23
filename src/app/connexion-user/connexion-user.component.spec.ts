import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnexionUserComponent } from './connexion-user.component';

describe('ConnexionUserComponent', () => {
  let component: ConnexionUserComponent;
  let fixture: ComponentFixture<ConnexionUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnexionUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnexionUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
