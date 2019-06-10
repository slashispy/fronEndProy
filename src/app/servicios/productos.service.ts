import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Producto } from '../clases/producto';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http: HttpClient) { }

  productoUrl = 'http://localhost:8091/backEndProy/producto/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  productos: Producto[];
  producto: Producto;

  getAllProducts(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.productoUrl, this.httpOptions)
    .pipe(
      map( (resp: Producto[]) => {
        this.productos = resp;
        return this.productos;
      }
      ),
      catchError(this.handleError)
      );
  }

  getAllProductsActives(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.productoUrl + '?estado=A', this.httpOptions)
    .pipe(
      map( (resp: Producto[]) => {
        this.productos = resp;
        return this.productos;
      }
      ),
      catchError(this.handleError)
      );
  }

  getProduct(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.productoUrl + id, this.httpOptions)
      .pipe(
        map((resp: Producto) => {
          this.producto = resp;
          return this.producto;
        }),
        catchError(this.handleError)
      );
  }

  addProduct(product: Producto, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.productoUrl, product, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  editProduct(product: Producto, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.productoUrl + product.id, product, this.httpOptions)
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
