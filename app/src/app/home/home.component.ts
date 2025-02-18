import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular'; 
import { CommonModule, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  
import { HttpClient, HttpClientModule, HttpParams, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment-timezone';
import { WebSocketService } from '../websocket.service'; 
import { debounceTime, distinctUntilChanged  } from 'rxjs/operators'; 

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})

export class HomeComponent implements OnInit, OnDestroy {
  // timezone variables
  timezones = moment.tz.names(); 
  selectedTimezone: string = '';
  // exerciseReport temporary variables
  exerciseType: string = '';
  customExerciseType: string = ''; 
  duration: number | undefined;
  reportTime: string = '';
  location: string = '';
  // cache
  exerciseReports: any[] = [];
  username: string = '';
  deviceUuid: string = ''; 

  private apiUrl = 'http://localhost:8080/api/reports/submitBatch'; // Backend API URL
  constructor(private webSocketService: WebSocketService, private router: Router, private http: HttpClient, private alertController: AlertController) {
    this.username = localStorage.getItem('username') || 'Guest';
    this.deviceUuid = localStorage.getItem('deviceUuid') || ''; // Retrieve user ID from localStorage
  }

  // storage reload
  ngOnInit() {
    this.selectedTimezone = localStorage.getItem('selectedTimezone') || moment.tz.guess(); 
    const currentTimeInSelectedTimezone = moment.tz(this.selectedTimezone).format('YYYY-MM-DDTHH:mm');  
    this.reportTime = currentTimeInSelectedTimezone; 
    this.loadExerciseReports();
    this.webSocketService.uploadTrigger.pipe(
      debounceTime(1000),
      distinctUntilChanged() //
    ).subscribe(() => {
      this.uploadReports();
    });
  }

  ngOnDestroy() {
    this.saveExerciseReports();
    localStorage.setItem('selectedTimezone', this.selectedTimezone);
  }

  // PASS TIME ZONE
  viewHistory() {
    this.router.navigate(['/history'], { queryParams: { timezone: this.selectedTimezone } });
  }

  // save local storage
  saveExerciseReports() {
    localStorage.setItem('exerciseReports', JSON.stringify({
      USER_NAME: this.username,
      data: this.exerciseReports,
    }));
  }

  // reload
  loadExerciseReports() {
    const savedReports = localStorage.getItem('exerciseReports');
    const currentUser = localStorage.getItem('username'); 
    console.log("local reports:", savedReports)
    if (savedReports) {
      const reports = JSON.parse(savedReports);
      
      if (reports && reports.USER_NAME === currentUser) {
        this.exerciseReports = reports.data; 
      } else {
        localStorage.removeItem('exerciseReports'); 
      }
    }
  }

  editReport(report: any, index: number) {
    const editedReport = { ...report };
    const formattedTime = moment.tz(editedReport.REPORT_TIME, this.selectedTimezone).format('YYYY-MM-DD HH:mm:ss z');

    const prompt = this.alertController.create({
      header: 'Edit Exercise Report',
      inputs: [
        { name: 'exerciseType', type: 'text', value: editedReport.EXERCISE_TYPE, placeholder: 'Exercise Type' },
        { name: 'duration', type: 'number', value: editedReport.DURATION, placeholder: 'Duration (minutes)' },
        { name: 'location', type: 'text', value: editedReport.LOCATION, placeholder: 'Location' },
        { 
          name: 'reportTime', 
          type: 'datetime-local', 
          value: formattedTime,
          placeholder: 'Select date and time' 
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: (data: any) => {
          const isTimeChanged = data.reportTime !== formattedTime;
          const updatedReportTime = isTimeChanged 
            ? moment.tz(data.reportTime, this.selectedTimezone).format('YYYY-MM-DD HH:mm:ss z') 
            : editedReport.REPORT_TIME; 

            this.exerciseReports[index] = {
              ...editedReport,
              EXERCISE_TYPE: data.exerciseType,
              DURATION: data.duration,
              LOCATION: data.location,
              REPORT_TIME: updatedReportTime, // Ensure the date format is correct
            };
            this.saveExerciseReports();
          },
        },
      ],
    });

    prompt.then((alert: HTMLIonAlertElement) => alert.present());
  }

  /**
   * Add new exercise report and store it locally in localStorage
   */
  addExerciseReport() {
    if (!this.duration || !this.location) {
      alert('Please fill in all the fields!');
      return;
    }

    // Use customExerciseType if the user selected 'Custom'
    const selectedExerciseType = this.exerciseType === 'Custom' ? this.customExerciseType : this.exerciseType;

    if (!selectedExerciseType.trim()) {
      alert('Please enter a valid exercise type!');
      return;
    }
    
    const formattedReportTime = moment.tz(this.reportTime + ':00', this.selectedTimezone).format('YYYY-MM-DD HH:mm:ss z');
    const newReport = {
      USER_NAME: this.username, // Backend expects USER_NAME
      DURATION: this.duration, // DURATION
      EXERCISE_TYPE: selectedExerciseType, // EXERCISE_TYPE
      LOCATION: this.location, // LOCATION
      REPORT_TIME: formattedReportTime, // REPORT_TIME
      DEVICE_UUID: this.deviceUuid // DEVICE_UUID
    };

    // Add the new report to the local list
    this.exerciseReports.push(newReport);
    // Save the updated exercise reports to localStorage
    this.saveExerciseReports();

    // Reset form fields after submitting the report
    this.exerciseType = '';
    this.customExerciseType = '';
    this.duration = undefined;
    this.reportTime = '';
    this.location = '';
  }

  uploadReports() {
    return new Promise<void>((resolve, reject) => {
      if (this.exerciseReports.length === 0) {
        resolve(); 
        return; // Early return if no reports to upload
      }

      const reportsToUpload = this.exerciseReports.map(report => ({
        username: report.USER_NAME,  
        duration: report.DURATION,
        exerciseType: report.EXERCISE_TYPE,
        location: report.LOCATION,
        reportTime: moment.tz(report.REPORT_TIME,
           'YYYY-MM-DD HH:mm:ss', this.selectedTimezone).utc().toISOString(), 
        deviceUuid: report.DEVICE_UUID
      }));
  
      console.log("Reports to upload:", reportsToUpload);
  
      this.http.post(this.apiUrl, reportsToUpload).subscribe(
        (response: any) => {
          localStorage.removeItem('exerciseReports');
          this.exerciseReports = [],
          resolve(); 
        },
        (error: any) => {
          console.error('Error uploading reports:', error);
          reject(); 
        }
      );
    });
  }
  
}
