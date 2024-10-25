import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DataRetrievalServiceService {
  constructor(private http: HttpClient) {}

  fetchCourses(): Observable<any> {
    return this.http.get('/api/fetchCorsi', {});
  }
  iscrizioneCorso(studenteId: number, corsoId: number): Observable<any> {
    const body = { studente_id: studenteId, corso_id: corsoId };
    return this.http.post('/api/iscrizioneCorso', body);
  }
  cancellaIscrizione(studenteId: number, corsoId: number): Observable<any> {
    const body = { studente_id: studenteId, corso_id: corsoId };
    return this.http.post('/api/cancellazioneCorso', body);
  }

  checkIscrizione(studenteId: number) {
    return this.http.get<any>(`/api/iscrizione/${studenteId}`);
  }

  fetchLessons(): Observable<any> {
    return this.http.get('/api/fetchLezioni', {});
  }

  fetchAvvisi(): Observable<any> {
    return this.http.get('/api/fetchAvvisi', {});
  }

  nuovaLezione(data: any): Observable<any> {
    return this.http.post('/api/nuovaLezione', data);
  }

  nuovoAvviso(data: any): Observable<any> {
    return this.http.post('/api/nuovoAvviso', data);
  }

  addAppello(appello: any): Observable<any> {
    return this.http.post('/api/nuovoAppello', appello);
  }

  nuovoCorso(data: any): Observable<any> {
    return this.http.post('/api/nuovoCorso', data);
  }

  fetchAppelli(corsoId: number): Observable<any> {
    return this.http.get(`/api/fetchAppelli/${corsoId}`);
  }

  fetchPrenotazioni(studenteId: number): Observable<any[]> {
    return this.http.get<any[]>(`api/fetchPrenotazioni/${studenteId}`);
  }

  prenotaAppello(studenteId: number, appelloId: number): Observable<any> {
    return this.http.post('api/prenotaAppello', {
      studente_id: studenteId,
      appello_id: appelloId,
    });
  }
  rimuoviPrenotazione(studenteId: number, appelloId: number): Observable<any> {
    return this.http.post<any>('api/rimuoviPrenotazione', {
      studente_id: studenteId,
      appello_id: appelloId,
    });
  }
}
