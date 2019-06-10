import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Parametro } from '../clases/parametro';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  parametroUrl = 'http://localhost:8091/backEndProy/parametro/';

  parametros: Parametro[];
  parametro: Parametro;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }


  getAllParameters(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.parametroUrl, this.httpOptions)
    .pipe(
      map( (resp: Parametro[]) => {
        this.parametros = resp;
        return this.parametros;
      }
      ),
      catchError(this.handleError)
      );
  }

  getParameter(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.parametroUrl + id, this.httpOptions)
      .pipe(
        map((resp: Parametro) => {
          this.parametro = resp;
          return this.parametro;
        }),
        catchError(this.handleError)
      );
  }

  addParameter(parameter: Parametro, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.parametroUrl, parameter, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  editParameter(parameter: Parametro, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.parametroUrl + parameter.id, parameter, this.httpOptions)
    .pipe(
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
