import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomValidators } from '../shared/custom.validators';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';

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
    'emailGroup': '',
    'email': '',
    'confirmEmail': '',
    'phone': '',
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
    'emailGroup':{
      'emailMismatch': 'Email and Confirm Email do not match'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domain should be gmail.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required.',
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

  constructor(private _fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService) { }

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
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],

      emailGroup: this._fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('gmail.com')]],
        confirmEmail:['', Validators.required]
      },{validator: CustomValidators.matchEmail}),
      phone: [''],
      skills: this._fb.array([
        this.addSkillFormGroup()
      ])
    });

    this.employeeForm.get('fullName')?.valueChanges.subscribe((value: string) => { this.fullNameLength = value.length });
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.route.paramMap.subscribe(params => {
      const empId = <number><unknown>params.get('id');

      if(empId){
        this.getEmployee(empId);
      }
    });
  }

  getEmployee(id: number):void{
    this.employeeService.getEmployee(id).subscribe(
      (employee : IEmployee) => this.editEmployee(employee),(err: any) => console.log(err)
    );
  }

  editEmployee(employee : IEmployee): void{
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup:{
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    this.employeeForm.setControl('skills',this.setExistingSkills(employee.skills));
  }

  setExistingSkills(skillSets: ISkill[]): FormArray{
    const formArray = new FormArray<any>([]);

    skillSets.forEach(s => {
      formArray.push(this._fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });

    return formArray;
  }

  addSkillButtonClick(): void{
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  onSubmit(): void {
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

       // Clear the existing validation errors
       this.formErrors[key] = '';
       if (abstractControl && !abstractControl.valid &&
         (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '' )) {
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

      // If the control is nested form group, recursively call
      // this same method
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
        // If the control is a FormControl
      } 

      if (abstractControl instanceof FormArray) {
        for(const control of abstractControl.controls){
          if(control instanceof FormGroup){
            this.logValidationErrors(control);
           
          }
        }
      
      } 
    });
  }

  onLoadDataClick(): void {
    const formArray = new FormArray([
      new FormControl('John', Validators.required),
      new FormGroup({
        country: new FormControl('', Validators.required)
      }),
      new FormArray([])
    ]);

    for(const control of formArray.controls){
      if(control instanceof FormControl){
        console.log('Control is FormControl');
      }
      if(control instanceof FormGroup){
        console.log('Control is FormGroup');
      }
      if(control instanceof FormArray){
        console.log('Control is FormArray');
      }
    }

    //Other way to create form array using form builder
    const formArray1 = this._fb.array([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Male', Validators.required)
    ]);

    formArray1.push(new FormControl('Mark', Validators.required));
  }

  onContactPreferenceChange(selectedValue: string): void {
    const phoneControl = this.employeeForm.get('phone');

    if (selectedValue === 'phone') {
      phoneControl?.setValidators(Validators.required);
    }
    else {
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
  }

  addSkillFormGroup() : FormGroup{
    return this._fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['beginner', Validators.required]
    })
  }

  removeSkillButtonClick(skillGroupIndex : number): void{
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }
}
