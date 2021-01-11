import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { MatDialog } from '@angular/material/dialog';
import { DialogChooseClassComponent } from 'src/app/_components/DialogChooseClass/DialogChooseClass.component';
import { ClassService } from 'src/app/_firebases/class.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private classService: ClassService,
    ) { }

  ngOnInit() {
    const idCatechism = localStorage.getItem("idCatechism");
    const { currentUserValue } = this.authenticationService;
    const listCatechism = this.classService.getClasses();
    let listIdCatechism = [];
    let listClass = [];
    listCatechism.subscribe(doc => {
      doc.map(data => {
        let catechism: any = data.payload.doc.data();
        catechism.id = data.payload.doc.id;
        listIdCatechism.push(catechism);
      })
      if (currentUserValue && currentUserValue.classes) {
        currentUserValue.classes.map(idClass => {
          let childCatechism = listIdCatechism.filter(
            catechism => catechism.id === idClass.id);
            listClass.push(childCatechism[0]);
        })
      } else {
        listClass = listIdCatechism;
      }
      if (listClass.length == 1) {
        localStorage.setItem('idCatechism', listClass[0].id);
      } else {
        if (!idCatechism) {
          this.openDialogChooseClass();
        }
        return;
      }
    })
  }

  openDialogChooseClass() {
    this.dialog.open(DialogChooseClassComponent, { disableClose: true });
  }
}
