import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { ClassService } from 'src/app/_firebases/class.service';
import { IClass } from 'src/app/_models';
import { MatDialog } from '@angular/material/dialog';
import { DialogUpdateClassesComponent } from '../_components/DialogUpdateClasses/DialogUpdateClasses.component';
import { Site } from 'src/app/_until/constant';
import { AuthenticationService } from 'src/app/_services';
import { ChecklistService } from 'src/app/_firebases/checklist.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  listClasses: Array<IClass>;
  displayedColumns: string[] = ['name', 'shortName', 'action'];
  dataSource: any;
  constructor(
    private classService: ClassService,
    public dialog: MatDialog,
    public authenticationService: AuthenticationService,
    private checklistService: ChecklistService) { }

  ngOnInit() {
    // let params = {
    //   id: null,
    //   name: 'Rước lễ 1 nhóm 2',
    //   shortName: 'RL1-N2'
    // }
    // this.classService.createClass(params)
    // .then(data => {
    //   console.log(data, "data create");

    // })

    //get checkList

    // let arrayCheckList = [];
    // let arrayClasses = [];
    // this.checklistService.getChecklists().subscribe(data => {
    //   data.map(item => {
    //     let items:any = item.payload.doc.data();
    //     items.id = item.payload.doc.id;
    //     arrayCheckList.push(items);
    //   })
    // })

//get List Classes

    // this.classService.getClasses().subscribe(doc => {
    //   doc.map(data => {
    //     let classItem: any = data.payload.doc.data();
    //     classItem.id = data.payload.doc.id;
    //     arrayClasses.push(classItem);
    //   })
    // })

    // console.log(arrayCheckList , "arrayCheckList");
    // console.log(arrayClasses, "arrayClasses");


    const preventEvent = this.hasRole();
    if ( preventEvent ) {
      this.classService.getClasses()
      .subscribe(doc => {
        this.listClasses = []
        doc.map(data => {
          let classItem: any = data.payload.doc.data();
          classItem.id = data.payload.doc.id;
          this.listClasses.push(classItem);
        })
      })
      this.dataSource = new MatTableDataSource(this.listClasses);
    }
  }

  hasRole() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue && currentUserValue.role === Site.ADMIN) {
      return true;
    }
    return false;
  }

  deleteUser(classItem) {
    this.dialog.open(DialogUpdateClassesComponent, {
      data: {...classItem, type: false}
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource);

  }

  openDialogEditUser(classItem) {
    const dialogRef = this.dialog.open(DialogUpdateClassesComponent, {
      data: {...classItem, type: true}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  createClass() {
    console.log("zzz");
    const dialogRef = this.dialog.open(DialogUpdateClassesComponent, {
      data: {create: true, type: true}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
