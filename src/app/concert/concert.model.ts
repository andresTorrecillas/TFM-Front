export interface Concert {
  id: string,
  name: string,
  color: string,
  contractState: string,
  date: Date,
  address: string,
  modality: string,
  coordinates: {
    latitude: number,
    longitude: number
  }
}
