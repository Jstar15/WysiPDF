import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuillEditorDialogComponent } from './quill-editor.dialog.component';

describe('ToolbarComponent', () => {
  let component: QuillEditorDialogComponent;
  let fixture: ComponentFixture<QuillEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuillEditorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
