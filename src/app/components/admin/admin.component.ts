import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TicketBookingService } from '../../services/ticket-booking.service';
import { IStation, ITrain } from '../../model/train';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import {
  faArrowRight,
  faPlus,
  faSearch,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { AdminAddTrainComponent } from '../admin-add-train/admin-add-train.component';
import { ToastComponent } from '../toast/toast.component';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AdminAddTrainComponent,
    ToastComponent,
    FormsModule,
    LoaderComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;
  trainForm: FormGroup;
  trainList: ITrain[] = [];
  filteredTrains: ITrain[] = [];
  faArrowRight = faArrowRight;
  faPlus = faPlus;
  faTrash = faTrash;
  faSearch = faSearch;
  showAddTrainPopup = false;
  showDeleteConfirmation = false;
  trainToDelete!: number;
  searchTerm: string = '';
  loading = true;
  stationList: IStation[] = [];

  private ticketBookingService = inject(TicketBookingService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.trainForm = this.fb.group({
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
    this.getAllStations();
    this.searchTerm = '';
  }

  getAllTrains() {
    this.ticketBookingService.getAllTrainAdmin().subscribe((res: any) => {
      this.trainList = res.data;
      this.filteredTrains = this.trainList;
      this.loading = false;
    });
  }

  getAllStations() {
    this.ticketBookingService.getAllStations().subscribe((res: any) => {
      this.stationList = res.data;
    });
  }

  formatDepartureTime(departureTime: string) {
    return moment(departureTime).format('MMMM Do YYYY');
  }

  addTicketPopup() {
    this.showAddTrainPopup = true;
  }

  closeAddTrainPopup() {
    this.showAddTrainPopup = false;
  }

  deleteTrainPopup(trainId: number) {
    this.trainToDelete = trainId;
    this.showDeleteConfirmation = true;
  }

  deleteTrain() {
    if (this.trainToDelete) {
      this.ticketBookingService
        .deleteTrain(this.trainToDelete)
        .subscribe((res: any) => {
          if (res) {
            //Updating the delete in realtime
            this.trainList = this.trainList.filter(
              (train) => train.trainId !== this.trainToDelete
            );
            this.filteredTrains = this.trainList;
            this.cdr.detectChanges();
            this.showDeleteConfirmation = false;
            this.showSuccessToast();
          } else {
            this.showTrainDeleteError(res);
          }
        });
    }
  }

  applyFilter() {
    this.filteredTrains = this.trainList.filter(
      (train) =>
        (train.trainName &&
          train.trainName
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())) ||
        (train.departureStationName &&
          train.departureStationName
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())) ||
        (train.arrivalStationName &&
          train.arrivalStationName
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()))
    );
  }

  showSuccessToast() {
    if (this.toast) {
      this.toast.showToastPopup('Train Deleted Successfully', 'success');
    }
  }

  showTrainDeleteError(errorMessage: string) {
    if (this.toast) {
      this.toast.showToastPopup(errorMessage, 'error');
    }
  }

  handleTrainAdded(newTrain: ITrain) {
    if (this.stationList) {
      //The res we are getting after adding new train doesn't includes the departureStation.stationName and arrivalStation.stationName, so we call another api stationList, and map stationId with departureStationId returned by res from new train api
      const departureStation = this.stationList.find((station) => {
        return station.stationID === newTrain.departureStationId;
      });
      const arrivalStation = this.stationList.find((station) => {
        return station.stationID === newTrain.arrivalStationId;
      });
      newTrain.departureStationName = departureStation?.stationName || '';
      newTrain.arrivalStationName = arrivalStation?.stationName || '';

      this.trainList.push(newTrain);
      // Sort the trainList by trainId in descending order to appear at top
      this.trainList.sort((a, b) => b.trainId - a.trainId);
      this.filteredTrains = this.trainList;
      this.showAddTrainPopup = false;
      this.toast.showToastPopup('Train Added Successfully', 'success');
    }
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
