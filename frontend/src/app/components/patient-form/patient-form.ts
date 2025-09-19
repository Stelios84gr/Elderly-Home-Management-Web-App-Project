import { Component, EventEmitter, Output, Input, SimpleChange, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Patient } from 'src/app/shared/interfaces/patient';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

export const bedMatchesRoomValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {

    // bedNumber first 2 digits are those of the roomNumber check (business logic)
    const roomNumber = group.get('roomNumber')?.value;
    const bedNumber = group.get('bedNumber')?.value;

    if (!roomNumber || !bedNumber) {
      return null; // no validation if either field is missing
    };

    //check if the first 2 digits of bedNumber equal roomNumber
    const isValid = bedNumber.startsWith(roomNumber);

    return isValid ? null : {bedRoomMismatch: true};
  }

@Component({
  selector: 'app-patient-form',
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
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './patient-form.html',
  styleUrls: ['./patient-form.css']
})
export class PatientForm implements OnChanges {
  @Output() patient = new EventEmitter<Patient>();

  // use form component to also edit existing patients
  @Input() patientToEdit?: Patient;

  patientForm = new FormGroup({
    username: new FormControl({ value: '', disabled: true }),
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
    AMKA: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
      Validators.pattern(/^\d{11}$/)
    ]),
    dateOfBirth: new FormControl('', [
      Validators.required
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{10}$/)
    ]),
    // can be left unticked
    authorizationToLeave: new FormControl(false),
    roomData: new FormGroup({
      roomNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(2),
        Validators.pattern(/^\d{2}$/)
      ]),
      bedNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern(/^\d{4}$/)
      ])
    },
    { validators: bedMatchesRoomValidator} // bedNumber first 2 digits should be roomNumber digits
  ),
    // FormArray for possible multiple ailments
    patientAilments: new FormArray([
      new FormGroup({
      disease: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25)
      ]),
      severity: new FormControl(null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5)
        ])
      })
    ]),
    emergencyContactInfo: new FormGroup({
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
      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{10}$/)
      ]),
      address: new FormGroup({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20)
        ]),
        // minLength & maxLength instead of min/max in case of street numbers like "1120A"
        number: new FormControl('', [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
        ],
      )
      }),
      kinshipDegree: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ])
    }),
    // should be empty on patient creation
    visitors: new FormArray([])
  });

  ngOnChanges(changes: SimpleChanges) {

    const patientChange: SimpleChange | undefined = changes['patientToEdit'];

    // for nested objects
    if (patientChange?.currentValue) {
      this.patientForm.patchValue({
        ...patientChange.currentValue,
        roomData: patientChange.currentValue.roomData || {},
        emergencyContactInfo: patientChange.currentValue.emergencyContactInfo || {}
      });
    };
  };

  // visitors array to be created once the first visitor has been added
  get visitorsArray() {
    return this.patientForm.get('visitors') as FormArray;
  };

  // add visitor(s) in patient with only the 2 fields defined in visitorsSchema
  // visitor FormGroups include optional _id for backend reference
  addVisitor(visitorId?: string) {
    const visitorGroup = new FormGroup({
    _id: new FormControl(visitorId || null),
    relationship: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15)
    ])
  });

  this.visitorsArray.push(visitorGroup);
};

removeVisitor(index: number) {
  this.visitorsArray.removeAt(index);
};

  // get value changes for firstName & lastName to be used in username auto-generation
  constructor() {
    this.patientForm.get('firstName')?.valueChanges.subscribe(() => this.generateUsername());
    this.patientForm.get('lastName')?.valueChanges.subscribe(() => this.generateUsername());
  };

  get patientAilmentsArray() {
    return this.patientForm.get('patientAilments') as FormArray;
  };

  get emergencyContactInfo() {
    return this.patientForm.get('emergencyContactInfo') as FormGroup;
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
        //use _id if editing
        _id: this.patientToEdit?._id || '',
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
            number: this.patientForm.value.emergencyContactInfo?.address?.number ?? ''
          },
          kinshipDegree: this.patientForm.value.emergencyContactInfo?.kinshipDegree ?? ''
        },
        visitors: this.patientForm.value.visitors ?? [],
      };
      this.patient.emit(patient);
      // reset the form
      this.patientForm.reset();
      // reset the patientAilments array
      this.patientAilmentsArray.clear();
      // always add one empty patientAilment field object after reset
      this.addAilment();
    } else {
      // errors only show when form is invalid, not after submission
      this.patientForm.markAllAsTouched();
    };
  };
};
