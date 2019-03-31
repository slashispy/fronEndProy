import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Credenciales } from '../clases/credenciales';
import { Usuario } from '../clases/usuario';


@Injectable()
export class LoginService {
  loginUrl = 'http://localhost:8091/backEndProy/auth/login';
  registrerUrl = 'http://localhost:8091/backEndProy/auth/registrer';
  credenciales: Credenciales;
  usuario: Usuario;

  constructor(private http: Http) { }


  login( entrada: Credenciales) {
    const cpHeaders = new Headers({'Content-type' : 'application/json'});
    const options = new RequestOptions({headers : cpHeaders});
    this.credenciales = entrada;
    console.log('Login ' + entrada.usuario + ' ' + entrada.password );
    return this.http.post(this.loginUrl, entrada, options)
    .pipe(
      map(response => {
        const cre: Credenciales = response.json();
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
    const cpHeaders = new Headers({'Content-type' : 'application/json'});
    const options = new RequestOptions({headers : cpHeaders});
    console.log('Registrarse: ' + JSON.stringify(usuarioR));
    return this.http.post(this.registrerUrl, usuarioR, options)
    .pipe(
      map(response => {
        const cre: Credenciales = response.json();
        if (cre && cre.token) {
          cre.usuario = usuarioR.usuario;
          localStorage.setItem('currentUser', JSON.stringify(cre));
        }
        return cre;
      }),
      catchError(this.handleError)
    );

  }


  /* private extractData(res: Response | any) {
    const body = res.json();
    return body;
  }*/

  private handleError(error: Response |any) {
    console.error(error.message || error);
    return Observable.throw(error.status);
  }
}
