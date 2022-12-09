export class DateTime {
  private _date: string;
  private readonly _timezone_type: number;
  private _timezone: string;

  constructor() {
    let date = new Date();
    this._date = DateTime.FormatISODate(date.toISOString());
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

  get timezone(): string {
    return this._timezone;
  }

  set timezone(value: string) {
    this._timezone = value;
  }

  public toString(): string{
    return this.getDateObject().toLocaleString('es', {dateStyle:"short", timeStyle:"short"});
  }

  public getDatetimeLocalString(): string{
    let dateObject = this.getDateObject();
    let year = dateObject.getFullYear();
    let month = dateObject.getMonth() + 1;
    let day = dateObject.getDate();
    let hours: any = dateObject.getHours();
    if(hours < 10){
      hours = "0" + hours;
    }
    let minutes: any = dateObject.getMinutes();
    if(minutes < 10){
      minutes = "0" + minutes;
    }
    let resultString = `${year}-${month}-${day}T${hours}:${minutes}`;
    return resultString;
  }

  public static GetDateTimeFromString(stringDate: string): DateTime|null{
    let resultDate = null;
    let date = new Date(stringDate);
    if(date.toString() != "Invalid Date"){
      resultDate = new DateTime();
      resultDate.date = DateTime.FormatISODate(date.toISOString());
      resultDate.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return resultDate;
  }

  private static FormatISODate(dateString: string){
    return dateString.replace(/\./, "+").replace('Z', '0');
  }

  public static GetDateTimeOf(date: Date){
    let resultDate = new DateTime();
    resultDate.date = date.toISOString();
    resultDate.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  public static copy(date: DateTime): DateTime{
    let dateCopy = new DateTime();
    dateCopy.date = date.date;
    dateCopy.timezone = date.timezone;
    return dateCopy;
  }
}
