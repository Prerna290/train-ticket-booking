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
import { ITrain } from '../../model/train';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AdminAddTrainComponent } from '../admin-add-train/admin-add-train.component';
import { ToastComponent } from '../toast/toast.component';

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
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;
  trainForm: FormGroup;
  trainList: ITrain[] = [];
  filteredTrains: ITrain[] = [];
  faArrowRightArrowLeft = faArrowRightArrowLeft;
  showAddTrainPopup = false;
  showDeleteConfirmation = false;
  trainToDelete!: number;
  searchTerm: string = '';

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
  }

  getAllTrains() {
    this.ticketBookingService.getAllTrainAdmin().subscribe((res: any) => {
      this.trainList = res.data;
      this.filteredTrains = this.trainList;
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
        train.trainName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        train.departureStationName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        train.arrivalStationName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
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
    this.trainList.push(newTrain);
    this.filteredTrains = this.trainList;
    this.showAddTrainPopup = false;
  }
}
