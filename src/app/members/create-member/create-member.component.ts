import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from 'src/app/_firebases/member.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
  styleUrls: ['./create-member.component.css']
})
export class CreateMemberComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private router: Router) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      prefixName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formGroup.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    // console.log('Submitted', this.formGroup.controls['prefixName'].value);
    // console.log('Submitted', this.formGroup.value);
    this.memberService.createMember(this.formGroup.value)
      .then(data => {
        console.log(data);
        this.router.navigate(['/members']);
      })
      .catch(error => {
        console.log(error);

      });
  }
}
