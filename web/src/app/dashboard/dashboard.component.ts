import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import * as moment from 'moment-timezone';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  username: string;
  updatedAt: moment.Moment; 
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, HttpClientModule, FormsModule]
})

export class DashboardComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error: string | null = null;
  selectedTimezone: string = moment.tz.guess(); 
  timezones: string[] = moment.tz.names(); 

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const storedTimezone = localStorage.getItem('selectedTimezone');
    if (storedTimezone) {
      this.selectedTimezone = storedTimezone;
    } else {
      this.selectedTimezone = moment.tz.guess();
    }
    this.fetchUsers();
  }

  onTimezoneChange(): void {
    localStorage.setItem('selectedTimezone', this.selectedTimezone);
  }

  fetchUsers(): void {
    this.http.get<User[]>('http://localhost:8080/api/coaches/users').subscribe({
      next: (data) => {
        this.users = data.map(user => {
          const convertedTime = moment.tz(user.updatedAt, this.selectedTimezone);
          return {
            id: user.id,
            username: user.username,
            updatedAt: convertedTime 
          };
        });
        this.sortUsersByLastUpdated(); 
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error(err);
      }
    });
  }

  sortUsersByLastUpdated(): void {
    this.users.sort((a, b) => {
      return a.updatedAt.isBefore(b.updatedAt) ? -1 : 1; 
    });
  }

  isUserOutdated(updatedAt: moment.Moment): boolean {
    const currentDate = moment.tz();
    const diffInDays = currentDate.diff(updatedAt, 'days');
    return diffInDays > 2;
  }

  navigateToUserDetail(userId: number): void {
    this.router.navigate(['/userdetail', userId]);
  }

  formatDateToTimezone(date: moment.Moment): string {
    return moment.tz(date, this.selectedTimezone).format('YYYY-MM-DD HH:mm:ss z');
  }
}
