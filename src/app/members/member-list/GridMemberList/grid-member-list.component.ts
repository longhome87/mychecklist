import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMember } from 'src/app/_models';
import { Site } from 'src/app/_until/constant'
import { AuthenticationService } from 'src/app/_services';

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
  constructor( public authenticationService: AuthenticationService ) { }

  ngOnInit() {}

  hasRole() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue && currentUserValue.role !== Site.CUSTOMER) {
      return true;
    }
    return false;
  }

  checkItem($event, item) {
    $event.stopPropagation();
    const preventEvent = this.hasRole();
    if ( !preventEvent ) {
      return;
    }
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
