import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Credenciales } from '../clases/credenciales';
import { Usuario } from '../clases/usuario';
import { Perfil } from '../clases/perfil';
import { throwError } from 'rxjs';



@Injectable()
export class LoginService {
  loginUrl = 'http://localhost:8091/backEndProy/auth/login';
  registrerUrl = 'http://localhost:8091/backEndProy/auth/registrer';
  rolesUrl = 'http://localhost:8091/backEndProy/auth/perfiles';
  credenciales: Credenciales;
  usuario: Usuario;
  roles: Perfil[];

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  login( entrada: Credenciales) {
    this.credenciales = entrada;
    return this.http.post(this.loginUrl, entrada, this.httpOptions)
    .pipe(
      map((resp: Credenciales) => {
        const cre: Credenciales = resp;
        if (cre && cre.token) {
          cre.usuario = entrada.usuario;
          localStorage.setItem('currentUser', JSON.stringify(cre));
        }
        return cre;
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  registrarse(usuarioR: Usuario) {
    console.log('Registrarse: ' + JSON.stringify(usuarioR));
    return this.http.post(this.registrerUrl, usuarioR, this.httpOptions)
    .pipe(
      map((response: Credenciales) => {
        const cre: Credenciales = response;
        if (cre && cre.token) {
          cre.usuario = usuarioR.usuario;
          localStorage.setItem('currentUser', JSON.stringify(cre));
        }
        return cre;
      }),
      catchError(this.handleError)
    );

  }

  getAllProfiles() {
    return this.http.get( this.rolesUrl, this.httpOptions)
    .pipe(
      map( (resp: Perfil[]) => {
        this.roles = resp;
        console.log(this.roles);
        return this.roles;
      }
      ),
      catchError(this.handleError)
      );
  }

  /* private extractData(res: Response | any) {
    const body = res.json();
    return body;
  }*/

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
