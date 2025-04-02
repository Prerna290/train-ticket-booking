import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { IPassenger, ITrain, IUser } from '../../model/train';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TicketBookingService } from '../../services/ticket-booking.service';
import moment from 'moment';
import { AlertComponent } from '../alert/alert.component';
import { ToastComponent } from '../toast/toast.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    ToastComponent,
  ],
  templateUrl: './book-ticket.component.html',
  providers: [DatePipe],
  styleUrl: './book-ticket.component.css',
})
export class BookTicketComponent {
  @ViewChild(ToastComponent) toast!: ToastComponent;
  @Input() selectedTrain!: ITrain;
  openBookTicket = true;
  faXmark = faXmark;
  passengersList: IPassenger[] = [];
  passengerForm: FormGroup;
  loggedInUserDetails!: IUser;

  constructor(
    private fb: FormBuilder,
    private ticketBookingService: TicketBookingService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.passengerForm = this.fb.group({
      passengerName: ['', Validators.required],
      age: [0, [Validators.required, Validators.max(120)]],
    });
  }

  ngOnInit() {
    const loggedInUser = localStorage.getItem('trainApp');
    if (loggedInUser !== null) {
      this.loggedInUserDetails = JSON.parse(loggedInUser);
    }
  }

  closePopup() {
    this.openBookTicket = false;
  }

  addPassenger() {
    this.passengersList.push(this.passengerForm.value);
    this.passengerForm.reset();
  }

  bookTicket() {
    if (!this.loggedInUserDetails) {
      this.showErrorToast('Please log in to book a ticket');
      this.router.navigate(['/login']);
      return;
    }
    const bookObj = {
      bookingId: 0,
      trainId: this.selectedTrain.trainId,
      passengerId: this.loggedInUserDetails.passengerID,
      travelDate: this.datePipe.transform(
        this.selectedTrain.departureDate,
        'dd MMMM yyyy'
      ),
      bookingDate: new Date(),
      totalSeats: this.selectedTrain.totalSeats,
      TrainAppBookingPassengers: [] as any,
    };

    bookObj.TrainAppBookingPassengers = this.passengersList;
    bookObj.totalSeats = this.passengersList.length;
    this.ticketBookingService.bookTicket(bookObj).subscribe((data: any) => {
      if (data.result) {
        this.showSuccessToast();
        this.passengerForm.reset();
        this.openBookTicket = false;
      } else {
        this.showErrorToast(data.message);
      }
    });
  }

  showSuccessToast() {
    if (this.toast) {
      this.toast.showToastPopup('Train Ticket Booked Successfully', 'success');
    }
  }

  showErrorToast(errorMessage: string) {
    if (this.toast) {
      this.toast.showToastPopup(errorMessage, 'error');
    }
  }

  formatDate(departureTime: string) {
    return moment(departureTime).format('MMMM Do YYYY');
  }

  removePassenger(index: number) {
    this.passengersList.splice(index, 1);
  }
}
