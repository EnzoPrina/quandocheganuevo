export interface BusStop {
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }
  
  export interface BusLine {
    line: string;
    color: string;
    stops: BusStop[];
  }
  
  export interface Location {
    latitude: number;
    longitude: number;
  }