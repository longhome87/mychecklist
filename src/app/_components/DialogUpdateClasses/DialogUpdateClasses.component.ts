import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClassService } from 'src/app/_firebases/class.service';
import { ChecklistService } from 'src/app/_firebases/checklist.service'
import { CheckListDataService } from 'src/app/_services/checklist.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Site } from 'src/app/_until/constant'

@Component({
  selector: 'app-DialogUpdateClasses',
  templateUrl: './DialogUpdateClasses.component.html',
  styleUrls: ['./DialogUpdateClasses.component.css']
})
export class DialogUpdateClassesComponent implements OnInit {
  formUpdateUser: FormGroup;
  name: '';
  shortName: '';
  course: '';
  role: '';
  type: boolean;
  create = false

  constructor(
    private formBuilder: FormBuilder,
    private classService: ClassService,
    private checklistService: ChecklistService,
    private checkListDataService: CheckListDataService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.formUpdateUser = this.formBuilder.group({
      name: ['', Validators.required],
      shortName: ['', Validators.required],
      course: ''
    });
    const { data } = this;
      if (data.create) {
        this.create = true;
        this.type = data.type;
        return;
      }
      this.type = data.type;
      this.name = data.name;
      this.shortName = data.shortName;
      this.role = data.role
  }

  onSubmit() {
    const self = this;
    if (this.create) {
      let createClass = {
        id: null,
        name: this.name,
        shortName: this.shortName
      }
      this.classService.createClass(createClass)
      .then(data => {
        let createClassCheckList = {
          id: null,
          course: self.course,
          dates: null,
          class: { id : data.id },
          members: null
        }
        self.checklistService.createChecklist(createClassCheckList)
        .then(data => {
          console.log("Tạo lớp thành công");
        })
      })
    } else {
      let updateClass = {
        id: this.data.id,
        name: this.name,
        shortName: this.shortName
      }
      this.classService.updateClass(updateClass);
    }
  }

  changeRole($event) {
    this.role = $event.value;
  }

  deleteClass() {
    const self = this;
    const { listCheckList } = this.checkListDataService;
    listCheckList.map(itemCheckList => {
      if(itemCheckList.class.id === self.data.id) {
        self.checklistService.deleteChecklist(itemCheckList.id)
        .then( data => {
          this.classService.deleteClass(self.data.id);
        })
      }
    })
  }

  // deleteClassTest() {
  //   ["SnXZOPOHsbeVMBXqasZe", "9IX2W1XLqpk01TR88TqG"].map(id => {
  //     this.checklistService.deleteChecklist(id);
  //   })
  // }
}
