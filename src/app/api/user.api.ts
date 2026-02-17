import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { User } from '../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly http = inject(HttpClient);
  private localApi = `${environment.localApi}/users`;

  editUserData(id: number, data: Partial<User>): Observable<any> {
    return this.http.patch(`${this.localApi}/${id}`, data);
  }

  deleteUserAccount(id: number): Observable<void | null> {
    return this.http.delete<void>(`${this.localApi}/${id}`);
  }
}
