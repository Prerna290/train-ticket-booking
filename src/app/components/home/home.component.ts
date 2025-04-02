import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faCalendarDays,
  faCircleInfo,
  faClock,
  faLocationDot,
  faTicket,
  faTrain,
} from '@fortawesome/free-solid-svg-icons';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { IStation } from '../../model/train';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AlertComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  faTrain = faTrain;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faLocationDot = faLocationDot;
  faCalendarDays = faCalendarDays;
  faTicket = faTicket;
  faClock = faClock;

  minDate = moment().format('YYYY-MM-DD');

  stationList: IStation[] = [];
  stationForm: FormGroup;
  showSameLocationError = false;

  private ticketBookingService = inject(TicketBookingService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.stationForm = this.fb.group({
      fromStation: ['', Validators.required],
      toStation: ['', Validators.required],
      date: [this.minDate, Validators.required],
    });
  }

  ngOnInit() {
    this.getAllStations();
  }

  getAllStations() {
    this.ticketBookingService.getAllStations().subscribe((res: any) => {
      this.stationList = res.data;
    });
  }

  onSubmit() {
    if (this.stationForm.invalid) return;
    if (
      this.stationForm.value.fromStation === this.stationForm.value.toStation
    ) {
      this.showSameLocationError = true;
      return;
    }
    this.router.navigate([
      '/search',
      this.stationForm.value.fromStation,
      this.stationForm.value.toStation,
      this.stationForm.value.date,
    ]);
  }

  swapStations() {
    const { fromStation, toStation } = this.stationForm.value;
    this.stationForm.patchValue({
      fromStation: toStation,
      toStation: fromStation,
    });
    this.showSameLocationError = false;
  }
}
