import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSignalementComponent } from './admin-signalement.component';

describe('AdminSignalementComponent', () => {
  let component: AdminSignalementComponent;
  let fixture: ComponentFixture<AdminSignalementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSignalementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSignalementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
