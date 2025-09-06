import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffMember } from 'src/app/shared/interfaces/staff-member';
import {sortBy} from 'lodash-es';


type SortDirection = 'asc' | 'desc' | 'none';

@Component({
  selector: 'app-staff-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-table.html',
  styleUrls: ['./staff-table.css']
})
export class StaffTable {
@Input() data: StaffMember[] | undefined;
@Output() staffClicked = new EventEmitter<StaffMember>();

  staffData: StaffMember[] = [];

  //show only a selective document fields in list
  sortOrder: Partial<Record<keyof StaffMember, SortDirection>> = {
    firstName: 'none',
    lastName: 'none',
    email: 'none',
    phoneNumber: 'none',
    occupation: 'none',
    monthlySalary: 'none'
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (Array.isArray(this.data)) {
        this.staffData = [...this.data];  // safe copy
      } else {
        this.staffData = [];  // fallback to empty array
      };
    };
  };

  onStaffClicked(staff: StaffMember): void {
    console.log("Staff member clicked:", staff);
    this.staffClicked.emit(staff);
    console.log("PatientTable received data:", this.staffData);
  };

  sortData(sortKey: keyof StaffMember): void {
    // safety check
    if (!this.data) return;

     // toggle sort direction for the column
    this.sortOrder[sortKey] = this.sortOrder[sortKey] === 'asc' ? 'desc' : 'asc';

    this.staffData = this.sortOrder[sortKey] === 'asc'
      // asc
      ? sortBy(this.data, sortKey)
      // desc
      : sortBy(this.data, sortKey).reverse();

    // reset all other columns
    for (const key in this.sortOrder) {
      if (key !== sortKey) {
        this.sortOrder[key as keyof StaffMember] = 'none';
      };
    };
  };

  sortSign(sortKey: keyof StaffMember) {
    if (this.sortOrder[sortKey] === 'asc') return '\u2191';
    else if (this.sortOrder[sortKey] === 'desc') return '\u2193';
    else return '';
    };

    trackByStaffMember(index: number, staffMember: StaffMember) {
      return staffMember.username;
    };
};
