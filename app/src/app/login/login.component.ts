import { Component } from '@angular/core';
import { HttpClient, HttpParams, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule, HttpClientModule],
})

export class LoginComponent {
  username: string = '';
  deviceUuid: string = '';  // Allow manual entry of UUID
  userId: string = '';  // Get user ID from localStorage or auth
  message: string = '';  // To display success/failure message

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Optionally load the previous UUID from localStorage if desired.
    this.deviceUuid = localStorage.getItem('deviceUuid') || ''; 
  }

  login() {
    if (!this.username.trim() || !this.deviceUuid.trim()) {
      alert('Please enter a valid username and device UUID.');
      return;
    }
  
    const apiUrl = 'http://localhost:8080/api/users/login';
    const body = new HttpParams()
      .set('username', this.username)
      .set('deviceUuid', this.deviceUuid);
  
    this.http.post(apiUrl, body.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .subscribe(
        (response: any) => {
          console.log('Response from server:', response);
          
          if (response && response.username === this.username) {
            this.message = 'Login successful!';
            alert(this.message);
            localStorage.setItem('username', this.username);  
            localStorage.setItem('deviceUuid', this.deviceUuid);  // Save device UUID for later use
            localStorage.setItem('userId', response.id);
            this.router.navigate(['/home']);  
          } else {
            this.message = 'Unexpected response.';
            alert(this.message);
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.message = 'Login failed. Please try again later.';
          alert(this.message);
        }
      );
  }

  register() {
    if (!this.username.trim() || !this.deviceUuid.trim()) {
      alert('Please enter a valid username and device UUID.');
      return;
    }
  
    const apiUrl = 'http://localhost:8080/api/users/register';
    const body = new HttpParams()
      .set('username', this.username)
      .set('deviceUuid', this.deviceUuid);
  
    this.http.post(apiUrl, body.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .subscribe(
        (response: any) => {
          console.log('Response from server:', response);
          
          if (response && response.username === this.username) {
            this.message = 'User registered successfully!';
            alert(this.message);
            localStorage.setItem('username', this.username);
            localStorage.setItem('deviceUuid', this.deviceUuid);  // Save device UUID for later use
            localStorage.setItem('userId', response.id);
            this.router.navigate(['/home']);
          } else {
            this.message = 'Unexpected response.';
            alert(this.message);
          }
        },
        (error) => {
          console.error('Registration failed:', error);
          this.message = 'Registration failed. Please try again later.';
          alert(this.message);
        }
      );
  }
}
