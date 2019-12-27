import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checklist-list',
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.css']
})
export class ChecklistListComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  createNewChecklist() {
    console.log('createNewChecklist');
    this.router.navigate(['/checklists/' + environment.NewEntityURLParameters.NewChecklist + '/create']);
  }
}
