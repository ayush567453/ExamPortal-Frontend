import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import baseUrl from './helper';



export interface LeaderboardEntry {
  username: string;
  marksGot: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardserviceService {
  

  constructor(private http: HttpClient) { }

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${baseUrl}/leaderboard/alldata`);
     
  }
}