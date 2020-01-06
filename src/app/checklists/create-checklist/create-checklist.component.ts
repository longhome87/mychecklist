import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IChecklistItem } from 'src/app/_models';
import { SortService } from 'src/app/_services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-checklist',
  templateUrl: './create-checklist.component.html',
  styleUrls: ['./create-checklist.component.css']
})
export class CreateChecklistComponent implements OnInit {
  checklistList: Array<IChecklistItem> = [];

  constructor(
    private route: ActivatedRoute,
    private sortService: SortService) {

  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      console.log(data);
    });
    for (let i = 0; i < 10; i++) {
      const nameList = environment.Names;
      const item = { id: i, name: nameList[Math.floor(Math.random() * nameList.length)], status: 0, selected: false };
      this.checklistList.push(item);
    }
    this.checklistList.sort(this.sortService.sortByName);
  }

  onCheck(checklistItem) {
    checklistItem.selected = !checklistItem.selected;
  }

  getUncheckedItems() {
    return this.checklistList.filter(x => !x.selected);
  }

  getCheckedItems() {
    return this.checklistList.filter(x => x.selected);
  }

  onSubmit() {
    console.log('submitted');

  }
}
