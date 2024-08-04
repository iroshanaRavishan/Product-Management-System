import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  isLoginMode = true;
  isLoading = false;
  error: string = '';
  isActive = false;
  errorList: string = ''; 

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(12)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signUpForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(12)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }
  
  onLogin() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.isLoading = true;

    this.authService.login(email, password).subscribe(
      resData => {
        console.log("Login response", resData);
        if (resData.isSuccess) {
          this.isLoading = false;
          this.loginForm.reset();
          this.router.navigate(["/products"]);
        } else {
          console.log('Sign in response',resData);
          this.error = resData.message;
          this.isLoading = false;
        }
      },
      errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
  }

  onSignUp() {
    if (!this.signUpForm.valid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const firstName = this.signUpForm.value.firstName;
    const lastName = this.signUpForm.value.lastName;
    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.password;
    const confirmPassword = this.signUpForm.value.confirmPassword;
    this.isLoading = true;
    this.errorList = '';

    if (password == confirmPassword) {
      this.authService.signUp(firstName, lastName, email, password, confirmPassword).subscribe(
        resData => {
          if (resData.isSuccess) {
            this.isLoading = false;
            console.log('Sign in response',resData);
            this.signUpForm.reset();
            this.deactivateContainer();
          } else {
            console.log('Sign in response',resData);
            this.error = resData.message;
            if (Array.isArray(resData.errors) && resData.errors.length > 0) {
              this.errorList = '<ul>';
              resData.errors.forEach(item => {
                this.errorList += `<li>${item}</li>`;
              });
              this.errorList += '</ul>';
            }
            this.isLoading = false;
          }
        },
        errorMessage => {
          this.error = errorMessage;
          this.isLoading = false;
        }
      );
    }
    else {
      this.error = 'Passwords are not matching!';
      this.isLoading = false;
    }
  }

  activateContainer() {
    this.isActive = true;
    this.error = '';
    this.signUpForm.markAsUntouched();
  }

  deactivateContainer() {
    this.isActive = false;
    this.error = '';
    this.loginForm.markAsUntouched();
  }
}
