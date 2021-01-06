import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { AlertService } from 'src/app/_services';
import { UserService } from 'src/app/_firebases/user.service';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
// import { $ } from 'protractor';
declare let $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  avatar = '/assets/image/default-user-image.png';
  useShortName: boolean;
  language: boolean;
  private uploader: FileUploader;
  private response: any;

  constructor(
    private router: Router,
    private userService: UserService,
    public authenticationService: AuthenticationService,
    private alertService: AlertService,
    private cloudinary: Cloudinary,
    private http: HttpClient
  ) {
    // Set cloudinary config from angular to jquery
    $.cloudinary.config(this.cloudinary.config());
  }

  ngOnInit() {
    const { currentUserValue, useShortName, language } = this.authenticationService;
    this.useShortName = useShortName;
    this.language = language;
    this.userService.getUser(currentUserValue.id)
      .subscribe(doc => {
        let user: any = doc.payload.data();
        if (user.useShortName) {
          this.useShortName = user.useShortName;
        }
        if (user.language) {
          this.language = user.language;
        }
      });

    this.configUploaderToCloudinary();

    // https://res.cloudinary.com/longhome87/image/upload/v1609919847/checklist/wmvcjjd3ug1zbciktvs8.png
  }

  Save() {
    const { currentUserValue } = this.authenticationService;
    const self = this;
    let params = {
      ...currentUserValue,
      useShortName: this.useShortName,
      language: this.language
    }
    this.userService.updateUser(params).then(data => {
      this.authenticationService.useShortName = self.useShortName;
      this.alertService.success('Save setting successfully!!!')
    })

    // Delete old image of user from cloudinary
    if (this.response) {
      // Access to XMLHttpRequest at 'https://api.cloudinary.com/v1_1/longhome87/image/destroy'
      // from origin 'http://localhost:4200' has been blocked by CORS policy: Request header 
      // field authorization is not allowed by Access-Control-Allow-Headers in preflight response.
      this.deleteImage(this.response);
    }

    // Remove all the item on queue except the last item
    this.uploader.queue.splice(0, this.uploader.queue.length - 1);
    this.uploader.uploadAll();
  }

  editAccount() {
    console.log("edit account");

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  handlerAvatar(event) {
    let self = this;
    let file = event.target.files[0];
    if (!file) {
      return;
    }

    let fileReader = new FileReader();
    if (file.size > 1000000) {
      this.alertService.error('Chọn lại ảnh, chọn ảnh dưới 1MB');
      return;
    }
    fileReader.onloadend = function (e) {
      self.avatar = fileReader.result.toString();
    }

    fileReader.readAsDataURL(file);
  }

  configUploaderToCloudinary() {
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: false,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };

    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = 'checklist-user';
      // Add custom tags
      form.append('tags', tags);
      // Add file to upload
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    this.uploader.response.subscribe((res: any) => {
      this.response = JSON.parse(res);
      console.log(this.response);
    });

    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
      // console.log(item.file);
      // console.log(status);
      // console.log(response);
    };

    this.uploader.onProgressItem = (fileItem: any, progress: any) => {
      // console.log(fileItem);
      // console.log(progress);
    };
  }

  // Delete an uploaded image
  // Requires setting "Return delete token" to "Yes" in your upload preset configuration
  // See also https://support.cloudinary.com/hc/en-us/articles/202521132-How-to-delete-an-image-from-the-client-side-
  deleteImage(data: any) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };
    const options = { headers: headers };
    const body = {
      token: data.delete_token
    };
    this.http.post(url, body, options).subscribe(response => {
      console.log(`Deleted image - ${data.public_id} ${response['result']}`);
      // Remove deleted item for responses
      // this.responses.splice(index, 1);
    }, error => {
      console.log(error);

      console.log('Use delete_by_token function from cloudinary jquery');
      $.cloudinary.delete_by_token(this.response.delete_token);
    });
  };

}
