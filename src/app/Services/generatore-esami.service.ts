import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneratoreEsamiService {
  private apiUrl = 'http://localhost:5000/genera-esame'; 

  constructor(private http: HttpClient) {}

  generateExam(topic: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { topic });
  }
}
