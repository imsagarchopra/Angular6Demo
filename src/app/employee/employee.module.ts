import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateEmployeeComponent } from './create-employee.component';
import { ListEmployeesComponent } from './list-employees.component';


@NgModule({
  declarations: [
    CreateEmployeeComponent,
    ListEmployeesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    
  ]
})
export class EmployeeModule { }
