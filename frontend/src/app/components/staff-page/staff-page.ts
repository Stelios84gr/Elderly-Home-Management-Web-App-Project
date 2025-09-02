import { Component } from '@angular/core';
import { StaffForm } from '../staff-form/staff-form';
import { StaffTable } from '../staff-table/staff-table';
import { StaffMember } from 'src/app/shared/interfaces/staff-member';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-staff-page',
  standalone: true,
  imports: [StaffForm, StaffTable, MatButton],
  templateUrl: './staff-page.html',
  styleUrls: ['./staff-page.css']
})
export class StaffPage {
  showForm = false;
  staffList: StaffMember[] = [];

  addStaff(staff: StaffMember) {
    this.staffList.push(staff);
    this.showForm = false;  // hide form after submit
  };
};
