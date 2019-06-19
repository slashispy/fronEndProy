import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Venta, Item, TipoVenta, ProductoStock } from '../clases/venta';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  formData: Venta;
  ventas: Venta[];
  productos: ProductoStock[];
  ventaItems: Item[] = new Array();
  tiposVenta: TipoVenta[] = new Array();
  venta: Venta;
  constructor(private http: HttpClient) { }

  ventaUrl = 'http://localhost:8091/backEndProy/venta/';
  ventasUrl = 'http://localhost:8091/backEndProy/venta/?estado=A';
  tipoVentaUrl = 'http://localhost:8091/backEndProy/tipoTransaccion/?uso=V';
  stockUrl = 'http://localhost:8091/backEndProy/stock/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  getAllVentas(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.ventasUrl, this.httpOptions)
    .pipe(
      map( (resp: Venta[]) => {
        this.ventas = resp;
        return this.ventas;
      }
      ),
      catchError(this.handleError)
      );
  }

  getAllProductos(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.stockUrl, this.httpOptions)
    .pipe(
      map( (resp: ProductoStock[]) => {
        this.productos = resp;
        return this.productos;
      }
      ),
      catchError(this.handleError)
      );
  }

  getAllTiposVenta(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.tipoVentaUrl, this.httpOptions)
    .pipe(
      map( (resp: TipoVenta[]) => {
        this.tiposVenta = resp;
        return this.tiposVenta;
      }
      ),
      catchError(this.handleError)
      );
  }

  addVenta(venta: Venta, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.ventaUrl, venta, this.httpOptions)
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

  getVenta(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.ventaUrl + id, this.httpOptions)
      .pipe(
        map((resp: Venta) => {
          this.venta = resp;
          return this.venta;
        }),
        catchError(this.handleError)
      );
  }

  editCompra(venta: Venta, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.ventaUrl + venta.id, venta, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }
}
