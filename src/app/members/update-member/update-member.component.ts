import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from 'src/app/_firebases/member.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-update-member',
  templateUrl: './update-member.component.html',
  styleUrls: ['./update-member.component.css']
})
export class UpdateMemberComponent implements OnInit {
  formGroup: FormGroup;
  prefixName:'';
  firstName:'';
  lastName:'';
  id:''

  constructor(
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private router: Router, 
    private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      prefixName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
    this.prefixName = this.route.snapshot.params['prefixName'];
    this.firstName = this.route.snapshot.params['firstName'];
    this.lastName = this.route.snapshot.params['lastName'];
    this.id = this.route.snapshot.params['id'];
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formGroup.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    let  { value } = this.formGroup;
    value.id = this.id;
    console.log(value,"zzzz");
    
    this.memberService.updateMember(value)
      .then(data => {
        console.log(data, "update");
        this.router.navigate(['/members']);
      })
      .catch(error => {
        console.log(error);
      });
  }

  onCancel() {
    this.router.navigate(['/members']);
  }
}
