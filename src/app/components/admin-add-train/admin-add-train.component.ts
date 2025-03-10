import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationDot, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { IStation } from '../../model/train';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-admin-add-train',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AlertComponent,
  ],
  templateUrl: './admin-add-train.component.html',
  styleUrl: './admin-add-train.component.css',
})
export class AdminAddTrainComponent {
  @Input() showAddTrainPopup = false;
  @Output() closePopupEvent = new EventEmitter<void>();
  addTrainForm: FormGroup;
  faXmark = faXmark;
  faLocationDot = faLocationDot;
  stationList: IStation[] = [];
  showSameLocationError = false;

  private ticketBookingService = inject(TicketBookingService);

  constructor(private fb: FormBuilder) {
    this.addTrainForm = this.fb.group({
      trainId: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      trainNo: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(3),
        ],
      ],
      trainName: ['', Validators.required],
      departureStationId: ['', Validators.required],
      arrivalStationId: ['', Validators.required],
      departureTime: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      totalSeats: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      departureDate: ['', Validators.required],
      // bookedSeats: [0, Validators.pattern('^[0-9]+$')],
      // }
    });

    // "departureTime": "string",
    // "arrivalTime": "string",
    // "totalSeats": 0,
    // "departureDate": "2025-03-09T14:57:15.974Z"
  }

  ngOnInit() {
    this.getAllStations();
    console.log(this.addTrainForm.get('trainNo')?.errors);
  }

  getAllStations() {
    this.ticketBookingService.getAllStations().subscribe((res: any) => {
      this.stationList = res.data;
    });
  }

  // "trainId": 0,
  // "trainNo": 0,
  // "trainName": "string",
  // "departureStationId": 0,
  // "arrivalStationId": 0,
  // "departureTime": "string",
  // "arrivalTime": "string",
  // "totalSeats": 0,
  // "departureDate": "2025-03-09T14:57:15.974Z"

  // trainId: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
  //     //While adding train we dont need trainId as it is primary key
  //     trainNo: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.pattern('^[0-9]+$'),
  //         Validators.minLength(3),
  //       ],
  //     ],
  //     trainName: ['', Validators.required],
  //     departureStationName: ['', Validators.required],
  //     arrivalStationName: ['', Validators.required],
  //     arrivalTime: ['', Validators.required],
  //     departureTime: ['', Validators.required],
  //     totalSeats: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
  //     departureDate: ['', Validators.required],
  //     bookedSeats: [0, Validators.pattern('^[0-9]+$')],

  closePopup() {
    this.showAddTrainPopup = false;
    this.closePopupEvent.emit();
  }

  addTrain() {
    if (
      this.addTrainForm.value.departureStationId ===
      this.addTrainForm.value.arrivalStationId
    ) {
      this.showSameLocationError = true;
      return;
    }
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
