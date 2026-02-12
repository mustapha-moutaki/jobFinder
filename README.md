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




```