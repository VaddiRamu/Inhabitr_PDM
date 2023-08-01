import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkletComponent } from './bookmarklet.component';

describe('BookmarkletComponent', () => {
  let component: BookmarkletComponent;
  let fixture: ComponentFixture<BookmarkletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
