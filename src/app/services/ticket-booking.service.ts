import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  IBookTicket,
  IPassenger,
  ISearch,
  IStation,
  ITrain,
  IUser,
} from '../model/train';

@Injectable({
  providedIn: 'root',
})
export class TicketBookingService {
  apiRoute = 'https://freeapi.miniprojectideas.com/api/TrainApp/';

  private isUserLoggedIn = new BehaviorSubject<boolean>(false);
  userLoggedIn$ = this.isUserLoggedIn.asObservable();

  constructor(private httpClient: HttpClient) {
    const userData = localStorage.getItem('trainApp');
    if (userData) {
      this.isUserLoggedIn.next(true);
    }
  }

  getAllStations(): Observable<IStation> {
    return this.httpClient.get<IStation>(this.apiRoute + 'GetAllStations');
  }

  getAllTrainAdmin(): Observable<ITrain> {
    return this.httpClient.get<ITrain>(this.apiRoute + 'GetAllTrains');
  }

  getSearchTrains(
    fromStationId: number,
    toStationId: number,
    dateOfTravel: string
  ): Observable<ISearch> {
    const params = new HttpParams()
      .set('departureStationId', fromStationId)
      .set('arrivalStationId', toStationId)
      .set('departureDate', dateOfTravel);
    return this.httpClient.get<ISearch>(
      this.apiRoute + 'GetTrainsBetweenStations',
      { params }
    );
  }

  addUsers(user: IUser): Observable<IUser> {
    return this.httpClient.post<IUser>(
      this.apiRoute + 'AddUpdatePassengers',
      user
    );
  }

  loginDetails(userData: IUser) {
    localStorage.setItem('trainApp', JSON.stringify(userData));
    this.isUserLoggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('trainApp');
    this.isUserLoggedIn.next(false);
  }

  // getUserData() {
  //   const userData = localStorage.getItem('userData');
  //   return userData ? JSON.parse(userData) : null;
  // }

  loginUser(user: any): Observable<any> {
    const requestBody = {
      phone: user.phone,
      password: user.password,
    };
    return this.httpClient.post<any>(this.apiRoute + 'Login', requestBody);
  }

  bookTicket(bookingData: any): Observable<IBookTicket> {
    return this.httpClient.post<any>(this.apiRoute + 'BookTrain', bookingData);
  }

  getBookedTrainData(passengerId: number): Observable<ITrain> {
    const params = new HttpParams().set('passengerid', passengerId);
    return this.httpClient.get<ITrain>(
      this.apiRoute + 'GetBookingByPassengerId',
      {
        params,
      }
    );
  }
}
