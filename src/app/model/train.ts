export interface IStation {
  stationID: number;
  stationName: string;
  stationCode: string;
}

export interface ITrain {
  trainId: number;
  trainNo: number;
  trainName: string;
  departureStationName: string;
  arrivalStationName: string;
  arrivalTime: string;
  departureTime: string;
  totalSeats: number;
  departureDate: string;
  bookedSeats: number;
  departureStationId: number;
  arrivalStationId: number;
  arrivalDate: string;
  journeyTime: string;
}

export interface ISearch {
  fromStationId: number;
  toStationId: number;
  dateOfTravel: string;
}

export interface IUser {
  passengerID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface IPassenger {
  passengerName: string;
  age: number;
}

export interface IBookTicket {
  bookingId: number;
  passengerId: number;
  travelDate: string | null;
  bookingDate: string;
  totalSeats: 0;
  TrainAppBookingPassengers: ITrainBookingPassengers;
}

export interface IBooking {
  trainId: number;
  trainName: string;
  trainNo: number;
  departureStationName: string;
  seatNo?: number;
  arrivalStationName: string;
  arrivalTime: string;
  departureTime: string;
  departureDate: string;
  passengerName?: string;
  age?: number;
  bookingPassengerId?: number;
  passengers: ITrainBookingPassengers[];
}

export interface ITrainBookingPassengers {
  bookingPassengerId: number;
  passengerName: string;
  seatNo: number;
  age: number;
}
