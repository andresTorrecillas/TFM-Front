import {User} from "./user.model";

export interface RegisterDto{
  password: string,
  user: User
}
