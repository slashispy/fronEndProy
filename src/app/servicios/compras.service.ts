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
  compra: Compra;
  constructor(private http: HttpClient) { }

  compraUrl = 'http://localhost:8091/backEndProy/compra/';
  comprasUrl = 'http://localhost:8091/backEndProy/compra/?estado=A';
  tipoCompraUrl = 'http://localhost:8091/backEndProy/tipoTransaccion/?uso=C';
  comprasUrlPendiente = 'http://localhost:8091/backEndProy/compra/?estado=P';
  comprasUrlCancelada = 'http://localhost:8091/backEndProy/compra/?estado=C';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  getAllCompras(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.comprasUrl, this.httpOptions)
    .pipe(
      map( (resp: Compra[]) => {
        this.compras = resp;
        return this.compras;
      }
      ),
      catchError(this.handleError)
      );
  }

  getAllComprasPendientes(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.comprasUrlPendiente, this.httpOptions)
    .pipe(
      map( (resp: Compra[]) => {
        this.compras = resp;
        return this.compras;
      }
      ),
      catchError(this.handleError)
      );
  }

  getAllComprasCanceladas(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.comprasUrlCancelada, this.httpOptions)
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

  getCompra(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.compraUrl + id, this.httpOptions)
      .pipe(
        map((resp: Compra) => {
          this.compra = resp;
          return this.compra;
        }),
        catchError(this.handleError)
      );
  }

  editCompra(compra: Compra, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.compraUrl + compra.id, compra, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  informeCompras(token: string, desde: string, hasta: string, estado: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.compraUrl + 'informe/?estado=' + estado + '&desde=' + desde + '&hasta=' + hasta, this.httpOptions)
    .pipe(
      map( (resp: Compra[]) => {
        this.compras = resp;
        return this.compras;
      }
      ),
      catchError(this.handleError)
      );
  }
}
