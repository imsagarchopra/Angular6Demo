import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {

  employees!: IEmployee[];

  constructor(private _employeeService: EmployeeService, private _router: Router){}

  ngOnInit(): void {
    this._employeeService.getEmployees().subscribe(
      (listEmployees) => this.employees = listEmployees
    );
  }

  editButtonClick(employeeId: number):void{
    this._router.navigate(['employees/edit',employeeId]);
  }
}
