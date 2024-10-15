import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IStation, ITrain } from '../model/train';

@Injectable({
  providedIn: 'root',
})
export class TicketBookingService {
  apiRoute = 'https://freeapi.miniprojectideas.com/api/TrainApp/';

  constructor(private httpClient: HttpClient) {}

  getAllStations(): Observable<IStation> {
    return this.httpClient.get<IStation>(this.apiRoute + 'GetAllStations');
  }

  getAllTrainAdmin(): Observable<ITrain> {
    return this.httpClient.get<ITrain>(this.apiRoute + 'GetAllTrains');
  }
}
