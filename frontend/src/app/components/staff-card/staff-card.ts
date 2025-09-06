import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StaffMember } from 'src/app/shared/interfaces/staff-member';
import { StaffService } from 'src/app/shared/services/staff-service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-staff-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
],
  templateUrl: './staff-card.html',
  styleUrls: ['./staff-card.css']
})
export class StaffCard {

  @Output() editStaffMember = new EventEmitter<StaffMember>();
  @Output() deleteStaffMember = new EventEmitter<StaffMember>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: StaffMember,
  //public: for use in the template
  public staffService: StaffService,
  public dialogRef: MatDialogRef<StaffCard>) {};

  //role-based button disabling/enabling
  canEdit(): boolean {
  const roles = this.staffService.staff$()?.roles ?? [];
  return roles.includes('EDITOR') || roles.includes('ADMIN');
  };

  canDelete(): boolean {
  const roles = this.staffService.staff$()?.roles ?? [];
  return roles.includes('ADMIN');
  };

  canView(): boolean {
  const roles = this.staffService.staff$()?.roles ?? [];
  return roles.includes('READER') || roles.includes('EDITOR') || roles.includes('ADMIN');
  };

  onEdit() {
    if (!this.canEdit()) return;
    this.editStaffMember.emit(this.data);
    this.dialogRef.close();
  };

  onDelete() {
    if (!this.canDelete()) return;
    this.deleteStaffMember.emit(this.data);
    this.dialogRef.close();
  };
};