import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { LoggedInStaffMember, StaffMember } from '../interfaces/staff-member';
import { jwtDecode } from 'jwt-decode';
import { Auth } from '../interfaces/auth';

// staff route
const API_URL = `${environment.apiURL}/api/staff`;
const API_URL_AUTH = `${environment.apiURL}/api/auth`;

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private baseUrl = `${environment.apiURL}/api/staff`;
  private authUrl = `${environment.apiURL}/api/auth`;

  // currently logged in staff-member
  staff$ = signal<LoggedInStaffMember | null>(null);

  // list of all staff
  staffList$ = signal<StaffMember[]>([]);

  //signals to check for each role
  isAdmin$ = computed(() => this.staff$()?.roles?.includes('ADMIN') ?? false);
  isEditor$ = computed(() => this.staff$()?.roles?.includes('EDITOR') ?? false);
  isReader$ = computed(() => this.staff$()?.roles?.includes('READER') ?? false);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadStaff();

    // load logged in staff member from access token
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedTokenSubject = jwtDecode(token) as unknown as LoggedInStaffMember;
      this.staff$.set({
        username: decodedTokenSubject.username,
        roles: decodedTokenSubject.roles,
      });
    };
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

  // load staff collection from MongoDB
  private loadStaff(): void {
    this.http
      .get<{ status: boolean; data: StaffMember[] }>(this.baseUrl, this.getAuthHeaders())
      .subscribe({
        next: (res) => {
          console.log('Loaded staff:', res);
          this.staffList$.set(Array.isArray(res.data) ? res.data : []);
        },
        error: (err) => console.log('Failed to load staff.', err),
      });
  };

  addStaffMember(staffMember: StaffMember) {
    this.http.post<StaffMember>(this.baseUrl, staffMember, this.getAuthHeaders()).subscribe({
      next: () => {
        // fetch the latest staff members so that the table has fully populated objects
        this.loadStaff();
        console.log('Staff member added successfully:', staffMember);
      },
      error: (err) => {
        console.log('Failed to add staff member.', err);
        this.loadStaff(); // still safe to refresh
      }
    });
  };

  updateStaffMember(staffMember: StaffMember) {
    this.http
      .put<StaffMember>(
        `${this.baseUrl}/${staffMember.username}`,
        staffMember,
        this.getAuthHeaders(),
      )
      .subscribe({
        next: (updatedStaffMember) => {
          //update patient$ signal
          const current = this.staffList$();
          const index = current.findIndex((p) => p.username === updatedStaffMember.username);
          // if the patients list isn't empty
          if (index !== -1) {
            current[index] = updatedStaffMember;
            // indicate changes by providing a new "current" array
            this.staffList$.set([...current]);
          }
        },
        error: (err) => {
          console.log('Failed to update staff member.', err);
          this.loadStaff();
        },
      });
  };

  removeStaffMember(username: string) {
    this.http.delete(`${this.baseUrl}/${username}`, this.getAuthHeaders()).subscribe({
      next: () => {
        // fetch the latest staff mermbers so that the table always has fully populated objects
        this.loadStaff();
      },
      error: (err) => {
        console.log('Failed to remove staff member.', err);
        // refresh the list even on error
        this.loadStaff();
      },
    });
  };

  loginStaffMember(credentials: { username: string; password: string }) {
    return this.http.post<{ status: boolean; data: string }>(`${this.authUrl}/login`, credentials);
  };

  logoutStaffMember() {
    this.staff$.set(null);
    localStorage.removeItem('accessToken');
    this.router.navigate(['login']);
  };

  isTokenExpired(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);

      if (exp) {
        return exp < now;
      } else {
        return true;
      };
    } catch (err) {
      return true;
    };
  };

  redirectToGoogleLogin() {
    const clientId = '938411590576-5q123u9sdts3u3r3j0g1vboij96vd5n2.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:3000/api/auth/google/callback';
    const scope = 'email profile';
    const responseType = 'code';
    const accessType = 'offline';

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=${accessType}`;

    window.location.href = url;
  };
};