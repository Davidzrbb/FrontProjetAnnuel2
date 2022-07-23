import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSignalementProfileComponent } from './admin-signalement-profile.component';

describe('AdminSignalementProfileComponent', () => {
  let component: AdminSignalementProfileComponent;
  let fixture: ComponentFixture<AdminSignalementProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSignalementProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSignalementProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
