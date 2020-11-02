import { Component, OnInit } from '@angular/core';
import { IMember } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { SortService } from 'src/app/_services';
import { Router } from '@angular/router';
import { MemberService } from 'src/app/_firebases/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})

export class MemberListComponent implements OnInit {
  memberList : Array<IMember>;
  memberListAPI: Array<IMember>;
  listChecked = [];
  viewTable = false;
  checkSearch = false;
  search = '';
  progress = true;

  constructor(
    private router: Router,
    private sortService: SortService,
    private memberService: MemberService
  ) { }

  ngOnInit() {
    // for (let i = 0; i < 10; i++) {
    //   const nameList = environment.Names;
    //   const firstName = nameList[Math.floor(Math.random() * nameList.length)];
    //   const lastName = nameList[Math.floor(Math.random() * nameList.length)];
    //   const item: IMember = { id: i.toString(), firstName: firstName, lastName: lastName };
    //   this.memberList.push(item);
    // }

    // this.memberList.sort(this.sortService.sortByFirstName);
    this.memberService.getMembers()
    .subscribe(doc => {
      this.memberList=[];
      this.memberListAPI=[];
      doc.map(data => {
        let memberItem: any = data.payload.doc.data();
        memberItem.isChecked = false;
        if (memberItem.dateOfBirth === undefined) {
          memberItem.dateOfBirth = null;
        }
        if (memberItem.phoneNumber === undefined) {
          memberItem.phoneNumber = null;
        }
        if (memberItem.fullNameDad === undefined) {
          memberItem.fullnameDad = null;
        }
        if (memberItem.phoneNumberDad === undefined) {
          memberItem.phoneNumberDad = null;
        }
        if (memberItem.fullNameMom === undefined) {
          memberItem.fullnameMom = null;
        }
        if (memberItem.phoneNumberMom === undefined) {
          memberItem.phoneNumberMom = null;
        }
        if (memberItem.parish === undefined) {
          memberItem.parish = null;
        }
        if (memberItem.province === undefined) {
          memberItem.province = null;
        }
        if (memberItem.address === undefined) {
          memberItem.address = null;
        }
        memberItem.id = data.payload.doc.id;
        this.memberList.push(memberItem);
      });
      console.log(this.memberList, "memberList");
      this.memberList.sort(this.sortService.sortByFirstName);
      this.memberListAPI = this.memberList;
      this.progress = false;
      });
  }

  createNew() {
    console.log('created new');
    this.router.navigate(['/members/form-member']);
  }

  update(item) {
    console.log('update', item);
    // this.router.navigate(['/members/update']);
    this.router.navigate(['/members/form-member', {id: item.id}]);
  }

  checkList(item) {
    const { memberList } = this;
    memberList.forEach(el => {
      if(item === el) {
        return item.isChecked = !item.isChecked ;
      }
      return ;
    });

    if(this.listChecked.includes(item.id)) {
      return this.listChecked = this.listChecked.filter( id => id !== item.id);
    }
    return this.listChecked.push(item.id)
  }

  deleteMembers() {
    this.memberList = [];
    this.listChecked.forEach( listId => {
      this.memberService.deleteMember(listId)
      .then(data => {
        console.log("done");
      })
      .catch(error => {
        console.log(error);
      });
    })
    this.listChecked = [];
  }

  handlerChangeView() {
    this.viewTable = !this.viewTable;
  }

  searchInput() {
    this.checkSearch = !this.checkSearch;
  }

  clearData() {
    this.search = '';
    this.filterName('');
  }

  clearAccent(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

  filterName(searchType) {
    const { memberListAPI } = this;
    let self = this;
    if (searchType) {
      // filter firsName
      let filterFirstName = memberListAPI.filter(item =>
          item.firstName.toLowerCase().includes(searchType.toLowerCase())
          )
      //filter LastName
      let lastName = memberListAPI.filter(item =>
          item.lastName.toLowerCase().includes(searchType.toLowerCase())
          )
      //filter date of birth
      let filterBirthday = memberListAPI.filter(item =>
          item.dateOfBirth.toLowerCase().includes(searchType.toLowerCase())
          )
      // filter PrefixName
      let filterPrefixName = memberListAPI.filter(item =>
        self.clearAccent(item.prefixName).toLowerCase().includes(searchType.toLowerCase())
          )
      //filter Number phone
      let filterPhone = memberListAPI.filter(item =>
          item.phoneNumber.toLowerCase().includes(searchType.toLowerCase())
          )
      //filter Name Dady
      let filterNameDad = memberListAPI.filter(item =>
          item.fullNameDad.toLowerCase().includes(searchType.toLowerCase())
          )
      // filter Name Mom
      let filterNameMom = memberListAPI.filter(item =>
          item.fullNameMom.toLowerCase().includes(searchType.toLowerCase())
          )
      //Number phone Dady
      let filterPhoneDady = memberListAPI.filter(item =>
          item.phoneNumberDad.toLowerCase().includes(searchType.toLowerCase())
          )
      // Number phone Mommy
      let filterPhoneMomy = memberListAPI.filter(item =>
          item.phoneNumberMom.toLowerCase().includes(searchType.toLowerCase())
          )
        let filterMember = [
          ...filterFirstName,
          ...lastName,
          ...filterBirthday,
          ...filterPrefixName,
          ...filterPhone,
          ...filterNameDad,
          ...filterNameMom,
          ...filterPhoneDady,
          ...filterPhoneMomy
        ]
        let filterMemberList = [];
        filterMember.map(member => {
          if(!filterMemberList.includes(member)) {
            filterMemberList.push(member);
            return;
          }
          return;
        })
        this.memberList = filterMemberList;
        this.memberList.sort(this.sortService.sortByFirstName);
        return;
    }
    this.memberList = this.memberListAPI;
  }
}
