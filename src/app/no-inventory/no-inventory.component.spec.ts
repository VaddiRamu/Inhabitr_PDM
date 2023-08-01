import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoInventoryComponent } from './no-inventory.component';

describe('NoInventoryComponent', () => {
  let component: NoInventoryComponent;
  let fixture: ComponentFixture<NoInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
