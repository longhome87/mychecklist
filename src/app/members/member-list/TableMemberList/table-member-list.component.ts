import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMember } from 'src/app/_models';
import { SortService } from 'src/app/_services';
import { Router } from '@angular/router';
import { MemberService } from 'src/app/_firebases/member.service';

@Component({
  selector: 'app-table-member-list',
  templateUrl: './table-member-list.html',
  styleUrls: ['./table-member-list.component.css']
})
export class TableMemberListComponent implements OnInit {

  @Input() memberList: Array<IMember>;
  @Output() checkList = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  checkItem(item) {
    this.checkList.emit(item);
  }
}
