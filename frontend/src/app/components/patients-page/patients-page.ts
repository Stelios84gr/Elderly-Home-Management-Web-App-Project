import { Component } from '@angular/core';
import { PatientForm } from '../patients-form/patient-form';
import { PatientsTable } from '../patients-table/patients-table';
import { MatButton } from '@angular/material/button';
import { Patient } from 'src/app/shared/interfaces/patient';


@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [PatientForm, PatientsTable, MatButton],
  templateUrl: './patients-page.html',
  styleUrls: ['./patients-page.css']
})
export class StaffPage {
  showForm = false;
  patientsList: Patient[] = [];

  addPatient(patient: Patient) {
    this.patientsList.push(patient);
    this.showForm = false;  // hide form after submit
  };
};
