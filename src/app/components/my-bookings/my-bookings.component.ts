import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { IBooking, IUser } from '../../model/train';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import moment from 'moment';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    ToastComponent,
    FontAwesomeModule,
  ],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent {
  @ViewChild(ToastComponent) toast!: ToastComponent;
  faArrowRight = faArrowRight;
  userData!: IUser;
  myBookings: IBooking[] = [];
  groupedMyBookings: IBooking[] = [];
  sortType: 'latest' | 'oldest' = 'latest';
  loadingBookings = false;

  private ticketBookingService = inject(TicketBookingService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.ticketBookingService.userData$.subscribe((data) => {
      this.userData = data;
      if (this.userData) {
        this.getMyBookings();
      }
    });
  }

  ngAfterViewInit() {
    if (!this.userData) {
      this.toast?.showToastPopup('Please log in to see your bookings', 'error');
      this.cdr.detectChanges();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    }
  }

  getMyBookings() {
    this.loadingBookings = true;
    this.ticketBookingService
      .getBookedTrainData(this.userData.passengerID)
      .subscribe((result: any) => {
        this.myBookings = result.data;
        this.groupedMyBookings = this.groupBookings(this.myBookings);
        this.loadingBookings = false;
      });
  }

  groupBookings(bookings: IBooking[]): IBooking[] {
    const groupedBookings: { [key: string]: IBooking } = {}; // key is type of string and value is type of IBooking i.e key value pairs

    bookings.forEach((booking: IBooking) => {
      const key = `${booking.trainId}-${booking.departureDate}`;
      if (!groupedBookings[key]) {
        groupedBookings[key] = {
          trainId: booking.trainId,
          trainName: booking.trainName,
          trainNo: booking.trainNo,
          departureStationName: booking.departureStationName,
          arrivalStationName: booking.arrivalStationName,
          departureTime: booking.departureTime,
          arrivalTime: booking.arrivalTime,
          departureDate: booking.departureDate,
          passengers: [],
        };
      }
      if (
        booking.passengerName &&
        booking.age &&
        booking.seatNo &&
        booking.bookingPassengerId
      ) {
        groupedBookings[key].passengers.push({
          passengerName: booking.passengerName,
          age: booking.age,
          seatNo: booking.seatNo,
          bookingPassengerId: booking.bookingPassengerId,
        });
      }
    });
    return Object.values(groupedBookings);
  }

  sortBookings() {
    this.groupedMyBookings.sort((a, b) => {
      const dateA = new Date(a.departureDate);
      const dateB = new Date(b.departureDate);

      //When comparing two Date objects directly without getTime(e.g., dateA > dateB), JavaScript will convert them to strings. Using getTime() ensures that you are comparing numeric values.
      return this.sortType === 'latest'
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
  }

  formatDepartureTime(departureTime: string) {
    return moment(departureTime).format('MMMM Do YYYY');
  }

  calculateArrivalDate(
    departureDate: string,
    arrivalTime: string,
    departureTime: string
  ): string {
    const departure = new Date(departureDate);
    const arrival = new Date(departure);

    const [departureHours, departureMinutes] =
      this.formatTrainTime(departureTime);
    departure.setHours(departureHours, departureMinutes);

    const [arrivalHours, arrivalMinutes] = this.formatTrainTime(arrivalTime);
    arrival.setHours(arrivalHours, arrivalMinutes);

    // If arrival time is earlier than departure time, it means the train arrives the next day
    if (arrival < departure) {
      arrival.setDate(arrival.getDate() + 1);
    }
    return moment(arrival).format('MMMM Do YYYY');
  }

  formatTrainTime(time: string) {
    // Remove all spaces and convert to lowercase eg. if time is 12 am it will be 12pm, removing all spaces
    //   /: indicate the start and end of expression.
    //  \s: This matches any whitespace character.
    //  +: "one or more" of the element
    //  g: "global," meaning that the replacement should occur for all matches
    time = time.replace(/\s+/g, '').toLowerCase();
    let hours: number;
    let minutes: number = 0;

    if (time.includes('am') || time.includes('pm')) {
      let [timePart, period] = time.split(/(am|pm)/);

      const timeParts = timePart.split(':').map(Number);
      hours = Number(timeParts[0]);
      minutes = timeParts[1] ? Number(timeParts[1]) : 0;
      if (period === 'pm' && hours !== 12) {
        hours += 12;
      } else if (period === 'am' && hours === 12) {
        hours = 0; // Midnight case
      }
    } else {
      const timeParts = time.split(':').map(Number);
      hours = Number(timeParts[0]);
      minutes = timeParts[1] ? Number(timeParts[1]) : 0;
    }
    return [hours, minutes];
  }

  calculateTotalJourneyTime(departureTime: string, arrivalTime: string) {
    const [depHours, depMinutes] = this.formatTrainTime(departureTime);
    const [arrHours, arrMinutes] = this.formatTrainTime(arrivalTime);

    const departureTotalMinutes = depHours * 60 + depMinutes;
    const arrivalTotalMinutes = arrHours * 60 + arrMinutes;

    let totalMinutesDifference = arrivalTotalMinutes - departureTotalMinutes;

    // If arrival is earlier than departure, it means the train arrives the next day
    if (totalMinutesDifference < 0) {
      totalMinutesDifference += 24 * 60; // Add 24 hours in minutes
    }

    const hours = Math.floor(totalMinutesDifference / 60);
    const minutes = totalMinutesDifference % 60;
    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
    }
  }
}
