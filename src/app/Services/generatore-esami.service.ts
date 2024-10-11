import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GeneratoreEsamiService {
  private API_URL = 'http://localhost:5000'; // Assicurati che questo sia il tuo endpoint Flask
  private token = environment.token; // Ottieni il token dall'ambiente

  constructor(private http: HttpClient) {}

  // Metodo per generare esame SQL o ERM
  generateExam(examType: 'sql' | 'erm'): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`, // Aggiungi il token qui
    });

    return this.http.post(
      `${this.API_URL}/genera-esame-${examType}`,
      {},
      { headers, responseType: 'blob' }
    );
  }

  // Metodo per generare soluzione SQL
  generateSolutionSQL(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`, // Aggiungi il token qui
    });

    return this.http.post(`${this.API_URL}/genera-soluzione-sql`, formData, {
      headers,
      responseType: 'blob',
    });
  }
}
