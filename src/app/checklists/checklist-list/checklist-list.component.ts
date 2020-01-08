import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { IChecklist, IMember } from 'src/app/_models';
import { combineLatest } from 'rxjs';
import { MemberService } from 'src/app/_firebases/member.service';
import { SortService } from 'src/app/_services';

@Component({
  selector: 'app-checklist-list',
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.css']
})
export class ChecklistListComponent implements OnInit {
  checklistList: Array<IChecklist> = [];
  memberList: Array<IMember> = [];

  constructor(
    private router: Router,
    private checklistService: ChecklistService,
    private memberService: MemberService,
    private sortService: SortService) { }

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
          console.log(this.checklistList);
        }

        // Get members data
        if (data[1] !== null) {
          data[1].map(docChangeAction => {
            let memberItem: any = docChangeAction.payload.doc.data();
            memberItem.id = docChangeAction.payload.doc.id;
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
}
