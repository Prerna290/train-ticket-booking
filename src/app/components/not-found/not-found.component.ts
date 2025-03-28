import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClipboardList,
  faHouse,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent implements OnInit {
  ticketBookingService = inject(TicketBookingService);
  faHouse = faHouse;
  faClipboardList = faClipboardList;
  faUserPlus = faUserPlus;
  isUserLoggedIn = false;

  ngOnInit() {
    this.ticketBookingService.userLoggedIn$.subscribe((res) => {
      if (res) {
        this.isUserLoggedIn = true;
      } else {
        this.isUserLoggedIn = false;
      }
    });
  }
}
