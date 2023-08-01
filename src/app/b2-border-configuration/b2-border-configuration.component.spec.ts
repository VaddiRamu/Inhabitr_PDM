import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2BOrderConfigurationComponent } from './b2-border-configuration.component';

describe('B2BOrderConfigurationComponent', () => {
  let component: B2BOrderConfigurationComponent;
  let fixture: ComponentFixture<B2BOrderConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2BOrderConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2BOrderConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
