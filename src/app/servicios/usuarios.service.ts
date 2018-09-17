import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Usuario } from '../clases/usuario';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarioUrl = 'http://localhost:8091/backEndProy/usuario/';

  usuarios: Usuario[];



  constructor(private http: HttpClient) { }

  getAllUsers(token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    httpOptions.headers = httpOptions.headers.set('Authorization', token);

    return this.http.request('GET', this.usuarioUrl, httpOptions)
    .pipe(
      map( (resp: Usuario[]) => {
        this.usuarios = resp;
        return this.usuarios;
      }
      ),
      catchError(this.handleError)
      );
  }

  addUser(user: Usuario, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    httpOptions.headers = httpOptions.headers.set('Authorization', token);
    return this.http.post(this.usuarioUrl, user, httpOptions)
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
      'Something bad happened; please try again later.');
  }
}
