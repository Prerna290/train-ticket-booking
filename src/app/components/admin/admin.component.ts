import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
import { AdminAddTrainComponent } from '../admin-add-train/admin-add-train.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AdminAddTrainComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  trainForm: FormGroup;
  trainList: ITrain[] = [];
  faArrowRightArrowLeft = faArrowRightArrowLeft;
  showAddTrainPopup = false;
  showDeleteConfirmation = false;
  trainToDelete!: number;

  private ticketBookingService = inject(TicketBookingService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // const presentDate = moment().format('YYYY-MM-DD');
    this.trainForm = this.fb.group({
      trainId: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
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
      totalSeats: ['', Validators.required, Validators.pattern('^[0-9]+$')],
      departureDate: ['', Validators.required],
      bookedSeats: [0, Validators.pattern('^[0-9]+$')],
    });
  }

  //For train add we need
  // trainId
  // bookedSeats
  //   //While adding train we dont need trainId and booked seats field as it is primary key
  //   trainNo,
  //   trainName,
  //   departureStationId,
  //   arrivalStationId,
  //   arrivalTime
  //   departureTime,
  //   totalSeats,
  //   departureDate,
  // Add train from Add train API and then check from get Train between stations api

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

  addTicketPopup() {
    this.showAddTrainPopup = true;
  }

  closeAddTrainPopup() {
    this.showAddTrainPopup = false;
  }

  editTrain() {}

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
            this.cdr.detectChanges();
            this.showDeleteConfirmation = false;
            //show popup / toast of success
          }
          console.log(res);
        });
    }
  }

  // {
  //   "trainId": 0,
  //   "trainNo": 0,
  //   "trainName": "string",
  //   "departureStationId": 0,
  //   "arrivalStationId": 0,
  //   "departureTime": "string",
  //   "arrivalTime": "string",
  //   "totalSeats": 0,
  //   "departureDate": "2025-02-25T17:37:58.408Z"
  // }

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
