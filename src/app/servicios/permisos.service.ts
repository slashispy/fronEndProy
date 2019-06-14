import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Permiso } from '../clases/permiso';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  permisoUrl = 'http://localhost:8091/backEndProy/permiso/';

  permisos: Permiso[];
  permiso: Permiso;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

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

  getPermission(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.permisoUrl + id, this.httpOptions)
      .pipe(
        map((resp: Permiso) => {
          this.permiso = resp;
          return this.permiso;
        }),
        catchError(this.handleError)
      );
  }

  addPermission(permission: Permiso, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.permisoUrl, permission, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  editPermission(permission: Permiso, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.permisoUrl + permission.id, permission, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
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
