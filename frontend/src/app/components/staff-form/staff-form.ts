import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { StaffMember } from 'src/app/shared/interfaces/staff-member';

@Component({
  selector: 'app-staff-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './staff-form.html',
  styleUrls: ['./staff-form.css']
})
export class StaffForm {
  @Output() staff = new EventEmitter<StaffMember>()

  staffForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required, Validators.email
    ]),
    TIN: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required)
    }),
    occupation: new FormControl('', Validators.required),
    roles: new FormControl([], Validators.required),
    // makes sure startDate default value is never null or undefined
    startDate: new FormControl(new Date(), Validators.required),
    monthlySalary: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.staffForm.valid) {
      console.log("Valid Form:", this.staffForm.value);
      const staffMember: StaffMember = {
        username: this.staffForm.value.username ?? '',
        password: this.staffForm.value.password ?? '',
        firstName: this.staffForm.value.firstName ?? '',
        lastName: this.staffForm.value.lastName ?? '',
        TIN: this.staffForm.value.TIN ?? '',
        phoneNumber: Number(this.staffForm.value.phoneNumber),
        address: {
          street: this.staffForm.value.address?.street ?? '',
          number: this.staffForm.value.address?.number ?? ''
        },
        occupation: this.staffForm.value.occupation ?? '',
        roles: this.staffForm.value.roles ?? [],
        // asserts startDate is never null
        startDate: new Date(this.staffForm.value.startDate!) ?? new Date(),
        monthlySalary: Number(this.staffForm.value.monthlySalary)
      };
      this.staff.emit(staffMember);
      this.staffForm.reset();
    };
  };
};
