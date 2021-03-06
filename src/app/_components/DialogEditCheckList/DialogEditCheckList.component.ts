import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChecklistService } from 'src/app/_firebases/checklist.service';

@Component({
  selector: 'app-DialogEditCheckList',
  templateUrl: './DialogEditCheckList.component.html',
  styleUrls: ['./DialogEditCheckList.component.css']
})
export class DialogEditCheckListComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogEditCheckListComponent>,
    private checklistService: ChecklistService,
    @Inject(MAT_DIALOG_DATA) public data) { }
    labelCheckItem = '';
    message = ''
  ngOnInit() {
    console.log(this.data, "data");
    const idMember = this.data.member.id;
    this.data.members.forEach(member => {
      if (member.id === idMember) {
        if (member.absentDates && member.absentDates.length > 0) {
          for (let i = 0; i < member.absentDates.length; i++) {
            if (member.absentDates[i].date === this.data.date) {
              if (member.absentDates[i].reason) {
                this.message = member.absentDates[i].reason;
              }
              this.labelCheckItem = "unChecked";
              return;
            }
            this.labelCheckItem = "checked";
          }
        } else {
          this.labelCheckItem = "checked";
        }
      }
    });
  }

  save() {
    const members = this.data.members;
    let listMembers = [];
    if (this.labelCheckItem.length === 0) {
      return;
    } else if (this.labelCheckItem === 'checked') {
      listMembers = members.map(member => {
        if (member.id === this.data.member.id) {
          return {
            absentDates: member.absentDates.filter(absentdate => absentdate.date !== this.data.date),
            id : member.id
          }
        }
        return member;
      })
    } else {
      listMembers = members.map(member => {
        if (member.id === this.data.member.id) {
          let listAbsentDates = [];
          if (member.absentDates) {
            listAbsentDates = member.absentDates.map(absentDate => absentDate.date);
          }

          let arrayAbsentDates = [];
          if (listAbsentDates.includes(this.data.date)) {
            arrayAbsentDates = member.absentDates.map(absentdate => {
              if (absentdate.date === this.data.date) {
                if (this.message.length !== 0) {
                  return {
                    date : this.data.date,
                    reason: this.message
                  }
                } else {
                    return {
                      date: this.data.date,
                      reason: null
                    }
                }
              }
              return absentdate;
            })
            return {
              absentDates: arrayAbsentDates,
              id : member.id
            }
          } else {
            if (this.message.length !== 0) {
              if (member.absentDates) {
                member.absentDates.push({
                  date : this.data.date,
                  reason: this.message
                })
              } else {
                member.absentDates = [{
                  date : this.data.date,
                  reason: this.message
                }]
              }
            } else {
              if (member.absentDates) {
                member.absentDates.push({
                  date : this.data.date,
                  reason: null
                })
              } else {
                member.absentDates = [{
                  date : this.data.date,
                  reason: null
                }]
              }
            }
            return {
              absentDates: member.absentDates,
              id : member.id
            }
          }
        }
        return member;
      })
    }
    let paramsCheckList = {
      id: this.data.IdCheckList,
      members: listMembers
    };

    this.checklistService.updateChecklistItem(paramsCheckList)
    .then(data => {
      console.log("Update checklist successfully");
    })
    .catch(err => {
      console.log(err);
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
