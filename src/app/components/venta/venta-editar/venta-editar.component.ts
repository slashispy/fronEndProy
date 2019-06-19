import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../clases/utils/date-adapter';
import { Credenciales } from '../../../clases/credenciales';
import { TipoVenta, Venta } from '../../../clases/venta';
import { Cliente } from '../../../clases/cliente';
import { VentasService } from '../../../servicios/ventas.service';
import { AlertService } from '../../../servicios/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venta-editar',
  templateUrl: './venta-editar.component.html',
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  }, {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class VentaEditarComponent implements OnInit {
  ventaForm = new FormGroup({
    id: new FormControl( '' , Validators.required),
    fecha: new FormControl({value: '', disabled: true}, Validators.required),
    nroFactura: new FormControl({value: '', disabled: true}, Validators.required),
    cliente: new FormControl({value: '', disabled: true}, Validators.required),
    importe: new FormControl({value: '', disabled: true}, Validators.required),
    descuento: new FormControl({value: '', disabled: true}, Validators.required),
    tipoVenta: new FormControl({value: '', disabled: true}, Validators.required),
    mediosPago: new FormControl({value: '', disabled: true}, Validators.required),
    detalleVenta: new FormControl({value: '', disabled: true}, Validators.required)
  });
  currentUser: Credenciales;
  tipoVenta: TipoVenta;
  cliente: Cliente;
  submitted = false;
  venta: Venta;
  estado = 'C';

  constructor(private ventasService: VentasService,
    private alertService: AlertService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      const ventaId = localStorage.getItem('ventaId');
      if (!ventaId) {
        this.router.navigate(['home']);
        return;
      }
      this.ventasService.getVenta(this.currentUser.token, ventaId)
      .subscribe(
        resp => {
          this.estado = resp.estado;
          this.ventaForm.controls['id'].setValue(resp.id);
          this.ventaForm.controls['nroFactura'].setValue(resp.nroFactura);
          this.ventaForm.controls['fecha'].setValue(resp.fecha);
          this.ventaForm.controls['cliente'].setValue(resp.cliente.razonSocial);
          this.cliente = resp.cliente;
          this.ventaForm.controls['importe'].setValue(resp.importe);
          this.ventaForm.controls['descuento'].setValue(resp.descuento);
          this.ventaForm.controls['tipoVenta'].setValue(resp.tipoVenta.descripcion);
          this.tipoVenta = resp.tipoVenta;
          this.ventaForm.controls['detalleVenta'].setValue(resp.detalleVenta);
          this.ventaForm.controls['mediosPago'].setValue(resp.mediosPago);
        },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  get f() {return this.ventaForm.controls; }

  volver() {
    if (this.estado === 'P') {
      this.router.navigate(['/ventas-pendientes']);
    } else if ( this.estado === 'A') {
      this.router.navigate(['/ventas']);
    } else {
      this.router.navigate(['/ventas-canceladas']);
    }
  }

  cancelarVenta() {
    this.editarVenta('C');
  }

  editarVenta(estado: string) {
    this.submitted = true;
    this.venta = this.ventaForm.value;
    this.venta.estado = estado;
    if (this.currentUser != null) {
      this.ventasService.editVenta(this.venta, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/ventas']);
        },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    }
  }

}
