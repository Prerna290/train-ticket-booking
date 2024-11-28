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
  faMoon,
  faSignInAlt,
  faSignOutAlt,
  faSun,
  faTrain,
  faUserCircle,
  faUserPlus,
  faClipboardList,
  faUser,
  faEnvelope,
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
  faMoon = faMoon;
  faSun = faSun;
  faClipboardList = faClipboardList;
  faUser = faUser;
  faEnvelope = faEnvelope;

  isRegisterPopupVisible = false;
  isUserLoggedIn$ = this.ticketBookingService.userLoggedIn$;
  userData!: IUser;
  isDropdownOpen = false;

  isDarkMode = false;
  userTheme = '';

  constructor() {
    this.isUserLoggedIn$ = this.ticketBookingService.userLoggedIn$;
    console.log(this.isUserLoggedIn$);
  }

  ngOnInit() {
    this.checkTheme();
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

  handleRegisterPopupChange(value: boolean) {
    this.isRegisterPopupVisible = value;
  }

  checkTheme() {
    const userTheme = localStorage.getItem('theme');
    const systemPreference = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    // Apply dark mode if user preference is 'dark' or system prefers dark
    if (userTheme === 'dark' || (!userTheme && systemPreference)) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  toggleTheme() {
    if (this.isDarkMode) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode() {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    this.isDarkMode = true;
  }

  disableDarkMode() {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'default');
    this.isDarkMode = false;
  }
}
