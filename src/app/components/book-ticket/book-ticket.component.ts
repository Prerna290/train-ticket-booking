import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
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

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule],
  templateUrl: './book-ticket.component.html',
  providers: [DatePipe],
  styleUrl: './book-ticket.component.css',
})
export class BookTicketComponent {
  @Input() selectedTrain!: ITrain;
  openBookTicket = true;
  faXmark = faXmark;
  passengersList: IPassenger[] = [];
  passengerForm: FormGroup;
  loggedInUserDetails!: IUser;

  constructor(
    private fb: FormBuilder,
    private ticketBookingService: TicketBookingService,
    private datePipe: DatePipe
  ) {
    this.passengerForm = this.fb.group({
      passengerName: ['', Validators.required],
      age: [0, [Validators.required, Validators.maxLength(3)]],
    });
  }
  //Make a passengerList and add that passenger, add validation on name and age
  ngOnInit() {
    const loggedInUser = localStorage.getItem('trainApp');
    if (loggedInUser !== null) {
      this.loggedInUserDetails = JSON.parse(loggedInUser);
    }
    console.log(this.selectedTrain);
  }

  closePopup() {
    this.openBookTicket = false;
  }

  addPassenger() {
    this.passengersList.push(this.passengerForm.value);
    this.passengerForm.reset();
    console.log(this.passengerForm.value);
  }

  bookTicket() {
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
      if (data.res) {
        alert('Ticket Booked Successfuly');
        this.openBookTicket = false;
        console.log(data);
      } else {
        alert(data.message);
      }
    });
  }
}
