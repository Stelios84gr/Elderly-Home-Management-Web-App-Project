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
import { MatCheckboxModule} from '@angular/material/checkbox'
import { Visitor } from 'src/app/shared/interfaces/visitor';

@Component({
  selector: 'app-visitors-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './visitor-form.html',
  styleUrls: ['./visitor-form.css']
})
export class VisitorsForm {
@Output() visitor = new EventEmitter<Visitor>()

visitorForm = new FormGroup({
    username: new FormControl({value: '', disabled: true}, Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required)
    }),
    relationship: new FormControl('', Validators.required),
    isFamily: new FormControl(false, Validators.required)
  });

  // get value changes for firstName & lastName to be used in username auto-generation
  constructor() {
    this.visitorForm.get('firstName')?.valueChanges.subscribe(() => this.generateUsername());
    this.visitorForm.get('lastName')?.valueChanges.subscribe(() => this.generateUsername());
  };

  // only to be used in the form
  private generateUsername() {
    const firstName = this.visitorForm.get('firstName')?.value;
    const lastName = this.visitorForm.get('lastName')?.value;
    let username = '';

    if (firstName && lastName) {
    username = `2${lastName.charAt(0).toLowerCase()}${firstName.toLowerCase()}${lastName.length}`;
    };

    this.visitorForm.get('username')?.setValue(username, { emitEvent: false });
  };

  onSubmit() {
      if (this.visitorForm.valid) {
        console.log("Valid Form:", this.visitorForm.value);
        const visitor: Visitor = {
          // getRawValue(): include a disabled field
          username: this.visitorForm.getRawValue().username ?? '',
          firstName: this.visitorForm.value.firstName ?? '',
          lastName: this.visitorForm.value.lastName ?? '',
          phoneNumber: Number(this.visitorForm.value.phoneNumber),
          address: {
            street: this.visitorForm.value.address?.street ?? '',
            number: this.visitorForm.value.address?.number ?? ''
          },
          relationship: this.visitorForm.value.relationship ?? '',
          isFamily: this.visitorForm.value.isFamily ?? false
        };
        this.visitor.emit(visitor);
        this.visitorForm.reset();
      };
    };
};
