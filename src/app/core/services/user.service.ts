import { inject, Injectable } from "@angular/core";
import { UserApi } from "../../api/user.api";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly userApi = inject(UserApi);

  editAccount(id: number, rawData: Partial<User>) {
    // 1. Create a clean object (remove empty values)
    const dataToSend: any = {};
    
    (Object.keys(rawData) as (keyof User)[]).forEach(key => {
      const value = rawData[key];
      // Only add to dataToSend if the user actually typed something
      if (value && value.toString().trim() !== '') {
        dataToSend[key] = value;
      }
    });

    // 2. Handle Password Hashing (only if a new password was provided)
    if (dataToSend.password) {
      const salt = bcrypt.genSaltSync(10);
      dataToSend.password = bcrypt.hashSync(dataToSend.password, salt);
    }

    return this.userApi.editUserData(id, dataToSend);
  }
}