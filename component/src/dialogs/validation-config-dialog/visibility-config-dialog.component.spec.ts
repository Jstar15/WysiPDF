import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilityConfigDialogComponent } from './visibility-config-dialog.component';

describe('ToolbarComponent', () => {
  let component: VisibilityConfigDialogComponent;
  let fixture: ComponentFixture<VisibilityConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisibilityConfigDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibilityConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
