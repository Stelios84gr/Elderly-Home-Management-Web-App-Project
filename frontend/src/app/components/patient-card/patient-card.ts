import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Patient } from 'src/app/shared/interfaces/patient';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { StaffService } from 'src/app/shared/services/staff-service';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './patient-card.html',
  styleUrls: ['./patient-card.css']
})
export class PatientCard {

  @Output() editPatient = new EventEmitter<Patient>();
  @Output() deletePatient = new EventEmitter<Patient>();

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: Patient,
  //public: for use in the template
  public staffService: StaffService,
  public dialogRef: MatDialogRef<PatientCard>
  ) {};

  //role-based button disabling/enabling
  canEdit(): boolean {
  const roles = this.staffService.staff$()?.roles ?? [];
  return roles.includes('ADMIN') || roles.includes('EDITOR');
  };

  canDelete(): boolean {
  const roles = this.staffService.staff$()?.roles ?? [];
  return roles.includes('ADMIN');
  };

  canView(): boolean {
  const roles = this.staffService.staff$()?.roles ?? [];
  return roles.includes('READER');
  };

  onEdit() {
    if (!this.canEdit()) return;
    this.editPatient.emit(this.data);
    this.dialogRef.close();
  };

  onDelete() {
    if (!this.canDelete()) return;
    this.deletePatient.emit(this.data);
    this.dialogRef.close();
  };
};