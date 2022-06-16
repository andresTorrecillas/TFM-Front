import {DateTime} from "../shared/date-time.model";

export interface Concert {
  id: string,
  name: string,
  color: string,
  state: string,
  date: DateTime,
  address: string,
  modality: string,
}
