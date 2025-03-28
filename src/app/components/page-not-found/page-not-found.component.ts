import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClipboardList,
  faHouse,
  faUserCircle,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-page-page-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
})
export class PageNotFoundComponent implements OnInit {
  ticketBookingService = inject(TicketBookingService);
  authService = inject(AuthService);
  faHouse = faHouse;
  faClipboardList = faClipboardList;
  faUserPlus = faUserPlus;
  faUserCircle = faUserCircle;
  isUserLoggedIn = false;
  isAdmin = false;

  ngOnInit() {
    this.ticketBookingService.userLoggedIn$.subscribe((data) => {
      this.isUserLoggedIn = data;
      this.isAdmin = this.authService.checkIsAdmin();
    });
  }
}
