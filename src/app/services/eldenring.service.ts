import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EldenringService {
  private API_URL = 'https://eldenring.fanapis.com/api/bosses';
  private limit = 100; // Trae 100 jefes por página (máximo permitido)

  constructor(private http: HttpClient) {}

  getAllBosses(): Observable<any[]> {
    const requests = [];
    
    // Iterar sobre las primeras 3 páginas (ajustar si hay más datos)
    for (let page = 0; page < 3; page++) {
      requests.push(this.http.get<any>(`${this.API_URL}?limit=${this.limit}&page=${page}`));
    }

    return forkJoin(requests).pipe(
      map((responses: any[]) => 
        responses.reduce((acc, response) => acc.concat(response.data || []), []) // Fusionar los datos
      )
    );
  }
}
