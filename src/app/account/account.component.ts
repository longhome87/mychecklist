import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { Site } from 'src/app/_until/constant';
import { AlertService } from 'src/app/_services';
import { UserService } from 'src/app/_firebases/user.service';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';

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
    private cloudinary: Cloudinary) {
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
  }

  editAccount() {
    console.log("edit account");

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  handlerAvatar($event) {
    let self = this;
    let file = $event.target.files[0];
    let fileReader = new FileReader();
    if (file.size > 1000000) {
      this.alertService.error('Chọn lại ảnh, chọn ảnh dưới 1MB');
      return;
    }
    fileReader.onloadend = function (e) {
      self.avatar = fileReader.result.toString();
    }
    console.log(file);

    fileReader.readAsDataURL(file);
  }

  configUploaderToCloudinary() {
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
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
      this.response = res;
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
}
