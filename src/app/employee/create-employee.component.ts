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

  // This object will hold the messages to be displayed to the user
// Notice, each key in this object has the same name as the
// corresponding form control
formErrors: any = {
  'fullName': '',
  'email': '',
  'phone':'',
  'skillName': '',
  'experienceInYears': '',
  'proficiency': ''
};

// This object contains all the validation messages for this form
validationMessages: any = {
  'fullName': {
    'required': 'Full Name is required.',
    'minlength': 'Full Name must be greater than 2 characters.',
    'maxlength': 'Full Name must be less than 10 characters.'
  },

  'email': {
    'required': 'Email is required.'
  },
  'phone': {
    'required': 'Phone is required.'
  },
  'skillName': {
    'required': 'Skill Name is required.',
  },
  'experienceInYears': {
    'required': 'Experience is required.',
  },
  'proficiency': {
    'required': 'Proficiency is required.',
  },
};

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
      contactPreference: ['email'],
      email: ['', Validators.required],
      phone:[''],
      skills: this._fb.group({
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['beginner', Validators.required]
      })
    });

    this.employeeForm.get('fullName')?.valueChanges.subscribe((value : string) => {this.fullNameLength = value.length} );
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });
  }

  onSubmit(): void{
    console.log(this.employeeForm.value);
  }

  // onLoadDataClick(): void{
  //   this.employeeForm.setValue({
  //     fullName: 'John',
  //     email: 'john@john.com',
  //     skills:{
  //       skillName: 'C#',
  //       experienceInYears: 5,
  //       proficiency: 'beginner'
  //     }
  //   })
  // }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get the control. The control can be a nested form group
      const abstractControl = group.get(key);
      // If the control is nested form group, recursively call
      // this same method
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
        // If the control is a FormControl
      } else {
        // Clear the existing validation errors
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)) {
          // Get all the validation messages of the form control
          // that has failed the validation
          const messages = this.validationMessages[key];
          // Find which validation has failed. For example required,
          // minlength or maxlength. Store that error message in the
          // formErrors object. The UI will bind to this object to
          // display the validation errors
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }
  
  onLoadDataClick(): void {
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }

  onContactPreferenceChange(selectedValue: string):void{
    const phoneControl = this.employeeForm.get('phone');

    if(selectedValue === 'phone'){
      phoneControl?.setValidators(Validators.required);
    }
    else{
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
  }
}
