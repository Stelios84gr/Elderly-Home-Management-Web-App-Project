import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorForm } from '../visitor-form/visitor-form';
import { VisitorsTable } from '../visitors-table/visitors-table';
import { Visitor } from 'src/app/shared/interfaces/visitor';
import { VisitorService } from 'src/app/shared/services/visitor-service';
import { PatientService } from 'src/app/shared/services/patient-service';
import { StaffService } from 'src/app/shared/services/staff-service';
import { VisitorCard } from '../visitor-card/visitor-card';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-visitors-page',
  standalone: true,
  imports: [VisitorForm, VisitorsTable, MatButton, MatDialogModule, CommonModule],
  templateUrl: './visitors-page.html',
  styleUrls: ['./visitors-page.css'],
})
export class VisitorsPage {
  showForm = false;
  visitorService = inject(VisitorService);
  staffService = inject(StaffService);
  private dialog = inject(MatDialog);

  addVisitor(visitor: Visitor) {
    this.visitorService.addVisitor(visitor);
    this.showForm = false; // hide form after submit
  };

  onVisitorClicked(visitor: Visitor) {
    const dialogRef = this.dialog.open(VisitorCard, {
      data: visitor,
      width: '400px',
    });

    // subscribe to the updateVisitor event emitted from visitor-card and use updateVisitor() from visitor-service
      dialogRef.componentInstance.editVisitor.subscribe((edited: Visitor) => {
        this.visitorService.updateVisitor(edited);
      });
    
        // subscribe to the deleteVisitor event emitted from visitor-card and use deletVisitor() from visitor-service
        dialogRef.componentInstance.deleteVisitor.subscribe((deleted: Visitor) => {
          this.visitorService.removeVisitor(deleted.username);
        });
  };

  isAdmin(): boolean {
    const roles = this.staffService.staff$()?.roles ?? [];
    return roles.includes('ADMIN');
  };
};
