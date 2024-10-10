import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeneratoreEsamiService {
  // URL di base per l'API
  private baseUrl = environment.apiUrl; // Utilizza l'URL dall'ambiente
  private token = environment.token; // Ottieni il token dall'ambiente

  constructor(private http: HttpClient) {}

  // Metodo per generare un esame SQL o ERM
  generateExam(topic: 'sql' | 'erm'): Observable<Blob> {
    const endpoint =
      topic === 'sql' ? '/genera-esame-sql' : '/genera-esame-erm';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`, // Aggiungi il token all'intestazione
    });

    return this.http.post(
      `${this.baseUrl}${endpoint}`,
      {},
      { headers, responseType: 'blob' }
    );
  }
}
