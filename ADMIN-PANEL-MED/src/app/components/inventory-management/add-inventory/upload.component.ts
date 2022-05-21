import { Component } from '@angular/core';

@Component({
  selector: 'my-upload',
  template: `
  <kendo-upload  style="background: #052a3d;"
    [saveUrl]="uploadSaveUrl"
    [removeUrl]="uploadRemoveUrl">
  </kendo-upload>
  `
})
export class UploadComponent {
  uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint
}

