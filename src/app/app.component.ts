import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
import { TicketBookingService } from './services/ticket-booking.service';
import { IUser } from './model/train';
import { ToastComponent } from './components/toast/toast.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    ToastComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('dropdownContainer', { static: false })
  dropdownContainer!: ElementRef;
  @ViewChild(ToastComponent)
  toast!: ToastComponent;

  title = 'train-ticket-booking';

  private ticketBookingService = inject(TicketBookingService);
  private authService = inject(AuthService);
  private router = inject(Router);

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

  userData!: IUser;
  isDropdownOpen = false;

  isDarkMode = false;
  userTheme = '';
  isAdmin = false;

  constructor() {}

  ngOnInit() {
    this.checkTheme();
    this.ticketBookingService.userData$.subscribe((userData) => {
      this.userData = userData;
      this.isAdmin = this.authService.checkIsAdmin();
    });
  }

  logoutProfile() {
    this.ticketBookingService.logout();
    this.showSuccessToast();
    this.isDropdownOpen = false;
    this.router.navigate(['/login']);
  }

  showSuccessToast() {
    if (this.toast) {
      this.toast.showToastPopup(
        'Logout Successful. We hope to see you again!',
        'success'
      );
    }
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

  checkTheme() {
    const userTheme = localStorage.getItem('theme');
    const systemPreference = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

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
