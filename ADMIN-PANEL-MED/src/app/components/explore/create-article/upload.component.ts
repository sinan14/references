import { Component, Output, EventEmitter } from '@angular/core';
import { SelectEvent, FileInfo } from '@progress/kendo-angular-upload';

export interface ImageInfo {
    src: string;
    width: number;
    height: number;
}

@Component({
    selector: 'my-upload',
    template: `
        <kendo-upload
            [saveUrl]="uploadSaveUrl"
            [removeUrl]="uploadRemoveUrl"
            (select)="onSelect($event)"
            (remove)="onRemove()"
            [multiple]="true">
            <kendo-upload-messages select="Select image">
            </kendo-upload-messages>
        </kendo-upload>
`
})
export class UploadComponent {
    public uploadSaveUrl = 'saveUrl'; // Has to represent an actual API endpoint.
    public uploadRemoveUrl = 'removeUrl'; // Has to represent an actual API endpoint.
    
    public imageList :any = [];
    @Output() public valueChange: EventEmitter<ImageInfo> = new EventEmitter<ImageInfo>();

    public onSelect(ev: any): void {

        let setFlag :boolean = false;
        const reader = new FileReader();
        const file = ev.files[0].rawFile;
        console.log(file);
  
  
        const Img = new Image();
        Img.src = URL.createObjectURL(file);
  
        this.imageList.push(file);
        console.log(this.imageList);
      
        Img.onload = (e: any) => {
          console.log(e.path[0].naturalHeight);
          console.log(e.path[0].naturalWidth);
            this.valueChange.emit({
                                    src: Img.src,
                                    height: Img.height,
                                    width: Img.width
                                });


        // ev.files.forEach((file: FileInfo) => {
        //     if (file.rawFile) {
        //         const reader = new FileReader();

        //         reader.onloadend = () => {
        //             const img = new Image();

        //             img.src = <string>reader.result;
        //             img.onload = () => {
        //                 this.valueChange.emit({
        //                     src: img.src,
        //                     height: img.height,
        //                     width: img.width
        //                 });
        //             };
        //         };

        //         reader.readAsDataURL(file.rawFile);
        //     }
        // });
        }
    }

    public onRemove(): void {
        this.valueChange.emit(null);
    }
}
