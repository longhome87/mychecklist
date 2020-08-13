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
  srcImage: string;

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
    var params = this.formGroup.value;
    params.image = this.srcImage;
    this.memberService.createMember(params)
      .then(data => {
        this.router.navigate(['/members']);
      })
      .catch(error => {
        console.log(error);
      });
  }

  onCancel() {
    this.router.navigate(['/members']);
  }

  handlerAvatar($event) {
    let self = this;
    let file = $event.target.files[0]; 
    let fileReader = new FileReader();
    
    fileReader.onloadend = function(e){
      self.srcImage = fileReader.result.toString();
    }

    fileReader.readAsDataURL(file);
  }
}
