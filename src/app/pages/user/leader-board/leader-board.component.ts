import { Component, OnInit } from '@angular/core';
import { LeaderboardEntry, LeaderboardserviceService } from 'src/app/services/leaderboardservice.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {

  leaderboardEntries: LeaderboardEntry[] = [];

  constructor(private leaderboardService: LeaderboardserviceService) { }

  ngOnInit(): void {
    this.leaderboardService.getLeaderboard().subscribe(entries => {
      this.leaderboardEntries = entries;
      console.log("generate");
      console.log(entries);
    });
  }

}
