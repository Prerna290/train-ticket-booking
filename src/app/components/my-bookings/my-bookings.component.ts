import { Component, inject } from '@angular/core';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { IBooking, IUser } from '../../model/train';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent {
  userData!: IUser;
  myBookings: IBooking[] = [];
  groupedMyBookings: IBooking[] = [];

  private ticketBookingService = inject(TicketBookingService);

  ngOnInit() {
    const user = localStorage.getItem('trainApp');
    if (user) {
      this.userData = JSON.parse(user);
    }
    this.getMyBookings();
  }

  getMyBookings() {
    this.ticketBookingService
      .getBookedTrainData(this.userData.passengerID)
      .subscribe((result: any) => {
        this.myBookings = result.data;
        this.groupedMyBookings = this.groupBookings(this.myBookings);
        console.log(this.groupedMyBookings);
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

    console.log(Object.values(groupedBookings));
    return Object.values(groupedBookings);
  }
}

// groupBookings(bookings: IBooking[]) {
//   const groupedBookings = bookings.reduce((acc, booking) => {
//     const key = `${booking.trainId}-${booking.departureDate}`;
//     if (!acc[key]) {
//       acc[key] = {
//         trainId: booking.trainId,
//         trainName: booking.trainName,
//         trainNo: booking.trainNo,
//         departureStationName: booking.departureStationName,
//         arrivalStationName: booking.arrivalStationName,
//         departureTime: booking.departureTime,
//         arrivalTime: booking.arrivalTime,
//         departureDate: booking.departureDate,
//         passengers: [],
//       };
//     }
//     acc[key].passengers.push({
//       passengerName: booking.passengerName,
//       age: booking.age,
//       seatNo: booking.seatNo,
//       bookingPassengerId: booking.bookingPassengerId,
//     });
//     return acc;
//   }, {});
//   return Object.values(groupedBookings);
// }

// groupBookings(bookings: any[]): any[] {
//   const groupedBookings = bookings.reduce((acc, booking) => {
//     const key = `${booking.trainId}-${booking.departureDate}`;
//     if (!acc[key]) {
//       acc[key] = {
//         trainId: booking.trainId,
//         trainName: booking.trainName,
//         trainNo: booking.trainNo,
//         departureStationName: booking.departureStationName,
//         arrivalStationName: booking.arrivalStationName,
//         departureTime: booking.departureTime,
//         arrivalTime: booking.arrivalTime,
//         departureDate: booking.departureDate,
//         passengers: []
//       };
//     }
//     acc[key].passengers.push({
//       passengerName: booking.passengerName,
//       age: booking.age,
//       seatNo: booking.seatNo,
//       bookingPassengerId: booking.bookingPassengerId
//     });
//     return acc;
//   }, {});

//   return Object.values(groupedBookings);
// }
