import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Visitor } from 'src/app/shared/interfaces/visitor';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { StaffService } from 'src/app/shared/services/staff-service';

@Component({
  selector: 'app-visitor-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './visitor-card.html',
  styleUrls: ['./visitor-card.css']
})
export class VisitorCard {

  @Output() editVisitor = new EventEmitter<Visitor>();
  @Output() deleteVisitor = new EventEmitter<Visitor>();

  visitorData: Visitor | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Visitor,
  //public: for use in the template
    public staffService: StaffService,
    public dialogRef: MatDialogRef<VisitorCard>
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
    this.editVisitor.emit(this.data);
    this.dialogRef.close();
  };

  onDelete() {
    if (!this.canDelete()) return;
    this.deleteVisitor.emit(this.data);
    this.dialogRef.close();
  };
}
