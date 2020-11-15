import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { MatDialog } from '@angular/material/dialog';
import { DialogChooseClassComponent } from 'src/app/_components/DialogChooseClass/DialogChooseClass.component';
import { CheckListDataService } from 'src/app/_services/checklist.service'

import { from } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public authenticationService: AuthenticationService,
    public dialog: MatDialog,
    public checkListDataService: CheckListDataService,
    ) { }

  ngOnInit() {
    const { IdCheckList } = this.checkListDataService
    if (!IdCheckList) {
      this.openDialogChooseClass();
    }
  }

  openDialogChooseClass() {
    this.dialog.open(DialogChooseClassComponent, { disableClose: true });
  }
}
