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
  isRegisterPopupVisible = true;
  @ViewChild(ToastComponent) toast!: ToastComponent;

  private ticketBookingService = inject(TicketBookingService);

  faXmark = faXmark;
  faCircleExclamation = faCircleExclamation;
  registerForm: FormGroup;
  loginForm: FormGroup;
  isLoginPopupVisible = false;
  showToast = false;
  isUserLoggedIn = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      passengerID: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', Validators.required],
    });

    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.required]],
    });
  }

  ngOnInit() {
    this.ticketBookingService.userLoggedIn$.subscribe((res) => {
      if (res) {
        this.isUserLoggedIn = true;
        this.router.navigate(['/home']);
      } else {
        this.isUserLoggedIn = false;
      }
    });
  }

  closePopup() {
    this.resetForms();
    this.isRegisterPopupVisible = false;
    this.isLoginPopupVisible = false;
  }

  onSubmitRegister() {
    if (this.registerForm.valid) {
      const user: IUser = this.registerForm.value;
      this.ticketBookingService.addUsers(user).subscribe((res: any) => {
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
      const loginUser: IUser = this.loginForm.value;
      this.ticketBookingService.loginUser(loginUser).subscribe((res) => {
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
    if (this.isRegisterPopupVisible) {
      this.isRegisterPopupVisible = false;
      this.isLoginPopupVisible = true;
    } else {
      this.isRegisterPopupVisible = true;
      this.isLoginPopupVisible = false;
    }
  }

  showToastMessage(message: string, messageType: any) {
    if (this.toast) {
      this.toast.showToastPopup(message, messageType);
    }
  }
}
