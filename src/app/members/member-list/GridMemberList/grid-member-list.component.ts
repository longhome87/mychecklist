import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMember } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { SortService } from 'src/app/_services';
import { Router } from '@angular/router';
import { MemberService } from 'src/app/_firebases/member.service';

@Component({
  selector: 'app-grid-member-list',
  templateUrl: './grid-member-list.html',
  styleUrls: ['./grid-member-list.component.css']
})
export class GridMemberListComponent implements OnInit {

  @Input() memberList: Array<IMember>;
  @Output() checkList = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  checkItem(item) {
    this.checkList.emit(item);
  }
}
