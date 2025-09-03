import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Patient } from 'src/app/shared/interfaces/patient';
import {sortBy} from 'lodash-es';


type SortDirection = 'asc' | 'desc' | 'none';

@Component({
  selector: 'app-patients-table',
  standalone: true,
  imports: [],
  templateUrl: './patients-table.html',
  styleUrls: ['./patients-table.css']
})
export class PatientsTable {
@Input() data: Patient[] | undefined;
@Output() patientClicked = new EventEmitter<Patient>();

  patientData: Patient[] = [];

  //show only a selective document fields in list
  sortOrder: Partial<Record<keyof Patient, SortDirection>> = {
    firstName: 'none',
    lastName: 'none',
    AMKA: 'none',
    dateOfBirth: 'none',
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.patientData = [...this.data];
    };
  };

  onPatientClicked(patient: Patient): void {
    console.log("Patient clicked:", patient);
    this.patientClicked.emit(patient);
  };

  sortData(sortKey: keyof Patient): void {
    // safety check
    if (!this.data) return;

    // use this sorting method if the sortKey is a date (sortBy alone is not ideal for dates)
    if (sortKey === 'dateOfBirth') {
      // create a shallow copy to avoid mutating the original array
      this.patientData = [...this.data].sort((a, b) => {
        const timeA = new Date(a.dateOfBirth).getTime();
        const timeB = new Date(b.dateOfBirth).getTime();
        
        // toggle asc/desc
      if (this.sortOrder[sortKey] === 'asc') return timeB - timeA;
      else return timeA - timeB;
      });
    } else {
      // use standard sorting method (sortBy)
      // desc
      if (this.sortOrder[sortKey] === 'asc') {
        this.sortOrder[sortKey] = 'desc';
        this.patientData = sortBy(this.data, sortKey).reverse();
        // asc
      } else {
        this.sortOrder[sortKey] = 'asc';
        this.patientData = sortBy(this.data, sortKey);
      };
    };

    // reset all other columns
    for (let key in this.sortOrder) {
      if (key !== sortKey) {
        this.sortOrder[key as keyof Patient] = 'none';
      };
    };
  };

  sortSign(sortKey: keyof Patient) {
    if (this.sortOrder[sortKey] === 'asc') return '\u2191';
    else if (this.sortOrder[sortKey] === 'desc') return '\u2193';
    else return '';
    };
};