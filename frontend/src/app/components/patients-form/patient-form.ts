import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormArray,
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
import { Patient } from 'src/app/shared/interfaces/patient';

@Component({
  selector: 'app-patient-form',
  standalone: true,
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
  templateUrl: './patient-form.html',
  styleUrls: ['./patient-form.css']
})
export class PatientForm {
  @Output() patient = new EventEmitter<Patient>()

  patientForm = new FormGroup({
    username: new FormControl({value: '', disabled: true}, Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    AMKA: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    authorizationToLeave: new FormControl(false, Validators.required),
    roomData: new FormGroup({
      roomNumber: new FormControl('', Validators.required),
      bedNumber: new FormControl('', Validators.required)
    }),
    // FormArray for possible multiple ailments
    patientAilments: new FormArray([
      new FormGroup({
      disease: new FormControl('', Validators.required),
      severity: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
       ])
      })
    ]),
    emergencyContactInfo: new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phoneNumber: new FormControl(null, Validators.required),
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        number: new FormControl('', Validators.required)
      }),
      kinshipDegree: new FormControl('', Validators.required)
    }),

    // should be empty on patient creation
    visitors: new FormArray([])
  });

  // get value changes for firstName & lastName to be used in username auto-generation
  constructor() {
    this.patientForm.get('firstName')?.valueChanges.subscribe(() => this.generateUsername());
    this.patientForm.get('lastName')?.valueChanges.subscribe(() => this.generateUsername());
  };

  get patientAilmentsArray() {
    return this.patientForm.get('patientAilments') as FormArray;
  };

  get emergencyContactInfo() {
    return this.patientForm.get('emergencyContactInfo')?.value;
  }

  // only to be used in the form
  private generateUsername() {
    const firstName = this.patientForm.get('firstName')?.value;
    const lastName = this.patientForm.get('lastName')?.value;
    let username = '';

    if (firstName && lastName) {
    username = `3${lastName.charAt(0).toLowerCase()}${firstName.toLowerCase()}${lastName.length}`;
    };

    this.patientForm.get('username')?.setValue(username, { emitEvent: false });
  };

  addAilment() {
    this.patientAilmentsArray.push(
      new FormGroup({
        disease: new FormControl('', Validators.required),
        severity: new FormControl(null, 
          [
            Validators.required,
            Validators.min(1),
            Validators.max(5)
          ]
          )
      })
    );
  };

  removeAilment(index: number) {
    this.patientAilmentsArray.removeAt(index);
  };

  onSubmit() {
    if (this.patientForm.valid) {
      console.log("Valid Form:", this.patientForm.value);
      
      const patient: Patient = {
        // getRawValue(): include a disabled field
        username: this.patientForm.getRawValue().username ?? '',
        firstName: this.patientForm.value.firstName ?? '',
        lastName: this.patientForm.value.lastName ?? '',
        AMKA: this.patientForm.value.AMKA ?? '',
        // asserts dateOfBirth is never null
        dateOfBirth: new Date(this.patientForm.value.dateOfBirth!),
        phoneNumber: Number(this.patientForm.value.phoneNumber),
        authorizationToLeave: this.patientForm.value.authorizationToLeave ?? false,
        roomData: {
          roomNumber: this.patientForm.value.roomData?.roomNumber ?? '',
          bedNumber: this.patientForm.value.roomData?.bedNumber ?? ''
        },
        patientAilments: this.patientForm.value.patientAilments?.map((ailment: any) => ({
          disease: ailment.disease ?? '',
          severity: ailment.severity ?? 1
        })) ?? [],
        emergencyContactInfo: {
          firstName: this.patientForm.value.emergencyContactInfo?.firstName ?? '',
          lastName: this.patientForm.value.emergencyContactInfo?.lastName ?? '',
          phoneNumber: Number(this.patientForm.value.emergencyContactInfo?.phoneNumber ?? 0),
          address: {
            street: this.patientForm.value.emergencyContactInfo?.address?.street ?? '',
            number: Number(this.patientForm.value.emergencyContactInfo?.address?.number ?? ''),
          },
          kinshipDegree: this.patientForm.value.emergencyContactInfo?.kinshipDegree ?? ''
        },
        visitors: this.patientForm.value.visitors ?? [],
      };
      this.patient.emit(patient);
      // reset so that role selet menu doesn't retain previous values
      this.patientForm.reset();
    };
  };
};
