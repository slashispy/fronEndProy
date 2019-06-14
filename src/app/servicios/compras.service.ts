import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Compra, Item, TipoCompra } from '../clases/compra';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  formData: Compra;
  compras: Compra[];
  compraItems: Item[] = new Array();
  tiposCompra: TipoCompra[] = new Array();
  constructor(private http: HttpClient) { }

  compraUrl = 'http://localhost:8091/backEndProy/compra/';
  tipoCompraUrl = 'http://localhost:8091/backEndProy/tipoTransaccion/?uso=C';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  getAllCompras(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.compraUrl, this.httpOptions)
    .pipe(
      map( (resp: Compra[]) => {
        this.compras = resp;
        return this.compras;
      }
      ),
      catchError(this.handleError)
      );
  }

  getAllTiposCompra(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.tipoCompraUrl, this.httpOptions)
    .pipe(
      map( (resp: TipoCompra[]) => {
        this.tiposCompra = resp;
        return this.tiposCompra;
      }
      ),
      catchError(this.handleError)
      );
  }

  addCompra(compra: Compra, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.compraUrl, compra, this.httpOptions)
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
