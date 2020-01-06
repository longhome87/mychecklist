import { Component, OnInit } from '@angular/core';
import { IMember } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { SortService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  memberList: Array<IMember> = [];

  constructor(
    private router: Router,
    private sortService: SortService) { }

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      const nameList = environment.Names;
      const firstName = nameList[Math.floor(Math.random() * nameList.length)];
      const lastName = nameList[Math.floor(Math.random() * nameList.length)];
      const item: IMember = { id: i.toString(), firstName: firstName, lastName: lastName };
      this.memberList.push(item);
    }

    this.memberList.sort(this.sortService.sortByFirstName);
  }

  createNew() {
    console.log('created new');
    this.router.navigate(['/members/create']);
  }
}
