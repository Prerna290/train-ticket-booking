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
