import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm !: FormGroup;
  fullNameLength: number = 0;

  constructor(private _fb:FormBuilder){ }

  ngOnInit(): void {
    // this.employeeForm = new FormGroup({
    //   fullName : new FormControl(),
    //   email: new FormControl(),

    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    // });

    this.employeeForm = this._fb.group({
      fullName : ['',[Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      email: [''],

      skills: this._fb.group({
        skillName: [''],
        experienceInYears: [''],
        proficiency: ['beginner']
      })
    });

    this.employeeForm.get('fullName')?.valueChanges.subscribe((value : string) => {this.fullNameLength = value.length} );
  }

  onSubmit(): void{
    console.log(this.employeeForm.value);
  }

  onLoadDataClick(): void{
    this.employeeForm.setValue({
      fullName: 'John',
      email: 'john@john.com',
      skills:{
        skillName: 'C#',
        experienceInYears: 5,
        proficiency: 'beginner'
      }
    })
  }
}
