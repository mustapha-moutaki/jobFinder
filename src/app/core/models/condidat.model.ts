export interface Condidat {
  jobSlug:string; 
  userId: number;
  title: string;
  company: string;
  location: string;

  url: string;
  apiSource: string,
  notes: string,
  dateAdded: string;

  status: 'pending' | 'accepted' | 'rejected';
}
