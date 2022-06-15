import {DateTime} from "./date-time.model";

export interface Concert {
  id: string,
  name: string,
  color: string,
  contractState: string,
  date: DateTime,
  address: string,
  modality: string,
  coordinates: {
    latitude: number,
    longitude: number
  }
}
