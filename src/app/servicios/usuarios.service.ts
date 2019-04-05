import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Usuario } from '../clases/usuario';
import { Observable, of } from 'rxjs';

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
      catchError(this.handleError('getAllUsers()'))
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
        catchError(this.handleError('getUser()'))
      );
  }

  addUser(user: Usuario, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.usuarioUrl, user, this.httpOptions)
    .pipe(
      catchError(this.handleError('addUser()'))
    );
  }

  editUser(user: Usuario, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.usuarioUrl + user.id, user, this.httpOptions)
    .pipe(
      catchError(this.handleError('editUser()'))
    );
  }

  getUserByUsuario(usuario: string, token: string): Observable<Usuario> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.usuarioUrl + 'user/' + usuario, this.httpOptions)
    .pipe(
      map((resp: Usuario) => {
        this.usuario = resp;
        return this.usuario;
      }),
      catchError(this.handleError<Usuario>('getByUsuario()'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
