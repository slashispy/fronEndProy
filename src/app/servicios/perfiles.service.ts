import { Injectable } from '@angular/core';
import { Perfil } from '../clases/perfil';
import { Permiso } from '../clases/permiso';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  perfilesUrl = 'http://localhost:8091/backEndProy/perfil/';
  permisoUrl = 'http://localhost:8091/backEndProy/permiso/';

  perfiles: Perfil[];
  perfil: Perfil;
  permisos: Permiso[];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }


  getAllProfiles(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.perfilesUrl, this.httpOptions)
    .pipe(
      map( (resp: Perfil[]) => {
        this.perfiles = resp;
        return this.perfiles;
      }
      ),
      catchError(this.handleError)
      );
  }

  getProfile(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.perfilesUrl + id, this.httpOptions)
      .pipe(
        map((resp: Perfil) => {
          this.perfil = resp;
          return this.perfil;
        }),
        catchError(this.handleError)
      );
  }

  addProfile(profile: Perfil, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.perfilesUrl, profile, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  editProfile(profile: Perfil, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.perfilesUrl + profile.id, profile, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  getAllPermits(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.permisoUrl, this.httpOptions)
    .pipe(
      map( (resp: Permiso[]) => {
        this.permisos = resp;
        return this.permisos;
      }
      ),
      catchError(this.handleError)
      );
  }


  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      error);
  }
}
