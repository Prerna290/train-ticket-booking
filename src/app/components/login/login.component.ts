import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { IUser } from '../../model/train';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Input() isRegisterPopupVisible = false;
  @Output() isRegisterPopupVisibleChange = new EventEmitter<boolean>();

  private ticketBookingService = inject(TicketBookingService);

  faXmark = faXmark;
  registerForm: FormGroup;
  loginForm: FormGroup;
  isLoginPopupVisible = false;

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
    this.isRegisterPopupVisible = false;
    this.isLoginPopupVisible = false;
    this.isRegisterPopupVisibleChange.emit(false);
  }

  onSubmitRegister() {
    if (this.registerForm.valid) {
      const user: IUser = this.registerForm.value;
      this.ticketBookingService.addUsers(user).subscribe((data: any) => {
        if (data.result) {
          alert('Registration Successful');
          this.isRegisterPopupVisible = false;
          this.isRegisterPopupVisibleChange.emit(false);
        } else {
          alert(data.message);
        }
      });
    }
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      const loginUser: any = this.loginForm.value;
      this.ticketBookingService.loginUser(loginUser).subscribe((res) => {
        if (res.result) {
          alert('Login Successful');
          this.ticketBookingService.loginDetails(res.data);
          this.isLoginPopupVisible = false;
        } else {
          alert(res.message);
        }
      });
    }
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
