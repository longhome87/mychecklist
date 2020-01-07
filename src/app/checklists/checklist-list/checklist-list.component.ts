import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { IChecklist } from 'src/app/_models';

@Component({
  selector: 'app-checklist-list',
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.css']
})
export class ChecklistListComponent implements OnInit {
  checklistList: Array<IChecklist> = [];

  constructor(
    private router: Router,
    private checklistService: ChecklistService) { }

  ngOnInit() {
    this.checklistService.getChecklists()
      .subscribe(docChangeActions => {
        docChangeActions.map(docChangeAction => {
          let checklistItem: any = docChangeAction.payload.doc.data();
          checklistItem.id = docChangeAction.payload.doc.id;
          this.checklistList.push(checklistItem);
        });
        console.log(this.checklistList);
        
        // this.checklistList.sort(this.sortService.sortByFirstName);
      });
  }

  createNewChecklist() {
    console.log('createNewChecklist');
    this.router.navigate(['/checklists/' + environment.NewEntityURLParameters.NewChecklist + '/create']);
  }
}
