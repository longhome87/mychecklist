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
  @Input() search: boolean;
  @Output() checkList = new EventEmitter();
  @Output() editItem = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  checkItem($event, item) {
    $event.stopPropagation();
    this.checkList.emit(item);
  }

  editMember(event, item) {
    event.stopPropagation();
    this.editItem.emit(item);
  }

  change(event, index) {
    event.stopPropagation();
    var element = document.getElementsByClassName("cards");
    element[index].classList.toggle("applyflip");
  }
}
