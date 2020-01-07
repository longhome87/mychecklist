import { Component, OnInit } from '@angular/core';
import { IMember } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { SortService } from 'src/app/_services';
import { Router } from '@angular/router';
import { MemberService } from 'src/app/_firebases/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  memberList: Array<IMember> = [];

  constructor(
    private router: Router,
    private sortService: SortService,
    private memberService: MemberService) { }

  ngOnInit() {
    // for (let i = 0; i < 10; i++) {
    //   const nameList = environment.Names;
    //   const firstName = nameList[Math.floor(Math.random() * nameList.length)];
    //   const lastName = nameList[Math.floor(Math.random() * nameList.length)];
    //   const item: IMember = { id: i.toString(), firstName: firstName, lastName: lastName };
    //   this.memberList.push(item);
    // }

    // this.memberList.sort(this.sortService.sortByFirstName);
    this.memberService.getMembers()
      .subscribe(doc => {
        doc.map(data => {
          let memberItem: any = data.payload.doc.data();
          memberItem.id = data.payload.doc.id;
          this.memberList.push(memberItem);
        });
        this.memberList.sort(this.sortService.sortByFirstName);
      });
  }

  createNew() {
    console.log('created new');
    this.router.navigate(['/members/create']);
  }
}
