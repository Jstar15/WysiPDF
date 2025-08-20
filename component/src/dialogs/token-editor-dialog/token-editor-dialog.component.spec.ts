import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenEditorDialogComponent } from './token-editor-dialog.component';

describe('TokenEditorDialogComponent', () => {
  let component: TokenEditorDialogComponent;
  let fixture: ComponentFixture<TokenEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenEditorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
