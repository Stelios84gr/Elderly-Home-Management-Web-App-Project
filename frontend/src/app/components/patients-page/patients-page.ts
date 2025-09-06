import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientForm } from '../patient-form/patient-form';
import { PatientsTable } from '../patients-table/patients-table';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Patient } from 'src/app/shared/interfaces/patient';
import { PatientService } from 'src/app/shared/services/patient-service';
import { PatientCard } from '../patient-card/patient-card';
import { StaffService } from 'src/app/shared/services/staff-service';


@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [CommonModule, PatientForm, PatientsTable, MatButton, MatDialogModule],
  templateUrl: './patients-page.html',
  styleUrls: ['./patients-page.css'],
})
export class PatientsPage {
  patientsService = inject(PatientService);
  staffService = inject(StaffService);
  private dialog = inject(MatDialog);

  showForm = false;

  selectedPatient?: Patient;

  addPatient(patient: Patient) {
    this.patientsService.addPatient(patient);
    this.showForm = false; // hide form after submit
  };

  editPatient(editedFromForm: Partial<Patient>) {
    if (!this.selectedPatient) return;

    // Only send changes
    this.patientsService.updatePatient(this.selectedPatient, editedFromForm);

    // reset selectedPatient and hide form after edit
    this.selectedPatient = undefined;
    this.showForm = false;
  };
  

  onPatientClicked(patient: Patient) {
    this.selectedPatient = patient;

    const dialogRef = this.dialog.open(PatientCard, {
      data: patient,
      width: '400px',
    });

    // subscribe to the updatePatient event emitted from patient-card and use updatePatient() from patient-service
    dialogRef.componentInstance.editPatient.subscribe((edited: Partial<Patient>) => {
      this.editPatient(edited);
    });

    // subscribe to the deletePatient event emitted from patient-card and use deletPatient() from patient-service
    dialogRef.componentInstance.deletePatient.subscribe((deleted: Patient) => {
      this.patientsService.removePatient(deleted.username);
    });
  }

  isAdmin(): boolean {
    const roles = this.staffService.staff$()?.roles ?? [];
    return roles.includes('ADMIN');
  }
};