import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlContractComponent } from './html-contract.component';

describe('HtmlContractComponent', () => {
  let component: HtmlContractComponent;
  let fixture: ComponentFixture<HtmlContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmlContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
