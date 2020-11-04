import { Component, OnInit } from '@angular/core';
import { MatGridTileHeaderCssMatStyler } from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import { UserService } from 'src/app/_firebases/user.service';
import { IUser } from 'src/app/_models/iuser'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  listUsers: Array<IUser>;
  displayedColumns: string[] = ['position', 'userName', 'password', 'firstName', 'lastName', 'action'];
  dataSource: any;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUsers()
    .subscribe(doc => {
      this.listUsers = []
      doc.map((data, index) => {
        let user: any = data.payload.doc.data();
        user.id = data.payload.doc.id;
        user.position = index + 1;
        this.listUsers.push(user);
      })
    })
    this.dataSource = new MatTableDataSource(this.listUsers);
  }

  createNewUser() {
    console.log("ssad");

  }

  editUser(user) {
    console.log(user, "editUser");
    let updateUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      permission: "ADMIN",
      password: user.password,
      username: user.username
    }
    this.userService.updateUser(updateUser)
  }

  deleteUser(user) {
    console.log(user, "deleteUser");
    this.userService.deleteUser(user.id);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource);

  }

}
