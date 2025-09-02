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
import { last } from 'rxjs';

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
    username: new FormControl({value: '', disabled: true}, Validators.required),
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
    startDate: new FormControl(null, Validators.required),
    monthlySalary: new FormControl('', Validators.required)
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
      console.log("Valid Form:", this.staffForm.value);
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
        roles: this.staffForm.value.roles ?? [],
        // asserts startDate is never null
        startDate: new Date(this.staffForm.value.startDate!) ?? new Date(),
        monthlySalary: Number(this.staffForm.value.monthlySalary)
      };
      this.staff.emit(staffMember);
      // reset so that role selet menu doesn't retain previous values
      this.staffForm.reset({ roles:[] });
      this.staffForm.reset();
    };
  };
};
