import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from 'src/app/_firebases/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../_services';
import { Site } from 'src/app/_until/constant'
import { AuthenticationService } from 'src/app/_services';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { CheckListDataService } from 'src/app/_services/checklist.service';

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
  province = null

  constructor(
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    public authenticationService: AuthenticationService,
    private checklistService: ChecklistService,
    public checkListDataService: CheckListDataService,) {
  }

  ngOnInit() {
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
      const preventEvent = this.hasRole();
      if ( preventEvent ) {
        this.memberService.getMember(id)
        .subscribe(doc => {
          let member:any = doc.payload.data();
          this.saintName = member.saintName;
          this.firstName = member.firstName;
          this.lastName = member.lastName;
          this.id =  id;
          if (member.nickname) {
            this.nickname =  member.nickname;
          }
          if (member.avatar) {
            this.avatar =  member.avatar;
          }
          this.avatar = member.avatar;
          if (member.phoneNumber) {
            this.phoneNumber =  member.phoneNumber;
          }
          if (member.dateOfBirth) {
            this.dateOfBirth =  member.dateOfBirth;
          }
          if (member.address) {
            this.address =  member.address;
          }
          if (member.fullNameDad) {
            this.fullNameDad =  member.fullNameDad;
          }
          if (member.phoneNumberDad) {
            this.phoneNumberDad =  member.phoneNumberDad;
          }
          if (member.fullNameMom) {
            this.fullNameMom =  member.fullNameMom;
          }
          if (member.phoneNumberMom) {
            this.phoneNumberMom =  member.phoneNumberMom;
          }
          if (member.parish) {
            this.parish =  member.parish;
          }
          if (member.province) {
            this.province =  member.province;
          }
        })
      }
    } else {
      console.log("create member");
      this.isNew = true;
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formGroup.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    // console.log('Submitted', this.formGroup.controls['saintName'].value);
    // console.log('Submitted', this.formGroup.value);
    const { listMember, IdCheckList } = this.checkListDataService;
    debugger
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
          let parmasCheckList = {
            id: IdCheckList,
            members: [
              ...listMember,
              {
              id :data.id,
              absentDates: null
              }
            ]
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

  hasRole() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue && currentUserValue.role !== Site.CUSTOMER) {
      return true;
    }
    return false;
  }

  onCancel() {
    this.router.navigate(['/members']);
  }

  handlerAvatar($event) {
    let self = this;
    let file = $event.target.files[0];
    let fileReader = new FileReader();
    if (file.size > 1000000) {
      this.alertService.error('Chọn lại ảnh, chọn ảnh dưới 1MB');
      return;
    }
    fileReader.onloadend = function(e){
      self.avatar = fileReader.result.toString();
    }
    console.log(file);

    fileReader.readAsDataURL(file);
  }

  alterDescriptionText() {
    this.showShortDesciption = !this.showShortDesciption;
    var element = document.getElementsByClassName("content-form");
    element[0].classList.toggle("toggle-show-form");
  }
}
