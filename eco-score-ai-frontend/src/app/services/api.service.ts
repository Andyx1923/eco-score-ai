import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}
getStats() {
  return this.http.get('http://localhost:3000/api/stats');
}
  evaluate(data: any) {
    return this.http.post(`${this.API_URL}/evaluate`, data);
  }
}