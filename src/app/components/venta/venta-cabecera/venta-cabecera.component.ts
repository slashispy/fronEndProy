import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../clases/utils/date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Venta, DetalleVenta, TipoVenta, VentaDetalleMedioPago } from '../../../clases/venta';
import { Credenciales } from '../../../clases/credenciales';
import { Observable } from 'rxjs';
import { Cliente } from '../../../clases/cliente';
import { Router } from '@angular/router';
import { VentasService } from '../../../servicios/ventas.service';
import { AlertService } from 'src/app/servicios/alert.service';
import { ClientesService } from 'src/app/servicios/clientes.service';
import { map, startWith } from 'rxjs/operators';
import { VentaDetalleComponent } from '../venta-detalle/venta-detalle.component';
import { VentaDetalleMedioPagoComponent } from '../venta-detalle-medio-pago/venta-detalle-medio-pago.component';
import { ClienteCrearDialogComponent } from '../../clientes/cliente-crear-dialog/cliente-crear-dialog.component';

@Component({
  selector: 'app-venta-cabecera',
  templateUrl: './venta-cabecera.component.html',
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  }, {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class VentaCabeceraComponent implements OnInit {
  isValid = true;
  ventaForm = new FormGroup({
    fecha: new FormControl({value: '', disabled: true}, Validators.required),
    nroFactura: new FormControl('', Validators.required),
    cliente: new FormControl('', Validators.required),
    importe: new FormControl({value: '', disabled: true}, Validators.required),
    descuento: new FormControl({value: '', disabled: true}, Validators.required),
    tipoVenta: new FormControl('', Validators.required),
    mediosPago: new FormControl('', Validators.required),
    detalleVenta: new FormControl('', Validators.required)
  });
  submitted = false;
  currentUser: Credenciales;
  venta: Venta;
  detallesVenta: DetalleVenta[] = new Array();
  mediosPago: VentaDetalleMedioPago[] = new Array();
  maxDate = new Date();
  options: Cliente[];
  typeOptions: TipoVenta[];
  filteredOptions: Observable<Cliente[]>;
  filteredTypeOptions: Observable<TipoVenta[]>;

  constructor(private dialog: MatDialog,
    private router: Router,
    private ventasService: VentasService,
    private alertService: AlertService,
    private clientesService: ClientesService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.ventasService.ventasItem = [];
      this.ventasService.mediosPagos = [];
    }

  ngOnInit() {
    if (this.currentUser != null) {
      this.clientesService.getAllClients(this.currentUser.token)
      .subscribe(
        resp => {
          this.options = resp;
          this.filteredOptions = this.ventaForm.controls.cliente.valueChanges
            .pipe(
              startWith<string | Cliente>(''),
              map(value => typeof value === 'string' ? value : value.razonSocial),
              map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
            );
            this.ventasService.getAllTiposVenta(this.currentUser.token)
            .subscribe(
              resp2 => {
                this.typeOptions = resp2;
                this.filteredTypeOptions = this.ventaForm.controls.tipoVenta.valueChanges
                  .pipe(
                    startWith<string | TipoVenta>(''),
                    map(value => typeof value === 'string' ? value : value.descripcion),
                    map(descripcion => descripcion ? this._filterType(descripcion) : this.typeOptions.slice())
                  );
                this.ventaForm.controls['importe'].setValue(0);
                this.ventaForm.controls['descuento'].setValue(0);
              },
              errorCode => {
                this.alertService.error(errorCode);
              }
            );
        },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  AddOrEditVentaDetalle(orderItemIndex) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { orderItemIndex };
    this.dialog.open(VentaDetalleComponent, dialogConfig).afterClosed().subscribe(res => {
      this.actualizarTotales();
    });
  }

  AddOrEditMedioPago(orderItemIndex) {
    const importe = this.ventaForm.controls['importe'].value;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { orderItemIndex, importe };
    this.dialog.open(VentaDetalleMedioPagoComponent, dialogConfig).afterClosed().subscribe(res => {
      this.actualizarTotales();
    });
  }

  addCliente() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    this.dialog.open(ClienteCrearDialogComponent, dialogConfig).afterClosed().subscribe(res => {
      this.clientesService.getAllClients(this.currentUser.token)
      .subscribe(
        resp => {
          this.options = resp;
          this.filteredOptions = this.ventaForm.controls.cliente.valueChanges
            .pipe(
              startWith<string | Cliente>(''),
              map(value => typeof value === 'string' ? value : value.razonSocial),
              map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
            );
        },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    });
  }

  onDeleteOrderVentaDetalle(i: number) {
    this.ventasService.ventasItem.splice(i, 1);
    this.actualizarTotales();
  }

  onDeleteMedioPago(i: number) {
    this.ventasService.ventasMediosPago.splice(i, 1);
  }

  actualizarTotales() {
    this.ventaForm.controls['importe'].setValue( this.ventasService.ventasItem.reduce((prev, curr) => {
      return prev + curr.importe;
    }, 0) );
    this.ventaForm.controls['importe'].setValue(parseFloat(this.ventaForm.controls['importe'].value));
    this.ventaForm.controls['descuento'].setValue( this.ventasService.ventasItem.reduce((prev, curr) => {
      return prev + curr.descuento;
    }, 0) );
    this.ventaForm.controls['descuento'].setValue(parseFloat(this.ventaForm.controls['descuento'].value));

    // agregar para formato
  }

  displayFn(user?: Cliente): string | undefined {
    return user ? user.razonSocial : undefined;
  }

  displayFnType(user?: TipoVenta): string | undefined {
    return user ? user.descripcion : undefined;
  }

  get f() {return this.ventaForm.controls; }

  private _filter(name: string): Cliente[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.razonSocial.toLowerCase().indexOf(filterValue) !== -1 ||
    option.ruc.toLowerCase().indexOf(filterValue) !== -1);
  }

  private _filterType(name: string): TipoVenta[] {
    const filterValue = name.toLowerCase();
    return this.typeOptions.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) !== -1);
  }

  nuevaVenta() {
    this.submitted = true;
    this.ventaForm.controls.detalleVenta.setValue(this.ventasService.ventasItem);
    this.ventaForm.controls.mediosPago.setValue(this.ventasService.ventasMediosPago);
    if (this.ventaForm.invalid) {
      return;
    }
    const ventaValue = this.ventaForm.getRawValue();
    this.venta = ventaValue;
    if (this.currentUser != null) {
      this.ventasService.addVenta(ventaValue, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/ventas']);
        },
        errorCode => {
          this.alertService.error(errorCode);
      } );
    }
  }

}
