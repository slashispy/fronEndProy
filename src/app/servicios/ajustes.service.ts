import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Ajuste, DetalleAjuste, TipoAjuste } from '../clases/ajuste';

@Injectable({
  providedIn: 'root'
})
export class AjustesService {
  formData: Ajuste;
  ajustes: Ajuste[];
  ajusteItem: DetalleAjuste[] = new Array();
  tiposAjuste: TipoAjuste[] = new Array();

  constructor(private http: HttpClient) { }

  ajusteUrl = 'http://localhost:8091/backEndProy/ajuste/';
  tipoAjusteUrl = 'http://localhost:8091/backEndProy/tipoTransaccion/?uso=A';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  getAllAjustes(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.ajusteUrl, this.httpOptions)
      .pipe(
        map((resp: Ajuste[]) => {
          this.ajustes = resp;
          return this.ajustes;
        }
        ),
        catchError(this.handleError)
      );
  }

  getAjuste(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.ajusteUrl + id, this.httpOptions)
      .pipe(
        map((resp: Ajuste) => {
          this.formData = resp;
          return this.formData;
        }),
        catchError(this.handleError)
      );
  }

  getAjusteByEstado(token: string, estado: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.ajusteUrl + '?estado=' + estado, this.httpOptions)
      .pipe(
        map((resp: Ajuste[]) => {
          this.ajustes = resp;
          return this.ajustes;
        }
        ),
        catchError(this.handleError)
      );
  }

  getAllTiposAjuste(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.tipoAjusteUrl, this.httpOptions)
      .pipe(
        map((resp: TipoAjuste[]) => {
          this.tiposAjuste = resp;
          return this.tiposAjuste;
        }
        ),
        catchError(this.handleError)
      );
  }

  addAjuste(ajuste: Ajuste, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post(this.ajusteUrl, ajuste, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  editAjuste(ajuste: Ajuste, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.ajusteUrl + ajuste.id, ajuste, this.httpOptions)
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
