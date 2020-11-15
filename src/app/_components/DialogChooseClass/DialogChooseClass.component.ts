import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/_firebases/class.service';
import { IClass } from 'src/app/_models';
import { MatDialogRef } from '@angular/material/dialog';
import { Site } from 'src/app/_until/constant';
import { AuthenticationService } from 'src/app/_services';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { CheckListDataService } from 'src/app/_services/checklist.service';

@Component({
  selector: 'app-DialogChooseClass',
  templateUrl: './DialogChooseClass.component.html',
  styleUrls: ['./DialogChooseClass.component.css']
})
export class DialogChooseClassComponent implements OnInit {
  idCatechism = '';
  listCatechism: Array<IClass>;
  listClass: Array<IClass>;

  constructor(
    private classService: ClassService,
    public authenticationService: AuthenticationService,
    public checkListDataService: CheckListDataService,
    private dialogRef: MatDialogRef<DialogChooseClassComponent>
  ) { }

  ngOnInit() {
    const { currentUserValue } = this.authenticationService;
    const listCatechism = this.classService.getClasses();
    this.listCatechism = [];
    this.listClass = [];
    listCatechism.subscribe(doc => {
      doc.map(data => {
        let catechism: any = data.payload.doc.data();
        catechism.id = data.payload.doc.id;
        this.listCatechism.push(catechism);
      })
      if (currentUserValue && currentUserValue.classes) {
        currentUserValue.classes.map(idClass => {
          let childCatechism = this.listCatechism.filter(
            catechismId => catechismId === idClass);
            // debugger
            this.listClass.push(childCatechism[0]);
        })
      } else {
        this.listClass = this.listCatechism;
        // debugger
      }
    })
  }

  handleCatechism($event) {
    this.idCatechism = $event.value;
  }

  sendClass() {
    const { checkListDataService, idCatechism } = this;
    if (idCatechism && idCatechism.length !== 0) {
      checkListDataService.handleIdCheklist(idCatechism);
      this.closeDialog();
    }
    return;
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
