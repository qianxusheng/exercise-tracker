import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule  } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment-timezone';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ExerciseReport {
  exerciseType: string;
  duration: number;
  location: string;
  reportTime: moment.Moment;
}

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.scss'],
  standalone: true,
  imports: [ HttpClientModule, ReactiveFormsModule, CommonModule]
})

export class UserDetailComponent implements OnInit {
  userId: number = 0;
  exerciseReports: ExerciseReport[] = [];
  selectedTimezone: string = moment.tz.guess(); // Set default to system timezone
  error: string | null = null;
  pagination: any = { page: 1, limit: 10, totalPages: 1 };
  filterDate: FormControl = new FormControl('');
  filterExerciseType: FormControl = new FormControl('');
  currentPage: number = 1;
  itemsPerPage: number = 10;
  showLast7Days: boolean = false; 

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}


  get totalPages(): number {
    return Math.ceil(this.exerciseReports.length / this.itemsPerPage);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']); 
  }
  
  paginatedReports() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.exerciseReports.slice(startIndex, startIndex + this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  ngOnInit() {
      // Retrieve selected timezone from localStorage
      this.selectedTimezone = localStorage.getItem('selectedTimezone') || moment.tz.guess(); 
      console.log('Selected Timezone:', this.selectedTimezone);

      // Get the userId from the route params
      this.route.params.subscribe(params => {
        this.userId = params['userId'];
        this.fetchUserDetails();
      });
  }

  fetchUserDetails(): void {
    this.http
      .get<ExerciseReport[]>(`http://localhost:8080/api/coaches/user/${this.userId}/reports`)
      .subscribe({
        next: (data) => {
          this.exerciseReports = data
            .map((report) => ({
              ...report,
              reportTime: moment.tz(report.reportTime, this.selectedTimezone),
            }))
            .sort((a, b) => b.reportTime.valueOf() - a.reportTime.valueOf()); 
            this.showLast7Days = false;
        },
        error: () => {
          this.error = 'Failed to load exercise reports';
        },
      });
  }
  

  // Handle page change for pagination
  onPageChange(page: number): void {
    this.pagination.page = page;
    this.fetchUserDetails(); // Fetch the data for the current page (could be adjusted for pagination logic)
  }

  fetchLastSevenDaysReports(): void {
    if (this.showLast7Days) {
      this.fetchUserDetails(); 
      return;
    }

    this.http
      .get<ExerciseReport[]>(`http://localhost:8080/api/coaches/user/${this.userId}/reports/last7days`)
      .subscribe({
        next: (data) => {
          this.exerciseReports = data
            .map(report => ({
              ...report,
              reportTime: moment.tz(report.reportTime, this.selectedTimezone),
            }))
            .sort((a, b) => b.reportTime.valueOf() - a.reportTime.valueOf()); 
            this.showLast7Days = true;
        },
        error: () => {
          this.error = 'Failed to load last 7 days reports';
        },
      });
  }
}
