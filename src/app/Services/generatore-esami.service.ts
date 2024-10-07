import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneratoreEsamiService {
  // URL di base per l'API
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // Metodo per generare un esame SQL o ERM
  generateExam(topic: 'sql' | 'erm'): Observable<Blob> {
    const endpoint =
      topic === 'sql' ? '/genera-esame-sql' : '/genera-esame-erm';
    return this.http.post(
      `${this.baseUrl}${endpoint}`,
      {},
      { responseType: 'blob' }
    );
  }
}
