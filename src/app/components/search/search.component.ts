import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISearch, IStation, ITrain } from '../../model/train';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  faCalendarDays,
  faCircleInfo,
  faLocationDot,
  faTrain,
} from '@fortawesome/free-solid-svg-icons';
import { BookTicketComponent } from '../book-ticket/book-ticket.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    BookTicketComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  //searchData is not initalized when declared to it is showing error ! indicates that searchData will always be inisalized before use
  searchData!: ISearch;
  trainSearchResults: ITrain[] = [];
  stationList: IStation[] = [];
  showTicketAvailability = [false];
  // stationForm: FormGroup;

  activatedRoute = inject(ActivatedRoute);

  faArrowRightArrowLeft = faArrowRightArrowLeft;
  faTrain = faTrain;
  faLocationDot = faLocationDot;
  faCalendarDays = faCalendarDays;
  faCircleInfo = faCircleInfo;
  moment = moment;
  openBookTicket: boolean[] = [false];
  isLoading = false;

  private ticketBookingService = inject(TicketBookingService);
  private fb = inject(FormBuilder);

  constructor() {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((data) => {
      if (data) {
        this.searchData = {
          fromStationId: Number(data['fromStationId']),
          toStationId: Number(data['toStationId']),
          dateOfTravel: data['dateOfTravel'],
        };
        this.getSearchResults();
        this.getAllStations();
      }
    });
  }

  getSearchResults() {
    this.isLoading = true;
    this.ticketBookingService
      .getSearchTrains(
        this.searchData.fromStationId,
        this.searchData.toStationId,
        this.searchData.dateOfTravel
      )
      .subscribe((res: any) => {
        this.trainSearchResults = res.data;
        this.trainSearchResults.forEach((train) => {
          train.arrivalDate = this.calculateArrivalDate(
            train.departureDate,
            train.arrivalTime,
            train.departureTime
          );
          train.journeyTime = this.calculateTotalJourneyTime(
            train.departureTime,
            train.arrivalTime
          );
        });
        this.isLoading = false;
      });
  }

  getAllStations() {
    this.ticketBookingService.getAllStations().subscribe((res: any) => {
      this.stationList = res.data;
    });
  }

  openBookTicketPopup(index: number) {
    this.openBookTicket[index] = !this.openBookTicket[index];
  }

  toggleCheckAvailability(index: number) {
    this.showTicketAvailability[index] = !this.showTicketAvailability[index];
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
