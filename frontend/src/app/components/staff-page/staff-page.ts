import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffForm } from '../staff-form/staff-form';
import { StaffTable } from '../staff-table/staff-table';
import { StaffMember } from 'src/app/shared/interfaces/staff-member';
import { StaffService } from 'src/app/shared/services/staff-service';
import { StaffCard } from '../staff-card/staff-card';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-staff-page',
  standalone: true,
  imports: [StaffForm, StaffTable, MatButton, MatDialogModule, CommonModule],
  templateUrl: './staff-page.html',
  styleUrls: ['./staff-page.css'],
})
export class StaffPage {
  staffService = inject(StaffService);
  private dialog = inject(MatDialog);

  showForm = false;

  addStaff(staff: StaffMember) {
    this.staffService.addStaffMember(staff);
    this.showForm = false; // hide form after submit
  };

  onStaffClicked(staffMember: StaffMember) {
    const dialogRef = this.dialog.open(StaffCard, {
      data: staffMember,
      width: '400px',
    });

    // subscribe to the updateStaff event emitted from staff-card and use updateStaff() from staff-service
      dialogRef.componentInstance.editStaffMember.subscribe((edited: StaffMember) => {
        this.staffService.updateStaffMember(edited);
      });
  
      // subscribe to the deleteStaffMember event emitted from staff-card and use deletStaffMember() from staff-service
      dialogRef.componentInstance.deleteStaffMember.subscribe((deleted: StaffMember) => {
        this.staffService.removeStaffMember(deleted.username);
      });
  };

  isAdmin(): boolean {
    const roles = this.staffService.staff$()?.roles ?? [];
    return roles.includes('ADMIN');
  };
};