import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Cliente } from '../clases/cliente';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  clientesUrl = 'http://localhost:8091/backEndProy/cliente/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  clientes: Cliente[];
  cliente: Cliente;


  getAllClients(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get( this.clientesUrl, this.httpOptions)
    .pipe(
      map( (resp: Cliente[]) => {
        this.clientes = resp;
        return this.clientes;
      }
      ),
      catchError(this.handleError)
      );

  }

  getClient(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.clientesUrl + id, this.httpOptions)
      .pipe(
        map((resp: Cliente) => {
          this.cliente = resp;
          return this.cliente;
        }),
        catchError(this.handleError)
      );
  }

  addClient(client: Cliente, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.clientesUrl, client, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  editClient(client: Cliente, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.clientesUrl + client.id, client, this.httpOptions)
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
