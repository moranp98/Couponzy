import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalComponent } from './modal.component';
import { UploaderComponent } from '../uploader/uploader.component';
import { UploadTaskComponent } from '../upload-task/upload-task.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ModalComponent],
    exports: [ModalComponent]
})
export class ModalModule { }