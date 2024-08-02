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

  authForm!: FormGroup;
  isLoginMode = true;
  isLoading = false;
  error: string = '';

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    });
  }
  
  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    this.isLoading = true;

    this.authService.login(email, password).subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(["/products"]);
      },
      errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    this.authForm.reset();
  }
}