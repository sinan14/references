import { Component, Input } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpProgressEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { ImageInfo } from './upload.component';

@Component({
    selector: 'my-dialog',
    styles: [`
        my-upload {
            min-width: 175px;
            max-width: 275px;
        }

        label {
            width: 100px;
        }
    `],
    template: `
    <kendo-dialog title="Insert Image" *ngIf="opened" (close)="close()" [minWidth]="250" [width]="450">
        <div class="row example-wrapper">
            <div class="col-xs-8 col-sm-12 example-col">
                <div class="card">
                    <div class="card-block">
                        <form class="k-form-inline">
                            <div class="k-form-field">
                                <label>Image</label>
                                <my-upload (valueChange)="setImageInfo($event)">
                                </my-upload>
                            </div>
                            <div class="k-form-field">
                                <label [for]="heightInput">Height (px)</label>
                                <kendo-numerictextbox #heightInput format="n0" [(value)]="height" [min]="0">
                                </kendo-numerictextbox>
                            </div>
                            <div class="k-form-field">
                                <label [for]="widthInput">Width (px)</label>
                                <kendo-numerictextbox #widthInput format="n0" [(value)]="width" [min]="0">
                                </kendo-numerictextbox>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <kendo-dialog-actions>
            <button kendoButton (click)="close()">Cancel</button>
            <button kendoButton [disabled]="canInsert" (click)="uploadImage()" primary="true">Insert</button>
        </kendo-dialog-actions>
    </kendo-dialog>
`
})

export class DialogComponent implements HttpInterceptor {
    @Input() public editor: EditorComponent;

    public opened = false;
    public src: string;
    public height: number;
    public width: number;

    public get canInsert(): boolean {
        return !this.src;
    }

    public uploadImage(): void {
        // Invoking the insertImage command of the Editor.
        this.editor.exec('insertImage', this.imageInfo);

        // Closing the Dialog.
        this.close();
    }

    public get imageInfo(): ImageInfo {
        return {
            src: this.src,
            height: this.height,
            width: this.width
        };
    }

    public setImageInfo(value: ImageInfo) {
        if (value) {
            this.src = value.src;
            this.height = value.height;
            this.width = value.width;
        } else {
            this.resetData();
        }
    }

    public open(): void {
        this.opened = true;
    }

    public close(): void {
        this.opened = false;
        this.resetData();
    }

    public resetData(): void {
        this.src = null;
        this.width = null;
        this.height = null;
    }

    /*
        Mocked backend service.
        For further details, check
        https://angular.io/guide/http#writing-an-interceptor
   */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url === 'saveUrl' || req.url === 'removeUrl') {
            return of(new HttpResponse({ status: 200 }));
        }

        return next.handle(req);
    }
}
