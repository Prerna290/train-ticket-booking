import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faCalendarDays,
  faCircleInfo,
  faLocationDot,
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
  faCircleInfo = faCircleInfo;
  moment = moment;

  stationList: IStation[] = [];
  stationForm: FormGroup;
  showSameLocationError = false;

  private ticketBookingService = inject(TicketBookingService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    const presentDate = moment().format('YYYY-MM-DD');
    this.stationForm = this.fb.group({
      fromStation: ['', Validators.required],
      toStation: ['', Validators.required],
      date: [presentDate, Validators.required],
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
}
