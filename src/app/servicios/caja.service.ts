import { Injectable } from '@angular/core';
import { Caja } from '../clases/caja';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  cajaUrl = 'http://localhost:8091/backEndProy/caja/';

  cajas: Caja[];
  caja: Caja;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

  getAllCajas(token: string, usuario: string ) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.cajaUrl + '?usuario=' + usuario, this.httpOptions)
    .pipe(
      map( (resp: Caja[]) => {
        this.cajas = resp;
        return this.cajas;
      }
      ),
      catchError(this.handleError)
      );
  }

  getCaja(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.cajaUrl + id, this.httpOptions)
      .pipe(
        map((resp: Caja) => {
          this.caja = resp;
          return this.caja;
        }),
        catchError(this.handleError)
      );
  }

  getCajaAbierta(token: string, uso: string, usuario: string ) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.cajaUrl + 'abierta/?uso=' + uso + '&usuario=' + usuario, this.httpOptions)
      .pipe(
        map((resp: Caja) => {
          this.caja = resp;
          return this.caja;
        }),
        catchError(this.handleError)
      );
  }

  registarCaja(token: string, caja: Caja) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.cajaUrl, caja, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  cerrarCaja(token: string, caja: Caja) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.cajaUrl + caja.id, caja, this.httpOptions)
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
