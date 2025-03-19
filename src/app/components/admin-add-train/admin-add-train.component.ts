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
import { IStation, ITrain } from '../../model/train';
import { AlertComponent } from '../alert/alert.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-admin-add-train',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AlertComponent,
    ToastComponent,
  ],
  templateUrl: './admin-add-train.component.html',
  styleUrl: './admin-add-train.component.css',
})
export class AdminAddTrainComponent {
  @Input() showAddTrainPopup = false;
  @Output() closePopupEvent = new EventEmitter<void>();
  @Output() trainAddedEvent = new EventEmitter<ITrain>();
  addTrainForm: FormGroup;
  faXmark = faXmark;
  faLocationDot = faLocationDot;
  stationList: IStation[] = [];
  showSameLocationError = false;
  today!: string;

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
    });
  }

  ngOnInit() {
    this.getAllStations();
    //To disable past dates, while adding trains
    this.today = new Date().toISOString().split('T')[0];
  }

  getAllStations() {
    this.ticketBookingService.getAllStations().subscribe((res: any) => {
      this.stationList = res.data;
    });
  }

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
    this.ticketBookingService
      .addNewTrain(this.addTrainForm.value)
      .subscribe((res: any) => {
        if (res) {
          this.trainAddedEvent.emit(res.data);
          this.showAddTrainPopup = false;
          this.closePopupEvent.emit();
        }
      });
  }
}
