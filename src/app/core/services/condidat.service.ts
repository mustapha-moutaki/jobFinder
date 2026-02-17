import { inject, Injectable } from '@angular/core';
import { CondidatApi } from '../../api/condidat.api';
import { Observable } from 'rxjs';
import { Condidat } from '../models/condidat.model';

@Injectable({ providedIn: 'root' })
export class CondidatService {
  private readonly condidatApi = inject(CondidatApi);

  // add to
  addToCondidat(
    userId: number,
    jobSlug: string,
    title: string,
    company: string,
    location: string,
    url: string,
  ) {
    return this.condidatApi.addToCondidat(userId, jobSlug, title, company, location, url);
  }

  getCondidatsByUserId(id: number) {
    return this.condidatApi.getCondidatsByUserId(id);
  }

  updateCondidatStatus(id: number, status: string) {
    return this.condidatApi.updateCondidatStatus(id, status);
  }

  addNoteToCondidat(id: number, notes: string) {
    return this.condidatApi.addNoteToCondidat(id, notes);
  }
}
