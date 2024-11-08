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
  travelDate: string;
  bookingDate: string;
  totalSeats: 0;
  TrainAppBookingPassengers: {
    bookingPassengerId: 0;
    bookingId: 0;
    passengerName: string;
    seatNo: 0;
    age: 0;
  };
}
