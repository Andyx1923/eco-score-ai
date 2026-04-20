import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API_URL = 'https://eco-score-api-ytae.onrender.com/api';

  constructor(private http: HttpClient) {}

  getStats() {
    return this.http.get(`${this.API_URL}/stats`);
  }

  evaluate(data: any) {
    return this.http.post(`${this.API_URL}/evaluate`, data);
  }
}