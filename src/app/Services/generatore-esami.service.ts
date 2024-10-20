import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GeneratoreEsamiService {
  private API_URL = 'http://localhost:5000';
  private token = environment.token; 

  constructor(private http: HttpClient) {}

  generateExam(examType: 'sql' | 'erm'): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`, 
    });

    return this.http.post(
      `${this.API_URL}/genera-esame-${examType}`,
      {},
      { headers, responseType: 'blob' }
    );
  }

  generateSolutionSQL(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`, 
    });

    return this.http.post(`${this.API_URL}/genera-soluzione-sql`, formData, {
      headers,
      responseType: 'blob',
    });
  }
}
