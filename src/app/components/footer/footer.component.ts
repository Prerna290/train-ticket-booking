import { Component, inject, Input } from '@angular/core';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { IUser } from '../../model/train';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  showFooter = true;
  private ticketBookingService = inject(TicketBookingService);
  private authService = inject(AuthService);
  private router = inject(Router);

  userData!: IUser;
  isAdmin = false;
  currentYear: number = new Date().getFullYear();

  ngOnInit() {
    this.ticketBookingService.userData$.subscribe((userData) => {
      this.userData = userData;
      this.isAdmin = this.authService.checkIsAdmin();
    });
    this.router.events.subscribe(() => {
      this.showFooter =
        this.router.url !== '/404' && this.router.url !== 'login';
    });
  }
}
