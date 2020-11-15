import { Injectable } from '@angular/core';
import { AuthenticationService } from 'src/app/_services';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { MemberService } from 'src/app/_firebases/member.service';
import { IMember, IChecklist } from 'src/app/_models';

@Injectable({ providedIn: 'root' })
export class CheckListDataService {
  public IdCheckList: string;
  public listMember: Array<IMember>;
  public listMemberIsAbsent = [];
  public listDates: Array<any>;
  public listCheckList: Array<IChecklist>;

  constructor(
    public authenticationService: AuthenticationService,
    private checklistService: ChecklistService,
    private memberService: MemberService
    ) {}

  handleIdCheklist(idCatechism) {
    console.log(idCatechism, "idCatechism");
    const self = this;
    this.listCheckList = [];
    this.listMember = [];
    this.listDates = [];
    const getChecklists = this.checklistService.getChecklists();
    getChecklists.subscribe(data => {
      data.map(docChangeAction => {
        let checklistItem: any = docChangeAction.payload.doc.data();
        checklistItem.id = docChangeAction.payload.doc.id;
        if (checklistItem.class && checklistItem.class.id === idCatechism) {
          self.IdCheckList = checklistItem.id;
          if ( checklistItem.members ) {
            self.listMember = checklistItem.members;
          }
          if (checklistItem.dates) {
            checklistItem.dates.map(date => {
              let formatDate = new Date(date);
              self.listDates.push(formatDate);
            });
          }
          console.log(this.listMember, "listMember");
          console.log(this.listDates, "listDates");
          console.log(checklistItem ,"checklistItem");
        }
        this.listCheckList.push(checklistItem);
      })
    })
  }
}