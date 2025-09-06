import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { Visitor } from '../interfaces/visitor';

const API_URL = `${environment.apiURL}/api/visitors`;
const API_URL_AUTH = `${environment.apiURL}/api/auth`;

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private baseUrl = API_URL;

  visitors$ = signal<Visitor[]>([]);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadVisitors();
  };

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('accessToken')?.trim() || '';
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      }),
    };
  };

  private loadVisitors() {
    this.http
      .get<{ status: boolean; data: Visitor[] }>(this.baseUrl, this.getAuthHeaders())
      .subscribe({
        next: (res) => {
          this.visitors$.set(Array.isArray(res.data) ? res.data : []);
        },
        error: (err) => console.log('Failed to load visitors.', err),
      });
  };

  addVisitor(visitor: Visitor) {
  this.http.post<Visitor>(this.baseUrl, visitor, this.getAuthHeaders()).subscribe({
    next: () => {
      // fetch the latest visitors so that the table has fully populated objects
      this.loadVisitors();
    },
    error: (err) => {
      console.log('Failed to add visitor.', err);
      this.loadVisitors(); // still safe to refresh
    }
  });
};

  updateVisitor(visitor: Visitor) {
    this.http
      .put<Visitor>(`${this.baseUrl}/${visitor.username}`, visitor, this.getAuthHeaders())
      .subscribe({
        next: (updatedVisitor) => {
          //updatevisitor$ signal
          const current = this.visitors$();
          const index = current.findIndex((p) => p.username === updatedVisitor.username);
          // if the visitors list isn't empty
          if (index !== -1) {
            current[index] = updatedVisitor;
            // indicate changes by providing a new "current" array
            this.visitors$.set([...current]);
          }
        },
        error: (err) => {
          console.log('Failed to update visitor.', err);
          this.loadVisitors();
        },
      });
  };

  removeVisitor(id: string) {
    this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders()).subscribe({
      next: () => this.loadVisitors(),
      error: (err) => console.log('Failed to remove visitor', err),
    });
  };
};
