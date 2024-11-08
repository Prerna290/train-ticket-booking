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
  // stationForm: FormGroup;

  activatedRoute = inject(ActivatedRoute);

  faArrowRightArrowLeft = faArrowRightArrowLeft;
  faTrain = faTrain;
  faLocationDot = faLocationDot;
  faCalendarDays = faCalendarDays;
  faCircleInfo = faCircleInfo;
  moment = moment;
  openBookTicket: boolean[] = [false];

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
    this.ticketBookingService
      .getSearchTrains(
        this.searchData.fromStationId,
        this.searchData.toStationId,
        this.searchData.dateOfTravel
      )
      .subscribe((res: any) => {
        this.trainSearchResults = res.data;
        console.log(res.data);
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
}
