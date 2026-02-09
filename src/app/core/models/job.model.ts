export interface Job {
  id?:number;
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

export interface PageResponse<T> {
  data: T[]; 
  links: {
    next: string | null;
    prev: string | null;
  };
  meta: {
    current_page: number;
    per_page: number;
  };
}