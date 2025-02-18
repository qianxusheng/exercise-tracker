import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-history',
  standalone: true,
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  imports: [IonicModule, CommonModule, HttpClientModule],
})

export class HistoryComponent implements OnInit {
  username: string = '';
  userId: string = ''; // Get user ID from localStorage or auth
  exerciseReports: any[] = []; // Store the exercise reports
  timezone: string = moment.tz.guess(); 

  private apiUrl = 'http://localhost:8080/api/reports/history'; // Backend API URL

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
    this.username = localStorage.getItem('username') || 'Guest';
    this.userId = localStorage.getItem('userId') || ''; // Get the user ID
  }

  ngOnInit() {
    // Fetch exercise history data when the component is initialized
    this.route.queryParams.subscribe(params => {
      this.timezone = params['timezone'] || moment.tz.guess();
      console.log('Current Timezone:', this.timezone);
      // Use the timezone for time conversion or other logic
    });
    this.getExerciseHistory();
  }
  
  goHome() {
    this.router.navigate(['/home']);
  }

  convertReportTime(reportTime: string): string {
    return moment.tz(reportTime, this.timezone).format('YYYY-MM-DD HH:mm:ss z');
  }

  // Fetch exercise reports from the backend API
  getExerciseHistory() {
    if (this.userId) {
      this.http.get<any[]>(`${this.apiUrl}/${this.userId}`).subscribe(
        (data) => {
          console.log('Fetched exercise history:', data);
          this.exerciseReports = data; // Store fetched data in exerciseReports
        },
        (error) => {
          console.error('Error fetching exercise history:', error);
        }
      );
    }
  }
}
