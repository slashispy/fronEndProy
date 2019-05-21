import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Compra, CompraItem } from '../clases/compra';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  formData: Compra;
  compraItems: CompraItem[] = new Array();

  constructor(private http: HttpClient) { }
}
