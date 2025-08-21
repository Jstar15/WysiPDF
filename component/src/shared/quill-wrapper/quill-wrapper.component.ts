import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  NgZone, AfterViewInit,
} from '@angular/core';

import {MatDialog} from "@angular/material/dialog";
import {TokenAttribute} from "../../models/TokenAttribute";
import {AddTokenDialogComponent} from "../../dialogs/attribute-select-dialog/add-token-dialog.component";
import {CustomElementBlot} from "./CustomElementBlot";
import Quill from 'quill';
import {HtmlBlockContainer} from "../../models/interfaces";
import {HtmlToStructuredContentService} from "../../services/html-to-structured-content.service"; // <-- includes themes


@Component({
  standalone: true,
  selector: 'app-quill-wrapper',
  templateUrl: './quill-wrapper.component.html',
  styleUrls: ['./quill-wrapper.component.scss']
})
export class QuillWrapperComponent implements OnInit, AfterViewInit  {
  @Input() html: string = '';
  @Input() attributeArray: TokenAttribute[];
  @Output() htmlChange = new EventEmitter<string>();
  @Output() htmlBlockContainerChange = new EventEmitter<HtmlBlockContainer>();



  zone: NgZone;
  delta:any;
  currentRange:any;

  toolbarId = `toolbar-${Math.random().toString(36).substring(2, 10)}`;
  editorId = `editor-${Math.random().toString(36).substring(2, 10)}`;

  constructor(private htmlToStructuredContentService: HtmlToStructuredContentService, public dialog: MatDialog) {}

  quill:any;
  textChangeEvent: any;
  formats: [
    "background",
    "bold",
    "color",
    "font",
    "italic",
    "size",
    "underline",
    "align"
  ];


  ngOnInit(): void {
    CustomElementBlot['blotName'] = 'mathjax';
    CustomElementBlot['className'] = 'ql-mathjax';
    CustomElementBlot['tagName'] = 'SPAN';

    // ✅ Register custom fonts
    const Font:any = Quill.import('formats/font');
    Font.whitelist = [
      'roboto',
      'raleway',
      'lato',
      'nunito',
      'playfair',
      'ibmmono',
      'cormorant',
      'opensans'
    ];
    Quill.register(CustomElementBlot);

    const SizeStyle: any = Quill.import('attributors/style/size');
    SizeStyle.whitelist = ['8px', '10px', '12px', '14px', '16px', '18px', '24px', '32px', '48px'];
    Quill.register(SizeStyle, true);

  }

  ngAfterViewInit(): void {
    console.log('Toolbar element exists:', !!document.getElementById(this.toolbarId));

    // Set module properties





    let modules = {
      table: true,
      toolbar: `#${this.toolbarId}`
    };

    this.quill = new Quill(`#${this.editorId}`, {
      modules: modules,
      formats: this.formats,
      placeholder: 'Compose here...',
      theme: 'snow'  // or 'bubble'
    });

    this.quill.root.innerHTML = this.html;

    this.textChangeEvent = this.quill.on('text-change',
      (delta: any, oldDelta: any, source: string): void => {
        this.delta = oldDelta;
        let html: string | null = this.quill.root.innerHTML;
        const htmlBlockContainer: HtmlBlockContainer = this.htmlToStructuredContentService.convertHTmlToObject(html);
        this.htmlChange.emit(html);
        this.htmlBlockContainerChange.emit(htmlBlockContainer)
        this.currentRange =this.quill.getSelection(true);
        console.log(oldDelta)
        console.log(html)
      }
    );
  }



  addTable(row:number, column:number){
    const table = this.quill.getModule('table');
    table.insertTable(row, column)
  }

  deleteTable() {
    const table = this.quill.getModule('table');
    table.deleteTable();
  }

  openDialog(): void {
    this.currentRange =this.quill.getSelection(true);
    const dialogRef = this.dialog.open(AddTokenDialogComponent, {
      width: '300px',
      data: {data: this.attributeArray}
    });

    dialogRef.afterClosed().subscribe((result:TokenAttribute) => {
      if(result != null){

        this.quill.insertEmbed(this.currentRange.index, 'mathjax', result);
      }
    });
  }
}

