import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient) { }

  checkSession(): Observable<any> {
    return this.http.get('/api/check-session', {withCredentials: true});
  }
  login(data: {email: string, password: string, is_professor: boolean}): Observable<any>{
    return this.http.post('/api/login', data);
  }

  signup(data: any): Observable<any>{
    return this.http.post('/api/signup', data);
  }

  logout(): Observable<any> {
    return this.http.post('/api/logout', {withCredentials: true});
  }

}
