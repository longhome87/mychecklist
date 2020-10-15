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
  memberList : Array<IMember>;
  listChecked = [];
  viewTable = false;

  constructor(
    private router: Router,
    private sortService: SortService,
    private memberService: MemberService
  ) { }

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
      this.memberList=[];
      doc.map(data => {
        let memberItem: any = data.payload.doc.data();
        memberItem.isChecked = false;
        if (memberItem.dateOfBirth === undefined) {
          memberItem.dateOfBirth = null;
        }
        if (memberItem.phoneNumber === undefined) {
          memberItem.phoneNumber = null;
        }
        if (memberItem.fullNameDad === undefined) {
          memberItem.fullnameDad = null;
        }
        if (memberItem.phoneNumberDad === undefined) {
          memberItem.phoneNumberDad = null;
        }
        if (memberItem.fullNameMom === undefined) {
          memberItem.fullnameMom = null;
        }
        if (memberItem.phoneNumberMom === undefined) {
          memberItem.phoneNumberMom = null;
        }
        if (memberItem.parish === undefined) {
          memberItem.parish = null;
        }
        if (memberItem.province === undefined) {
          memberItem.province = null;
        }
        if (memberItem.address === undefined) {
          memberItem.address = null;
        }
        memberItem.id = data.payload.doc.id;
        this.memberList.push(memberItem);
      });
      console.log(this.memberList, "memberList");

      this.memberList.sort(this.sortService.sortByFirstName);
      });
  }

  createNew() {
    console.log('created new');
    this.router.navigate(['/members/form-member']);
  }

  update(item) {
    console.log('update', item);
    // this.router.navigate(['/members/update']);
    this.router.navigate(['/members/form-member', {id: item.id}]);
  }

  checkList(item) {
    const { memberList } = this;
    memberList.forEach(el => {
      if(item === el) {
        return item.isChecked = !item.isChecked ;
      }
      return ;
    });

    if(this.listChecked.includes(item.id)) {
      return this.listChecked = this.listChecked.filter( id => id !== item.id);
    }
    return this.listChecked.push(item.id)
  }

  deleteMembers() {
    this.memberList = [];
    this.listChecked.forEach( listId => {
      this.memberService.deleteMember(listId)
      .then(data => {
        console.log("done");
      })
      .catch(error => {
        console.log(error);
      });
    })
    this.listChecked = [];
  }

  handlerChangeView() {
    this.viewTable = !this.viewTable;
  }
}
