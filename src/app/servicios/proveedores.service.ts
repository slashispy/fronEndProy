import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Proveedor } from '../clases/proveedor';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(private http: HttpClient) { }

  proveedorUrl = 'http://localhost:8091/backEndProy/proveedor/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  proveedores: Proveedor[];
  proveedor: Proveedor;

  getAllProveedores(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.proveedorUrl, this.httpOptions)
    .pipe(
      map( (resp: Proveedor[]) => {
        this.proveedores = resp;
        return this.proveedores;
      }
      ),
      catchError(this.handleError)
      );
  }

  getProveedor(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.proveedorUrl + id, this.httpOptions)
      .pipe(
        map((resp: Proveedor) => {
          this.proveedor = resp;
          return this.proveedor;
        }),
        catchError(this.handleError)
      );
  }

  addProveedor(provider: Proveedor, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.proveedorUrl, provider, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  editProveedor(provider: Proveedor, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.proveedorUrl + provider.id, provider, this.httpOptions)
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
      'Something bad happened; please try again later.');
  }

}
