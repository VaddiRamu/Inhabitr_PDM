import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMoodboardTableComponent } from './edit-moodboard-table.component';

describe('EditMoodboardTableComponent', () => {
  let component: EditMoodboardTableComponent;
  let fixture: ComponentFixture<EditMoodboardTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMoodboardTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMoodboardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
