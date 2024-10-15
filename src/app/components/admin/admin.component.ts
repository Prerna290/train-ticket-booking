import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { ITrain } from '../../model/train';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  trainForm: FormGroup;
  trainList: ITrain[] = [];
  faArrowRightArrowLeft = faArrowRightArrowLeft;

  private ticketBookingService = inject(TicketBookingService);
  private fb = inject(FormBuilder);

  constructor() {
    // const presentDate = moment().format('YYYY-MM-DD');
    this.trainForm = this.fb.group({
      trainId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
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
      totalSeats: ['', Validators.required, Validators.pattern('^[0-9]+$')],
      departureDate: ['', Validators.required],
      bookedSeats: [0, Validators.pattern('^[0-9]+$')],
    });
  }

  ngOnInit() {
    this.getAllTrains();
  }

  getAllTrains() {
    this.ticketBookingService.getAllTrainAdmin().subscribe((res: any) => {
      this.trainList = res.data;
    });
  }

  formatDepartureTime(departureTime: string) {
    return moment(departureTime).format('MMMM Do YYYY, h:mm a');
  }

  // onSubmit() {
  //   if (
  // !this.stationForm.value.fromStation ||
  // !this.stationForm.value.toStation
  //   ) {
  //     this.showEmptyLocationError = true;
  //     return;
  //   }
  //   if (
  //     this.stationForm.value.fromStation === this.stationForm.value.toStation
  //   ) {
  //     this.showSameLocationError = true;
  //     return;
  //   }
  //   this.router.navigate([
  //     '/search',
  //     this.stationForm.value.fromStation,
  //     this.stationForm.value.toStation,
  //     this.stationForm.value.date,
  //   ]);
  // }
}
