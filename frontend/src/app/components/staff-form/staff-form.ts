import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './staff-form.html',
  styleUrls: ['./staff-form.css']
})
export class StaffForm {
  @Output() staff = new EventEmitter<StaffMember>()

  staffForm = new FormGroup({
    username: new FormControl({value: '', disabled: true}, Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(75)
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)
    ]),
    email: new FormControl('', [
      Validators.required, Validators.email
    ]),
    TIN: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{10}$/)
    ]),
    address: new FormGroup({
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ]),
      number: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5)
      ])
    }),
    occupation: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20)
    ]),
    roles: new FormControl([], Validators.required),
    // makes sure startDate default value is never null or undefined
    startDate: new FormControl(new Date(), Validators.required),
    monthlySalary: new FormControl(null, [
      Validators.required,
    Validators.min(100), Validators.max(9999)
  ])
  });

  // get value changes for firstName & lastName to be used in username auto-generation
  constructor() {
    this.staffForm.get('firstName')?.valueChanges.subscribe(() => this.generateUsername());
    this.staffForm.get('lastName')?.valueChanges.subscribe(() => this.generateUsername());
  };

  // only to be used in the form
  private generateUsername() {
    const firstName = this.staffForm.get('firstName')?.value;
    const lastName = this.staffForm.get('lastName')?.value;
    let username = '';

    if (firstName && lastName) {
    username = `3${lastName.charAt(0).toLowerCase()}${firstName.toLowerCase()}${lastName.length}`;
    };

    this.staffForm.get('username')?.setValue(username, { emitEvent: false });
  };

  onSubmit() {
    if (this.staffForm.valid) {
      console.log("Valid Form:", this.staffForm.value.roles);

      const staffMember: StaffMember = {
        // getRawValue(): include a disabled field
        username: this.staffForm.getRawValue().username ?? '',
        password: this.staffForm.value.password ?? '',
        firstName: this.staffForm.value.firstName ?? '',
        lastName: this.staffForm.value.lastName ?? '',
        email: this.staffForm.value.email ?? '',
        TIN: this.staffForm.value.TIN ?? '',
        phoneNumber: Number(this.staffForm.value.phoneNumber),
        address: {
          street: this.staffForm.value.address?.street ?? '',
          number: this.staffForm.value.address?.number ?? ''
        },
        occupation: this.staffForm.value.occupation ?? '',
        roles: (this.staffForm.value.roles as string[] ?? []).flat().map(r => r.toUpperCase()),
        // asserts startDate is never null
        startDate: new Date(this.staffForm.value.startDate!) ?? new Date(),
        monthlySalary: Number(this.staffForm.value.monthlySalary)
      };

      this.staff.emit(staffMember);
      // reset the form
      this.staffForm.reset();
    } else {
      // errors only show when form is invalid, not after submission
      this.staffForm.markAllAsTouched();
    };
  };
};
