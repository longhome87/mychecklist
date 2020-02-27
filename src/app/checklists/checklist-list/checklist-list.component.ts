import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { IChecklist, IMember } from 'src/app/_models';
import { combineLatest } from 'rxjs';
import { MemberService } from 'src/app/_firebases/member.service';
import { SortService, DateService } from 'src/app/_services';

@Component({
  selector: 'app-checklist-list',
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.css']
})
export class ChecklistListComponent implements OnInit {
  checklistList: Array<IChecklist> = [];
  memberList: Array<IMember> = [];
  checkedDateList: Array<Date> = [];

  constructor(
    private router: Router,
    private checklistService: ChecklistService,
    private memberService: MemberService,
    private sortService: SortService,
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
        if (data[0] !== null) {
          data[0].map(docChangeAction => {
            let checklistItem: any = docChangeAction.payload.doc.data();
            checklistItem.id = docChangeAction.payload.doc.id;
            this.checklistList.push(checklistItem);
          });
          this.checklistList.sort(this.sortService.sortByDate);
          this.checkedDateList = this.checklistList.map(x => {
            return new Date(x.date);
          })
          // console.log(this.checklistList);
        }

        // Get members data
        if (data[1] !== null) {
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
          // console.log(this.memberList);

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
}
