// image-compression.service.ts
import { Injectable } from '@angular/core';
import {NgxImageCompressService, UploadResponse} from 'ngx-image-compress';

@Injectable({ providedIn: 'root' })
export class ImageCompressionService {
  constructor(private imageCompress: NgxImageCompressService) {}



}
