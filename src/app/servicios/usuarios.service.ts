import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Usuario } from '../clases/usuario';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarioUrl = 'http://localhost:8091/backEndProy/usuario/';

  usuarios: Usuario[];
  usuario: Usuario;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

  getAllUsers(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.usuarioUrl, this.httpOptions)
    .pipe(
      map( (resp: Usuario[]) => {
        this.usuarios = resp;
        return this.usuarios;
      }
      ),
      catchError(this.handleError)
      );
  }

  getUser(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.usuarioUrl + id, this.httpOptions)
      .pipe(
        map((resp: Usuario) => {
          this.usuario = resp;
          return this.usuario;
        }),
        catchError(this.handleError)
      );
  }

  addUser(user: Usuario, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.usuarioUrl, user, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  editUser(user: Usuario, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.usuarioUrl + user.id, user, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  getUserByUsuario(usuario: string, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.usuarioUrl + 'user/' + usuario, this.httpOptions)
    .pipe(
      map((resp: Usuario) => {
        this.usuario = resp;
        return this.usuario;
      }),
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
