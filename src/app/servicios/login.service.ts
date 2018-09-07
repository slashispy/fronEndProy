import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Credenciales } from '../clases/credenciales';


@Injectable()
export class LoginService {
  loginUrl = 'http://localhost:8091/backEndProy/auth/login';

  constructor(private http: Http) { }

  login( entrada: Credenciales) {
    const cpHeaders = new Headers({'Content-type' : 'application/json'});
    const options = new RequestOptions({headers : cpHeaders});
    console.log('Login ' + entrada.usuario + ' ' + entrada.password );
    return this.http.post(this.loginUrl, entrada, options)
    // .map(success => success.status)
    // .catch(this.handleError);
    .pipe(
      tap((salida: Response) => console.log(salida.json()) ),
      catchError(this.handleError)
    );
  }


  private extractData(res: Response | any) {
    const body = res.json();
    return body;
  }

  private handleError(error: Response |any) {
    console.error(error.message || error);
    return Observable.throw(error.status);
  }
}
