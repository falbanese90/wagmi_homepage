import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Staked } from '../models/staked';
 

@Injectable({
  providedIn: 'root'
})
export class StakingService {

  constructor(private http: HttpClient) { }
  addStaked(pub: string) {
    const body = {
      public_key: pub
    }
    this.http.post('http://localhost:3000/staked/add', body).subscribe();
  }
  del(pub: string): Observable<unknown> {
    return this.http.delete<unknown>(`http://localhost:3000/staked/delete/${pub}`);
  }
  select(pub: string): Observable<Staked[]> {
    return this.http.get<Staked[]>(`http://localhost:3000/staked/select/${pub}`);
  }
  index(): Observable<Staked[]> {
    return this.http.get<Staked[]>('http://localhost:3000/staked');
  }
  getTime(pub: string): Observable<string> {
    return this.http.get<string>(`http://localhost:3000/staked/time/${pub}`);
  }
}

