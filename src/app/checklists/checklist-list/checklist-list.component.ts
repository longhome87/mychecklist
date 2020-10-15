import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { IChecklist, IMember } from 'src/app/_models';
import { combineLatest } from 'rxjs';
import { MemberService } from 'src/app/_firebases/member.service';
import { SortService, DateService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-checklist-list',
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.css']
})
export class ChecklistListComponent implements OnInit {
  checklist: IChecklist;
  checklistList: Array<IChecklist>;
  memberList: Array<IMember>;
  listDay = [];
  checkedDateList = [];

  constructor(
    private router: Router,
    private checklistService: ChecklistService,
    private memberService: MemberService,
    private sortService: SortService,
    private datePipe: DatePipe,
    private dateService: DateService) { }

  ngOnInit() {
    const getChecklists = this.checklistService.getChecklists();
    const getMembers = this.memberService.getMembers();
    combineLatest<any>(
      getChecklists,
      getMembers
    )
      .subscribe(data => {
        // Get checklists data
        console.log(data, "start");

        if (data[0] !== null) {
          this.checklistList = [];
          data[0].map(docChangeAction => {;
            let checklistItem: any = docChangeAction.payload.doc.data();
            checklistItem.id = docChangeAction.payload.doc.id;
            this.checklistList.push(checklistItem);
          });
          this.checklistList.sort(this.sortService.sortByDate);
          this.checkedDateList = this.checklistList.map(x => {
            return {
              idDate: x.id,
              checked: false,
              date: new Date(x.date)
            }
          })
        }

        // Get members data
        if (data[1] !== null) {
          this.memberList = [];
          data[1].map(docChangeAction => {
            let memberItem: any = docChangeAction.payload.doc.data();
            memberItem.id = docChangeAction.payload.doc.id;
            memberItem['checkedDate'] = [];
            let checklists = this.checklistList.filter(x => x.members.some(m => m.id === memberItem.id));
            checklists.map(x => {
              memberItem['checkedDate'].push(x.date);
            });
            this.memberList.push(memberItem);
          });
          this.memberList.sort(this.sortService.sortByFirstName);
        }
      },
        (err: Response) => {
          // Log error
          console.log(err);
          // const body = err.json();
          // // Display message
          // this.alertService.addAlert({ Type: 'danger', Dismissible: true, Message: 'An error occurred loading npi project setup data.' } as IAlert);
        },
        () => { console.log('completed'); });
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
    const { listDay, checklistList } = this;
    checklistList.forEach(itemCheckList => {
      if (listDay.includes(itemCheckList.date)) {
        this.checklistService.deleteChecklist(itemCheckList.id);
      }
      return;
    })
    this.listDay = [];
  }

  chooseDateDel(itemDay) {
    const day = this.datePipe.transform(itemDay.date, 'yyyy-MM-dd');
    const { checkedDateList } = this;
    checkedDateList.forEach(el => {
      if(itemDay === el) {
        return itemDay.checked = !itemDay.checked ;
      }
      return ;
    });

    if(this.listDay.includes(day)) {
      return this.listDay = this.listDay.filter( date => date !== day);
    }
    return this.listDay.push(day);
  }

  /// edit stick
  changeStick(member, checkDate) {
    const { checklistList } = this;
    let setMember = {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      prefixName: member.prefixName,
    }
    const dateIsCheck = checklistList.filter(date => date.id === checkDate.idDate);

    let listMember = dateIsCheck[0].members;
    const checkMember = listMember.filter(memberIsCheck => memberIsCheck.id === setMember.id);
    if (checkMember.length === 0) {
      listMember.push(member);
    } else {
      listMember = listMember.filter(memberIsCheck => memberIsCheck.id !== setMember.id);
    }
    this.checklist = {
      id: checkDate.idDate,
      date: this.datePipe.transform(checkDate.date, 'yyyy-MM-dd'),
      members: listMember
    }
    this.checklistService.updateChecklist(this.checklist);
  }
}
