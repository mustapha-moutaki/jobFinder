export interface Condidat {
  jobSlug:string; 
  userId: number;
  title: string;
  company: string;
  location: string;
  status: 'pending' | 'accepted' | 'rejected';
}
