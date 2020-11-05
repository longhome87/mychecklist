import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUpdateComponent } from './form-update.component';

describe('CreateMemberComponent', () => {
  let component: FormUpdateComponent;
  let fixture: ComponentFixture<FormUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
