import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSignInAlt,
  faSignOutAlt,
  faTrain,
  faUserCircle,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { LoginComponent } from './components/login/login.component';
import { TicketBookingService } from './services/ticket-booking.service';
import { IUser } from './model/train';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('dropdownContainer', { static: false })
  dropdownContainer!: ElementRef;

  title = 'train-ticket-booking';

  private ticketBookingService = inject(TicketBookingService);

  faTrain = faTrain;
  faUserCircle = faUserCircle;
  faSignOutAlt = faSignOutAlt;
  faUserPlus = faUserPlus;
  faSignInAlt = faSignInAlt;

  isRegisterPopupVisible = false;
  isUserLoggedIn$ = this.ticketBookingService.userLoggedIn$;
  userData!: IUser;
  isDropdownOpen = false;

  constructor() {
    this.isUserLoggedIn$ = this.ticketBookingService.userLoggedIn$;
    console.log(this.isUserLoggedIn$);
  }

  ngOnInit() {
    const user = localStorage.getItem('trainApp');
    if (user) {
      this.userData = JSON.parse(user);
    }
  }

  openPopup() {
    this.isRegisterPopupVisible = true;
  }

  logoutProfile() {
    this.ticketBookingService.logout();
    alert('Logout Successful');
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  //Close the dropdown whenever clicked outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.dropdownContainer?.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  getMyBookings() {
    this.ticketBookingService
      .getBookedTrainData(this.userData.passengerID)
      .subscribe((data) => {
        console.log(data);
      });
  }

  handleRegisterPopupChange(value: boolean) {
    this.isRegisterPopupVisible = value;
  }
}
