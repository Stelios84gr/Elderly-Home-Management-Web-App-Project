import { Component, EventEmitter } from '@angular/core';
import { StaffForm } from '../staff-form/staff-form';
import { StaffMember } from 'src/app/shared/interfaces/staff-member';

@Component({
  selector: 'app-staff-table',
  standalone: true,
  imports: [StaffForm],
  templateUrl: './staff-table.html',
  styleUrls: ['./staff-table.css']
})
export class StaffTable {

}
