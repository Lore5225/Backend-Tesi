import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataRetrievalServiceService {

  constructor(private http: HttpClient) { }

  fetchCourses(): Observable<any> {
    return this.http.get('/api/fetchCorsi', {});
  }

  fetchLessons(): Observable<any> {
    return this.http.get('/api/fetchLezioni', {});
  }
  
  fetchAvvisi(): Observable<any>{
    return this.http.get('/api/fetchAvvisi', {});
  }
  
  nuovaLezione(data: any): Observable<any>{
    return this.http.post('/api/nuovaLezione', data);
  }

  nuovoAvviso(data: any): Observable<any>{
    return this.http.post('/api/nuovoAvviso', data);
  }
}

