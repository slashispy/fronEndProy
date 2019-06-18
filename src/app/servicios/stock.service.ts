import { Injectable } from '@angular/core';
import { Stock } from '../clases/stock';
import { Producto } from '../clases/producto';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  stock: Stock;
  stocks: Stock[];
  productos: Producto[];

  constructor(private http: HttpClient) { }

  stockUrl = 'http://localhost:8091/backEndProy/stock/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  getAllStock(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.stockUrl, this.httpOptions)
      .pipe(
        map((resp: Stock[]) => {
          this.stocks = resp;
          return this.stocks;
        }
        ),
        catchError(this.handleError)
      );
  }

  getStock(token: string, id: String) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.stockUrl + id, this.httpOptions)
      .pipe(
        map((resp: Stock) => {
          this.stock = resp;
          return this.stock;
        }
        ),
        catchError(this.handleError)
      );
  }

  getAllProductsStock(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.stockUrl + 'disponible', this.httpOptions)
      .pipe(
        map((resp: Producto[]) => {
          this.productos = resp;
          return this.productos;
        }
        ),
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
