import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { IUser } from '../../model/train';
import { ToastComponent } from '../toast/toast.component';
import { AlertComponent } from '../alert/alert.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ToastComponent,
    AlertComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  faXmark = faXmark;
  isRegisterPopupVisible = true;
  registerForm: FormGroup;
  loginForm: FormGroup;
  isLoginPopupVisible = false;
  isUserLoggedIn = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ticketBookingService: TicketBookingService
  ) {
    this.registerForm = this.fb.group({
      passengerID: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.ticketBookingService.userLoggedIn$.subscribe((res) => {
      // !! operator is used to convert the value of res to a boolean. If res is truthy,isUserLoggedIn will be set to true.
      this.isUserLoggedIn = !!res;
      if (res) this.router.navigate(['/home']);
    });
  }

  closePopup() {
    this.resetForms();
    this.isRegisterPopupVisible = false;
    this.isLoginPopupVisible = false;
    this.router.navigate(['/home']);
  }

  onSubmitRegister() {
    if (this.registerForm.valid) {
      this.ticketBookingService
        .addUsers(this.registerForm.value)
        .subscribe((res: any) => {
          if (res.result) {
            this.showToastMessage(
              'Registration Successful. Welcome To Our Platform!',
              'success'
            );
            this.resetForms();
            this.ticketBookingService.loginDetails(res.data);
            this.router.navigate(['/home']);
          } else {
            this.showToastMessage(res.message, 'error');
          }
        });
    }
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      this.ticketBookingService
        .loginUser(this.loginForm.value)
        .subscribe((res) => {
          if (res.result) {
            this.showToastMessage('Login Successful. Welcome Back!', 'success');
            this.resetForms();
            this.ticketBookingService.loginDetails(res.data);
            this.router.navigate(['/home']);
          } else {
            this.showToastMessage(res.message, 'error');
          }
        });
    }
  }

  resetForms() {
    this.registerForm.reset();
    this.loginForm.reset();
  }

  toggleLogin() {
    this.isRegisterPopupVisible = !this.isRegisterPopupVisible;
    this.isLoginPopupVisible = !this.isLoginPopupVisible;
  }

  showToastMessage(message: string, messageType: any) {
    if (this.toast) {
      this.toast.showToastPopup(message, messageType);
    }
  }
}
