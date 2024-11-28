import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ToastComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Input() isRegisterPopupVisible = false;
  @Output() isRegisterPopupVisibleChange = new EventEmitter<boolean>();

  private ticketBookingService = inject(TicketBookingService);

  faXmark = faXmark;
  faCircleExclamation = faCircleExclamation;
  registerForm: FormGroup;
  loginForm: FormGroup;
  isLoginPopupVisible = false;
  message = '';
  showToast = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      passengerID: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'), // Ensures exactly 10 digits, only numbers
        ],
      ],
      password: ['', Validators.required],
    });

    this.loginForm = this.fb.group({
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'), // Ensures exactly 10 digits, only numbers
        ],
      ],
      password: ['', [Validators.required, Validators.required]],
    });
  }

  closePopup() {
    this.resetForms();
    this.isRegisterPopupVisible = false;
    this.isLoginPopupVisible = false;
    this.isRegisterPopupVisibleChange.emit(false);
  }

  onSubmitRegister() {
    this.message = 'Yay, Registration Successful';
    if (this.registerForm.valid) {
      const user: IUser = this.registerForm.value;
      this.ticketBookingService.addUsers(user).subscribe((data: any) => {
        if (data.result) {
          this.showToast = true;
          this.message = 'Yay, Registration Successful';
          this.resetForms();
          this.isRegisterPopupVisible = false;
          this.isRegisterPopupVisibleChange.emit(false);
        } else {
          this.showToast = true;
          this.message = data.message;
        }
      });
    }
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      const loginUser: any = this.loginForm.value;
      this.ticketBookingService.loginUser(loginUser).subscribe((res) => {
        if (res.result) {
          this.message = 'Yay, Login Successful';
          this.resetForms();
          this.ticketBookingService.loginDetails(res.data);
          this.isLoginPopupVisible = false;
        } else {
          this.message = res.message;
        }
      });
    }
  }

  resetForms() {
    this.registerForm.reset();
    this.loginForm.reset();
  }

  toggleLogin() {
    this.isRegisterPopupVisible = false;
    this.isRegisterPopupVisibleChange.emit(false);
    this.isLoginPopupVisible = true;
  }

  //Login Details
  // email: 'prerna123@gmail.com';
  // firstName: 'prerna';
  // lastName: 'test';
  // passengerID: 980;
  // password: '123@123';
  // phone: '9000000089';
}
