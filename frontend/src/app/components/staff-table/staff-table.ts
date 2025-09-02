import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { StaffMember } from 'src/app/shared/interfaces/staff-member';
import {sortBy} from 'lodash-es';


type SortDirection = 'asc' | 'desc' | 'none';

@Component({
  selector: 'app-staff-table',
  standalone: true,
  imports: [],
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
    if (changes['data'] && this.data) {
      this.staffData = this.data;
    };
  };

  onStaffClicked(staff: StaffMember): void {
    console.log("Staff member clicked:", staff);
    this.staffClicked.emit(staff);
  };

  sortData(sortKey: keyof StaffMember): void {
    // safety check
    if (!this.data) return;

    // desc
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.staffData = sortBy(this.data, sortKey).reverse();
    // asc
    } else {
      this.sortOrder[sortKey] = 'asc';
      this.staffData = sortBy(this.data, sortKey);
    };

    // reset all other columns
    for (let key in this.sortOrder) {
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
};
