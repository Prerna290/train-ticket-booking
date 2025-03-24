import { Injectable } from '@angular/core';
import { TicketBookingService } from './ticket-booking.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdmin.asObservable();

  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  private allowedEmails = ['prerna123@gmail.com'];

  constructor(private ticketBookingService: TicketBookingService) {
    this.ticketBookingService.userLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn.next(loggedIn);
    });

    this.ticketBookingService.userData$.subscribe((userData) => {
      if (userData) {
        const isAdmin = this.allowedEmails.includes(userData.email);
        this.isAdmin.next(isAdmin);
      } else {
        this.isAdmin.next(false);
      }
    });
  }

  checkLoggedIn(): boolean {
    return this.isLoggedIn.value;
  }

  checkIsAdmin(): boolean {
    return this.isAdmin.value;
  }
}
