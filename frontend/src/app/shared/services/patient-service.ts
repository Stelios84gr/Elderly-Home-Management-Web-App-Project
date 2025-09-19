import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Patient } from '../interfaces/patient';


@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private baseUrl = 'http://localhost:3000/api/patients';

  patients$ = signal<Patient[]>([]);

  // load patients collection from back-end
  constructor(private http: HttpClient) {
    this.loadPatients();
  };

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('accessToken')?.trim();
    console.log('Token retrieved from local storage:', token);

    if (!token) {
      console.log('No access token found in local storage.');
      return { headers: new HttpHeaders() };
    };

    const trimmedToken = token.trim();

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${trimmedToken}`,
        'Content-Type': 'application/json',
      }),
    };
  };

  // load patients collection from MongoDB
  private loadPatients() {
    this.http
      .get<{ status: boolean; data: Patient[] }>(this.baseUrl, this.getAuthHeaders())
      .subscribe({
        next: (res) => {
          console.log('Loaded patients:', res);
          // Use res.data instead of res
          this.patients$.set(Array.isArray(res.data) ? res.data : []);
        },
        error: (err) => console.log('Failed to load patients.', err),
      });
  };

  addPatient(patient: Patient) {
    this.http.post<Patient>(this.baseUrl, patient, this.getAuthHeaders()).subscribe({
      next: () => {
        // fetch the latest patients so that the table has fully populated objects
        this.loadPatients();
      },
      error: (err) => {
        console.log('Failed to add patient.', err);
        this.loadPatients(); // still safe to refresh
      },
    });
  };

  updatePatient(patient: Patient, changes: Partial<Patient>) {
    if (!patient._id) {
      console.log('Update patient failed. Missing _id');
      return;
    }

    const payload: any = { ...changes };

    // nested objects handling
    if (changes.roomData) {
      payload.roomData = {
        ...(patient.roomData || {}),
        ...changes.roomData,
      };
    }

    if (changes.emergencyContactInfo) {
      payload.emergencyContactInfo = {
        ...(patient.emergencyContactInfo || {}),
        ...changes.emergencyContactInfo,
      };

      if (changes.emergencyContactInfo.address) {
        payload.emergencyContactInfo.address = {
          ...(patient.emergencyContactInfo?.address || {}),
          ...changes.emergencyContactInfo.address,
        };
      }
    }

    console.log('Updating patient with payload:', payload, '...');

    this.http
      .patch<Patient>(`${this.baseUrl}/${patient.username}`, payload, this.getAuthHeaders())
      .subscribe({
        next: (updatedPatient) => {
          //update patient$ signal
          const current = this.patients$();
          const index = current.findIndex((p) => p._id === updatedPatient._id);
          // if the patients list isn't empty
          if (index !== -1) {
            current[index] = updatedPatient;
            // indicate changes by providing a new "current" array
            this.patients$.set([...current]);
          }
        },
        error: (err) => {
          console.log('Failed to update patient.', err);
          this.loadPatients();
        },
      });
  };

  removePatient(username: string) {
    this.http.delete<{ status: boolean; data: Patient }>(`${this.baseUrl}/${username}`, this.getAuthHeaders()).subscribe({
      next: (res) => {
        console.log("Delete response:", res);
          if (res.status) {
            this.patients$.set(
              this.patients$().filter((p) => p.username !== username)
            );
          };
        // fetch the latest patients so that the table always has fully populated objects
        this.loadPatients();
      },
      error: (err) => {
        console.log('Failed to remove patient.', err);
        // refresh the list even on error
        this.loadPatients();
      },
    });
  };

  // add visitor to patient after patient registration - patientToVisit: patient username

  addVisitorToPatient(patientId: string, visitorId: string) {
    this.http
      .patch<Patient>(
        `${this.baseUrl}/addVisitor`,
        { patientId, visitorId },
        this.getAuthHeaders(),
      )
      .subscribe({
        next: (updatedPatient) => {
          const current = this.patients$();
          const index = current.findIndex((p) => p._id === updatedPatient._id);

          if (index !== -1) {
            current[index] = updatedPatient;
          } else {
            current.push(updatedPatient);
          }
          this.patients$.set([...current]);
        },
        error: (err) => console.log('Visitor failed to be added.', err),
      });
  }

  removeVisitorFromPatient(patientId: string, visitorId: string) {
    this.http
      .patch<Patient>(
        `${this.baseUrl}/removeVisitor`,
        { patientId, visitorId },
        this.getAuthHeaders(),
      )
      .subscribe({
        next: (updatedPatient) => {
          const current = this.patients$();
          const index = current.findIndex((p) => p._id === updatedPatient._id);

          if (index !== -1) {
            current[index] = updatedPatient;
            this.patients$.set([...current]);
          }
        },
        error: (err) => console.log('Visitor failed to be removed.', err),
      });
  };
};
