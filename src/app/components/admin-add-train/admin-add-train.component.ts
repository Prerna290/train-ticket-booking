import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { TicketBookingService } from '../../services/ticket-booking.service';

@Component({
  selector: 'app-admin-add-train',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './admin-add-train.component.html',
  styleUrl: './admin-add-train.component.css',
})
export class AdminAddTrainComponent {
  @Input() showAddTrainPopup = false;
  @Output() closePopupEvent = new EventEmitter<void>();
  addTrainForm: FormGroup;
  faXmark = faXmark;

  private ticketBookingService = inject(TicketBookingService);

  constructor(private fb: FormBuilder) {
    this.addTrainForm = this.fb.group({
      // trainId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      //While adding train we dont need trainId as it is primary key
      trainNo: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(3),
        ],
      ],
      trainName: ['', Validators.required],
      departureStationName: ['', Validators.required],
      arrivalStationName: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      departureTime: ['', Validators.required],
      totalSeats: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      departureDate: ['', Validators.required],
      bookedSeats: [0, Validators.pattern('^[0-9]+$')],
      // }
    });
  }

  closePopup() {
    this.showAddTrainPopup = false;
    this.closePopupEvent.emit();
  }

  addTrain() {
    console.log('called');
    console.log(this.addTrainForm.value);
    this.ticketBookingService
      .addNewTrain(this.addTrainForm.value)
      .subscribe((res: any) => {
        if (res) {
          //show popup / toast of success
        }
        console.log(res);
      });
    this.showAddTrainPopup = false;
    // const trainObj = {
    //   trainNo: this.addTain.
    //   trainName: ['', Validators.required],
    //   departureStationName: ['', Validators.required],
    //   arrivalStationName: ['', Validators.required],
    //   arrivalTime: ['', Validators.required],
    //   departureTime: ['', Validators.required],
    //   totalSeats: ['', Validators.required, Validators.pattern('^[0-9]+$')],
    //   departureDate: ['', Validators.required],
    //   bookedSeats: [0, Validators.pattern('^[0-9]+$')],
    // };
  }
}

// Error Receiving
// An error occurred while updating the entries. See the inner exception for details."
