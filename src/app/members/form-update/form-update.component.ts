import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from 'src/app/_firebases/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../_services';
import { AuthenticationService } from 'src/app/_services';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { IMemberAbsent } from 'src/app/_models';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';

@Component({
  selector: 'app-form-update',
  templateUrl: './form-update.component.html',
  styleUrls: ['./form-update.component.css']
})

export class FormUpdateComponent implements OnInit {
  isNew = false;
  showShortDesciption = true;
  formGroup: FormGroup;
  avatar = '/assets/image/default-user-image.png';
  file: string;
  saintName = null;
  firstName = null;
  lastName = null;
  nickname = null
  id = null;
  phoneNumber = null;
  dateOfBirth = null;
  address = null;
  fullNameDad = null;
  phoneNumberDad = null;
  fullNameMom = null;
  phoneNumberMom = null;
  parish = null;
  province = null;
  listDateExit: Array<string>;
  private IdCheckList: string;
  private listMember: Array<IMemberAbsent>;
  public uploader: FileUploader;
  private response: any;

  constructor(
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    public authenticationService: AuthenticationService,
    private checklistService: ChecklistService,
    private cloudinary: Cloudinary) {
  }

  ngOnInit() {
    const idCatechism = localStorage.getItem("idCatechism");
    const getChecklists = this.checklistService.getChecklists();
    this.listMember = [];
    getChecklists.subscribe(data => {
      this.listDateExit = [];
      data.map(docChangeAction => {
        let checklistItem: any = docChangeAction.payload.doc.data();
        checklistItem.id = docChangeAction.payload.doc.id;
        if (checklistItem.class && checklistItem.class.id === idCatechism) {
          this.IdCheckList = checklistItem.id;
          if (checklistItem.members) {
            this.listMember = checklistItem.members;
          }
          if (checklistItem.dates) {
            this.listDateExit = checklistItem.dates;
          }
        }
      })
    })


    this.formGroup = this.formBuilder.group({
      saintName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nickname: null,
      dateOfBirth: null,
      phoneNumber: null,
      address: null,
      fullNameDad: null,
      phoneNumberDad: null,
      fullNameMom: null,
      phoneNumberMom: null,
      parish: null,
      province: null
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.memberService.getMember(id)
        .subscribe(doc => {
          let member: any = doc.payload.data();
          this.saintName = member.saintName;
          this.firstName = member.firstName;
          this.lastName = member.lastName;
          this.id = id;
          if (member.nickname) {
            this.nickname = member.nickname;
          }
          if (member.avatar) {
            this.avatar = member.avatar;
          }
          this.avatar = member.avatar;
          if (member.phoneNumber) {
            this.phoneNumber = member.phoneNumber;
          }
          if (member.dateOfBirth) {
            this.dateOfBirth = member.dateOfBirth;
          }
          if (member.address) {
            this.address = member.address;
          }
          if (member.fullNameDad) {
            this.fullNameDad = member.fullNameDad;
          }
          if (member.phoneNumberDad) {
            this.phoneNumberDad = member.phoneNumberDad;
          }
          if (member.fullNameMom) {
            this.fullNameMom = member.fullNameMom;
          }
          if (member.phoneNumberMom) {
            this.phoneNumberMom = member.phoneNumberMom;
          }
          if (member.parish) {
            this.parish = member.parish;
          }
          if (member.province) {
            this.province = member.province;
          }
        })
    } else {
      console.log("create member");
      this.isNew = true;
    }

    this.configUploaderToCloudinary();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formGroup.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    const { listMember, IdCheckList } = this;
    const {
      saintName,
      id,
      firstName,
      lastName,
      nickname,
      dateOfBirth,
      phoneNumber,
      fullNameDad,
      phoneNumberDad,
      fullNameMom,
      phoneNumberMom,
      parish,
      address,
      province,
      avatar
    } = this

    let params = {
      id: null,
      saintName: saintName,
      firstName: firstName,
      lastName: lastName,
      nickname: nickname,
      dateOfBirth: dateOfBirth,
      phoneNumber: phoneNumber,
      fullNameDad: fullNameDad,
      phoneNumberDad: phoneNumberDad,
      fullNameMom: fullNameMom,
      phoneNumberMom: phoneNumberMom,
      parish: parish,
      province: province,
      address: address,
      avatar: avatar
    }

    if (this.isNew) {
      this.memberService.createMember(params)
        .then(data => {
          let absentDates = [];
          let parmasCheckList = {};
          if (this.listDateExit.length !== 0 ) {
            absentDates = this.listDateExit.map(date => {
              return {
                date: date,
                reason: null
              }
            })
            parmasCheckList = {
              id: IdCheckList,
              members: [
                ...listMember,
                {
                  id: data.id,
                  absentDates: absentDates
                }
              ]
            }
          } else {
            parmasCheckList = {
              id: IdCheckList,
              members: [
                ...listMember,
                {
                  id: data.id,
                  absentDates: null
                }
              ]
            }
          }
          this.checklistService.updateChecklistItem(parmasCheckList)
            .then(data => {
              this.router.navigate(['/members']);
            })
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      params.id = id;
      this.memberService.updateMember(params)
        .then(data => {
          console.log(data, "update");
          this.router.navigate(['/members']);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  onCancel() {
    this.router.navigate(['/members']);
  }

  handlerAvatar(event) {
    let self = this;
    let file = event.target.files[0];
    if (!file) {
      return;
    }

    let fileReader = new FileReader();
    // if (file.size > 1000000) {
    //   this.alertService.error('Chọn lại ảnh, chọn ảnh dưới 1MB');
    //   return;
    // }
    fileReader.onloadend = function (e) {
      self.avatar = fileReader.result.toString();
      // console.log(self.avatar, "avatar");

    }
    console.log(file);

    fileReader.readAsDataURL(file);
  }

  alterDescriptionText() {
    this.showShortDesciption = !this.showShortDesciption;
    var element = document.getElementsByClassName("content-form");
    element[0].classList.toggle("toggle-show-form");
  }

  onSave() {
    console.log('saved');

    // Remove all the item on queue except the last item
    this.uploader.queue.splice(0, this.uploader.queue.length - 1);
    this.uploader.uploadAll();
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
      form.append('upload_preset', 'checklist-member');
      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = 'checklist-member';
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
      this.avatar = this.response.secure_url;
      this.onSubmit();
    });
  }
}
