import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Patient } from 'src/app/shared/interfaces/patient';
import {sortBy} from 'lodash-es';
import { PatientCard } from '../patient-card/patient-card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


type SortDirection = 'asc' | 'desc' | 'none';

@Component({
  selector: 'app-patients-table',
  standalone: true,
  imports: [DatePipe, CommonModule, MatDialogModule],
  templateUrl: './patients-table.html',
  styleUrls: ['./patients-table.css']
})
export class PatientsTable {
@Input() data: Patient[] | undefined;
@Output() patientClicked = new EventEmitter<Patient>();

  // local copy to use for sorting without mutating @Input()
  patientData: Patient[] = [];

  //show only a selective document fields in list
  sortOrder: Partial<Record<keyof Patient, SortDirection>> = {
    firstName: 'none',
    lastName: 'none',
    AMKA: 'none',
    dateOfBirth: 'none',
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      // empty array if undefined
      if (Array.isArray(this.data)) {
        this.patientData = [...this.data]; // safe copy
      } else {
        this.patientData = []; // fallback to empty array
      };
    };
  };

  sortData(sortKey: keyof Patient): void {
  // safety check
  if (!this.data) return;

  // shallow copy
  let sortedData = [...(this.data ?? [])];

  // use this sorting method if the sortKey is a date (sortBy alone is not ideal for dates)
  if (sortKey === 'dateOfBirth') {
    // sort dates numerically
    sortedData.sort((a, b) => {
      const timeA = new Date(a.dateOfBirth).getTime();
      const timeB = new Date(b.dateOfBirth).getTime();
      // toggle asc/desc
      return this.sortOrder[sortKey] === 'asc' ? timeB - timeA : timeA - timeB;
    });
    
    // toggle sort direction for the column
    this.sortOrder[sortKey] = this.sortOrder[sortKey] === 'asc' ? 'desc' : 'asc';
  } else {
    // use standard sorting method (sortBy)
    sortedData = this.sortOrder[sortKey] === 'asc'
      ? sortBy(sortedData, sortKey).reverse()  // desc
      : sortBy(sortedData, sortKey);           // asc

    // toggle sort direction for the column
    this.sortOrder[sortKey] = this.sortOrder[sortKey] === 'asc' ? 'desc' : 'asc';
  };

  // reset all other columns
  for (const key in this.sortOrder) {
    if (key !== sortKey) this.sortOrder[key as keyof Patient] = 'none';
  };

  // update the table with the sorted data
  this.patientData = sortedData;
};

  sortSign(sortKey: keyof Patient) {
    if (this.sortOrder[sortKey] === 'asc') return '\u2191';
    else if (this.sortOrder[sortKey] === 'desc') return '\u2193';
    else return '';
    };

    trackByPatient(index: number, patient: Patient) {
      return patient.username;
    };
};