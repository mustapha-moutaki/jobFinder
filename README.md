``` js

debounceTime




// api
addToCondidats(userId: number, jobSlug: string): Observable<Condidat | null> {
   const condidat: Condidat = {userId, jobSlug, status: 'pending'};

    return this.http.post<Condidat>(`${this.localUrl}/condidats`, condidat).pipe(
    catchError(error => {
      console.error('Apply failed:', error);
      return of(null); 
    })
  );
}



// service
 addToCondidats(userId:number, jobSlug: string ){
    return this.jobApi.addToCondidats(userId, jobSlug);
  }





// jobsDetails
openApply(job: Job | null) {

  if (!job) return;

  // concept 1: get current authenticated user from AuthService
  const currentUser = this.authService.getCurrentUser();

  if (!currentUser) {
    console.log('User not logged in');
    return;
  }

  console.log('User clicked Apply button');
  // concept 2: synchronous action (console.log)

  // concept 3: HTTP POST via Observable
  this.jobService.addToCondidats(currentUser.id!, job.slug).subscribe({
    next: () => {
      console.log('Candidature saved in database');

      // concept 4: delayed execution (setTimeout)
      setTimeout(() => {
        console.log('Redirecting to official website...');
        window.open(job.url!, '_blank');
      }, 3000);
    },
    error: (err) => {
      console.error('Error while saving candidature', err);
    }
  });
}


```