import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm !: FormGroup;

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
      fullName : [''],
      email: [''],

      skills: this._fb.group({
        skillName: [''],
        experienceInYears: [''],
        proficiency: ['beginner']
      })
    });
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
