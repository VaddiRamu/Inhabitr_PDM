import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoombuilderComponent } from './roombuilder.component';

describe('RoombuilderComponent', () => {
  let component: RoombuilderComponent;
  let fixture: ComponentFixture<RoombuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoombuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoombuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
