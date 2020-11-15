import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { IChecklist, IMember } from 'src/app/_models';
import { combineLatest } from 'rxjs';
import { MemberService } from 'src/app/_firebases/member.service';
import { SortService, DateService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import { Site } from 'src/app/_until/constant'
import { AuthenticationService } from 'src/app/_services';
import { CheckListDataService } from 'src/app/_services/checklist.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogChooseClassComponent } from 'src/app/_components/DialogChooseClass/DialogChooseClass.component';

@Component({
  selector: 'app-checklist-list',
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.css']
})
export class ChecklistListComponent implements OnInit {
  checklist: IChecklist;
  memberList: Array<IMember>;
  chooseListDay = [];
  checkedDateList = [];
  progress = true;
  isShortName = false;

  constructor(
    private router: Router,
    private checklistService: ChecklistService,
    private memberService: MemberService,
    private sortService: SortService,
    private datePipe: DatePipe,
    private dateService: DateService,
    public authenticationService: AuthenticationService,
    public checkListDataService: CheckListDataService,
    public dialog: MatDialog,) { }

  ngOnInit() {
    // let params = {
    //   id: "e5rkgyirjfbWxMKbhbXY",
    //   course: '2020-2021',
    //   dates: ['2020-11-13', '2020-11-14'],
    //   users: [{id: 'QbrgurQZGhnSB3padedA'}, {id: 'qCKWA6w7gKClzA50Qip7'}],
    //   class: null,
    //   members: [
    //     {
    //       id: 'JDQA05klbTthJu85pFTT',
    //       absentDates: [
    //         {date: '2020-11-13', reason: 'bệnh'},
    //         {date: '2020-11-14', reason: 'tiệc'},
    //       ]
    //     },
    //     {
    //       id: 'SzRRuL77QR4wFy9hhwOO',
    //       absentDates: [{date: '2020-11-14', reason: 'ốm'}]
    //     }
    //   ]
    // }
    // // get checklist
    // this.checklistService.updateChecklistItem(params)
    const { IdCheckList } = this.checkListDataService
    if (!IdCheckList) {
      this.openDialogChooseClass();
    }

    this.checkedDateList = this.checkListDataService.listDates;
    const { listMember } = this.checkListDataService;

    this.memberList = [];
    if (listMember && listMember.length !== 0) {
      const listIdMember = listMember.map(member => member.id);
      listIdMember.map(idMember => {
      const getMember =  this.memberService.getMember(idMember);
        getMember.subscribe(doc => {
        let member:any = doc.payload.data();
        member.id = doc.payload.id;
        this.memberList.push(member);
        })
      })
    }

    console.log(this.checkedDateList, this.memberList, "ssada");
    if(this.checkedDateList &&  this.memberList) {
      this.progress = false;
    }
  }

  openDialogChooseClass() {
    this.dialog.open(DialogChooseClassComponent, { disableClose: true });
  }

  hasRole() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue && currentUserValue.role !== Site.CUSTOMER) {
      return true;
    }
    return false;
  }

  hasShortName() {
    const { useShortName } = this.authenticationService;
    if ( useShortName ) {
      this.isShortName = true;
      return;
    }
    this.isShortName = false;
  }

  hasNickname(member) {
    if (member && member.nickname) {
      return member.nickname;
    }
    return member.firstName;
  }

  createNewChecklist() {
    console.log('createNewChecklist');
    this.router.navigate(['/checklists/' + environment.NewEntityURLParameters.NewChecklist + '/create']);
  }

  isCheckedDate(checkedDate: Array<string>, date: Date): boolean {
    return checkedDate.includes(this.dateService.formatDate(date));
  }

  onClick(event) {
    event.preventDefault();
  }

  DeleteDate(){
    // const { chooseListDay, checklistList } = this;
    // const self = this;
    // checklistList.forEach(itemCheckList => {
    //   if (chooseListDay.includes(itemCheckList.date)) {
    //     this.checklistService.deleteChecklist(itemCheckList.id);
    //   }
    // })
    // this.chooseListDay = [];
  }

  chooseDateDel(itemDay) {
    // const preventEvent = this.hasRole();
    // if( preventEvent ) {
    //   const day = this.datePipe.transform(itemDay.date, 'yyyy-MM-dd');
    //   const { checkedDateList } = this;
    //   checkedDateList.forEach(el => {
    //     if(itemDay === el) {
    //       return itemDay.checked = !itemDay.checked ;
    //     }
    //     return ;
    //   });

    //   if(this.chooseListDay.includes(day)) {
    //     return this.chooseListDay = this.chooseListDay.filter( date => date !== day);
    //   }
    //   return this.chooseListDay.push(day);
    // }
    // return;
  }

  /// edit stick
  changeStick(member, checkDate) {
    // const preventEvent = this.hasRole();
    // if(preventEvent) {
    //   const { checklistList, datePipe } = this;
    //   let currentDay = datePipe.transform(new Date(), 'yyyy-MM-dd')
    //   let checkDay = datePipe.transform(checkDate.date, 'yyyy-MM-dd')
    //   if (currentDay === checkDay ) {
    //     let setMember = {
    //       id: member.id,
    //       firstName: member.firstName,
    //       lastName: member.lastName,
    //       saintName: member.saintName,
    //     }
    //     const dateIsCheck = checklistList.filter(date => date.id === checkDate.idDate);

    //     let listMember = dateIsCheck[0].members;
    //     const checkMember = listMember.filter(memberIsCheck => memberIsCheck.id === setMember.id);
    //     if (checkMember && checkMember.length === 0) {
    //       listMember.push(member);
    //     } else {
    //       listMember = listMember.filter(memberIsCheck => memberIsCheck.id !== setMember.id);
    //     }
    //     this.checklist = {
    //       id: checkDate.idDate,
    //       date: checkDay,
    //       members: listMember
    //     }
    //     this.checklistService.updateChecklist(this.checklist);
    //     return;
    //   }
    //   return;
    // }
    // return;
  }
}
