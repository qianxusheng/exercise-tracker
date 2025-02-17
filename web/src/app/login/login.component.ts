import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class LoginComponent {
  title = 'eeTracker Coach Login'; 
  loginData = { username: '', password: '' };
  registerData = { username: '', password: '' };
  isRegistering = false; 
  isAuthenticated: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Check localStorage or other means of authentication
    this.isAuthenticated = false;
  }

  toggleForm() {
    this.isRegistering = !this.isRegistering;
  }

  onSubmitLogin() {
    const apiUrl = 'http://localhost:8080/api/coaches/login';
    this.http.post(apiUrl, this.loginData, { responseType: 'text' }).subscribe(response => {
      if (response === "Login successful") {
        localStorage.setItem('isAuthenticated', 'true');
        this.isAuthenticated = true;
        this.router.navigate(['/dashboard']);
      }
    }, error => {
      this.loginData.password = '';  
      if (error.status === 401) {
        alert(error.error); 
      } else {
        alert('An error occurred');
      }
      console.error(error);
    });
  }

  onSubmitRegister() {
    const { username, password } = this.registerData;
    const apiUrl = 'http://localhost:8080/api/coaches/register';
    this.http.post<any>(apiUrl, { username, password })
      .subscribe(response => {
        alert('Registration successful');
        this.toggleForm();
      }, error => {
        alert('An error occurred during registration');
        console.error(error);
      });
  }
}
