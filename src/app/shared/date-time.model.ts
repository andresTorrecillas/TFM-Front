export class DateTime {
  private _date: string;
  private _timezone_type: number;
  private _timezone: string;

  constructor() {
    let date = new Date();
    this._date = date.toISOString();
    this._timezone_type = 3;
    this._timezone = "Europe/Madrid"
  }

  public getDateObject(): Date{
    return new Date(this.date);
  }

  get date(): string {
    return this._date;
  }

  set date(value: string) {
    this._date = value;
  }

  get timezone_type(): number {
    return this._timezone_type;
  }

  set timezone_type(value: number) {
    this._timezone_type = value;
  }

  get timezone(): string {
    return this._timezone;
  }

  set timezone(value: string) {
    this._timezone = value;
  }

  public toString(): string{
    return this.getDateObject().toLocaleString('es', {dateStyle:"short", timeStyle:"short"});
  }

  public static GetFormattedDate(date: DateTime){
    return date.getDateObject().getDay();
  }

  public static copy(date: DateTime): DateTime{
    let dateCopy = new DateTime();
    dateCopy.date = date.date;
    dateCopy.timezone = date.timezone;
    dateCopy.timezone_type = date.timezone_type;
    return dateCopy;
  }
}
