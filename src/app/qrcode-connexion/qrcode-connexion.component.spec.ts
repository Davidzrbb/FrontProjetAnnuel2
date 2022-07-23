import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeConnexionComponent } from './qrcode-connexion.component';

describe('QrcodeConnexionComponent', () => {
  let component: QrcodeConnexionComponent;
  let fixture: ComponentFixture<QrcodeConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodeConnexionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
