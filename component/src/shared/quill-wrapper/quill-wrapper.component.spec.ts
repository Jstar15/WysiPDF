import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuillWrapperComponent } from './quill-wrapper.component';

describe('ColorPickerComponent', () => {
  let component: QuillWrapperComponent;
  let fixture: ComponentFixture<QuillWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuillWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
