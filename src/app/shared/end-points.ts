import {environment} from "../../environments/environment";

export class EndPoints{
  static SONG = environment.REST_SERVER + '/song';
  static USER = environment.REST_SERVER + '/user';
  static BAND = environment.REST_SERVER + '/band';
  static LOGIN = EndPoints.USER + '/login';
  static REGISTER = EndPoints.USER + '/register';
  static LOGOUT = EndPoints.USER + '/logout';
  static CONCERT = environment.REST_SERVER + '/concert';
}
