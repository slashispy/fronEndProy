import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Compra, Item, TipoCompra } from '../../../clases/compra';
import { Router } from '@angular/router';
import { ProductosService } from '../../../servicios/productos.service';
import { ComprasService } from '../../../servicios/compras.service';
import { CompraItemsComponent } from '../compra-detalle/compra-items.component';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/clases/utils/date-adapter';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AlertService } from '../../../servicios/alert.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Proveedor } from 'src/app/clases/proveedor';

@Component({
  selector: 'app-compras-editar',
  templateUrl: './compra-editar.component.html',
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  }, {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class CompraEditarComponent implements OnInit {
  compraForm = new FormGroup({
    id: new FormControl('', Validators.required),
    fecha: new FormControl({value: '', disabled: true}, Validators.required),
    nroFactura: new FormControl({value: '', disabled: true}, Validators.required),
    timbrado: new FormControl({value: '', disabled: true}, Validators.required),
    proveedor: new FormControl({value: '', disabled: true}, Validators.required),
    importe: new FormControl({value: '', disabled: true}, Validators.required),
    descuento: new FormControl({value: '', disabled: true}, Validators.required),
    tipoCompra: new FormControl({value: '', disabled: true}, Validators.required),
    detalleCompras: new FormControl({value: '', disabled: true}, Validators.required),
  });
  proveedor: Proveedor;
  currentUser: Credenciales;
  compra: Compra;
  submitted = false;
  validator = true;
  tipoCompra: TipoCompra;

  constructor(private comprasService: ComprasService,
    private alertService: AlertService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    if (this.currentUser != null) {
      const compraId = localStorage.getItem('compraId');
      if (!compraId) {
        this.router.navigate(['home']);
        return;
      }
      this.comprasService.getCompra(this.currentUser.token, compraId)
      .subscribe(
        resp => {
          this.compraForm.controls['id'].setValue(resp.id);
          this.compraForm.controls['fecha'].setValue(resp.fecha);
          this.compraForm.controls['nroFactura'].setValue(resp.nroFactura);
          this.compraForm.controls['timbrado'].setValue(resp.timbrado);
          this.compraForm.controls['proveedor'].setValue(resp.proveedor.ruc + ' ' + resp.proveedor.razonSocial);
          this.proveedor = resp.proveedor;
          this.compraForm.controls['importe'].setValue(resp.importe);
          this.compraForm.controls['descuento'].setValue(resp.descuento);
          this.compraForm.controls['tipoCompra'].setValue(resp.tipoCompra.descripcion);
          this.tipoCompra = resp.tipoCompra;
          this.compraForm.controls['detalleCompras'].setValue(resp.detalleCompras);
        },
        errorCode => {
        this.alertService.error(errorCode);
      } );
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  get f() {return this.compraForm.controls; }

  aprobarCompra() {
    this.editarCompra('A');
  }

  cancelarCompra() {
    this.editarCompra('C');
  }

  editarCompra(estado: string) {
    this.submitted = true;
    this.compra = this.compraForm.value;
    this.compra.estado = estado;
    console.log(this.compra);
    if (this.currentUser != null) {
      this.comprasService.editCompra(this.compra, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/compras-pendientes']);
        },
        errorCode => {
        this.alertService.error(errorCode);
      } );
    }
  }
}
