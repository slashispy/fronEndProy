import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Venta, DetalleVenta, VentaDetalleMedioPago, TipoVenta, MedioPago } from '../clases/venta';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  formData: Venta;
  ventas: Venta[];
  ventasItem: DetalleVenta[] = new Array();
  ventasMediosPago: VentaDetalleMedioPago[] = new Array();
  tiposVenta: TipoVenta[] = new Array();
  mediosPagos: MedioPago[] = new Array();

  constructor(private http: HttpClient) { }

  ventaUrl = 'http://localhost:8091/backEndProy/venta/';
  tipoVentaUrl = 'http://localhost:8091/backEndProy/tipoTransaccion/?uso=V';
  medioPagoUrl = 'http://localhost:8091/backEndProy/medio-pago/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  getAllVentas(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.ventaUrl, this.httpOptions)
      .pipe(
        map((resp: Venta[]) => {
          this.ventas = resp;
          return this.ventas;
        }
        ),
        catchError(this.handleError)
      );
  }

  getVenta(token: string, id: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.ventaUrl + id, this.httpOptions)
      .pipe(
        map((resp: Venta) => {
          this.formData = resp;
          return this.formData;
        }),
        catchError(this.handleError)
      );
  }

  getVentaByEstado(token: string, estado: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.ventaUrl + '?estado=' + estado, this.httpOptions)
      .pipe(
        map((resp: Venta[]) => {
          this.ventas = resp;
          return this.ventas;
        }
        ),
        catchError(this.handleError)
      );
  }

  getAllTiposVenta(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.tipoVentaUrl, this.httpOptions)
      .pipe(
        map((resp: TipoVenta[]) => {
          this.tiposVenta = resp;
          return this.tiposVenta;
        }
        ),
        catchError(this.handleError)
      );
  }

  getAllMedioPagos(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.get(this.medioPagoUrl, this.httpOptions)
      .pipe(
        map((resp: MedioPago[]) => {
          this.mediosPagos = resp;
          return this.mediosPagos;
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

  editVenta(venta: Venta, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.put(this.ventaUrl + venta.id, venta, this.httpOptions)
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
