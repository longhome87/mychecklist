import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_firebases/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Site } from 'src/app/_until/constant'

@Component({
  selector: 'app-dialog-update-user',
  templateUrl: './dialog-update-user.component.html',
  styleUrls: ['./dialog-update-user.component.css']
})
export class FormUpdateUserComponent implements OnInit {
  formUpdateUser: FormGroup;
  firstName: '';
  lastName: '';
  userName: '';
  password: '';
  role: '';
  type: boolean;
  listRole = [Site.ADMIN, Site.GLV, Site.CUSTOMER]

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formUpdateUser = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    const { data } = this;
      this.type = data.type;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.userName = data.username;
      this.password = data.password;
      this.role = data.role
  }

  onSubmit() {
    let updateUser = {
      id: this.data.id,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      password: this.password,
      username: this.userName
    }
    this.userService.updateUser(updateUser)
  }

  changeRole($event) {
    this.role = $event.value;
  }

  deleteUser() {
    this.userService.deleteUser(this.data.id);
  }
}
