import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayLogicDialogComponent } from './display-logic-dialog.component';

describe('ToolbarComponent', () => {
  let component: DisplayLogicDialogComponent;
  let fixture: ComponentFixture<DisplayLogicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayLogicDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayLogicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
