import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../clases/utils/date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Venta, DetalleVenta, TipoVenta, VentaDetalleMedioPago } from '../../../clases/venta';
import { Credenciales } from '../../../clases/credenciales';
import { Observable } from 'rxjs';
import { Cliente } from '../../../clases/cliente';
import { Caja } from '../../../clases/caja';
import { Router } from '@angular/router';
import { VentasService } from '../../../servicios/ventas.service';
import { AlertService } from 'src/app/servicios/alert.service';
import { ClientesService } from 'src/app/servicios/clientes.service';
import { CajaService } from '../../../servicios/caja.service';
import { map, startWith } from 'rxjs/operators';
import { VentaDetalleComponent } from '../venta-detalle/venta-detalle.component';
import { VentaDetalleMedioPagoComponent } from '../venta-detalle-medio-pago/venta-detalle-medio-pago.component';
import { ClienteCrearDialogComponent } from '../../clientes/cliente-crear-dialog/cliente-crear-dialog.component';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import * as jsPDF from 'jspdf';

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
  formValid = false;
  ventaForm = new FormGroup({
    fecha: new FormControl({value: '', disabled: true}, Validators.required),
    nroFactura: new FormControl({value: '', disabled: true}, Validators.required),
    cliente: new FormControl('', Validators.required),
    importe: new FormControl({value: '', disabled: true}, Validators.required),
    descuento: new FormControl({value: '', disabled: true}, Validators.required),
    tipoVenta: new FormControl('', Validators.required),
    caja: new FormControl('', Validators.required),
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
  comprobante: Venta;
  nroFactura: string;
  caja: Caja;

  constructor(private dialog: MatDialog,
    private router: Router,
    private ventasService: VentasService,
    private alertService: AlertService,
    private cajaService: CajaService,
    private clientesService: ClientesService,
    private usuarioService: UsuariosService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.ventasService.ventasItem = [];
      this.ventasService.mediosPagos = [];
      this.validarCaja('V');
    }

    validarCaja( uso: string) {
      this.cajaService.getCajaAbierta(this.currentUser.token, uso, this.currentUser.usuario)
      .subscribe(
        resp => {
          this.caja = resp;
          if (this.formatDate(new Date()) === this.caja.fechaApertura ) {
            this.formValid = true;
            this.ventaForm.controls['caja'].setValue(this.caja);
          } else {
            this.formValid = false;
            this.alertService.error('Tiene una caja abierta en fecha: ' + this.caja.fechaApertura + '. La fecha debe ser de hoy');
          }
        },
        errorCode => {
          this.formValid = false;
          this.alertService.error(errorCode);
        }
      );
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
                this.ventaForm.controls['fecha'].setValue(this.formatDate(this.maxDate));
                this.usuarioService.getUserByUsuario(this.currentUser.usuario, this.currentUser.token)
                .subscribe(
                  resp3 => {
                    this.ventasService.getNroFactura(resp3.id, this.currentUser.token)
                    .subscribe(
                      resp4 => {
                        this.nroFactura = resp4;
                        this.ventaForm.controls['nroFactura'].setValue(resp4);
                    },
                    errorCode => {
                      this.alertService.error(errorCode);
                    });
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
          this.imprimirFactura(this.nroFactura);
          this.router.navigate(['/ventas']);
        },
        errorCode => {
          this.alertService.error(errorCode);
      } );
    }
  }

  imprimirFactura(nroFactura: string) {
    if (this.currentUser != null) {
      this.ventasService.getComprobante(this.currentUser.token, nroFactura)
      .subscribe(
        resp => {
          this.comprobante = resp;
          this.comprobantePdf(resp);
        },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  private comprobantePdf(comprobante: Venta) {
    const doc = new jsPDF('P', 'mm', [74, 100 + 2 * 5]);
    doc.setFontSize(3);
    doc.setFont('times');
    doc.text('Cobisol S.A.', 13, 2, null, null, 'center');
    doc.text('Kiosko', 13, 3, null, null, 'center');
    doc.setLineWidth(0.05);
    doc.line(1, 3.2, 25, 3.2); // horizontal line
    doc.text('CASA CENTRAL', 13, 4.1, null, null, 'center');
    doc.text('Dirección del Local', 1, 5.5);
    doc.text('R.U.C. ' + comprobante.ruc, 1, 8);
    // doc.text('Tel.:000-000', 25, 8, null, null, 'right');
    doc.text('Timbrado: ' + comprobante.timbrado, 1, 9);
    doc.text('Factura: ' + comprobante.nroFactura, 25, 9, null, null, 'right');
    doc.text('IVA INCLUIDO', 13, 11, null, null, 'center');
    doc.text('Fecha: ' + comprobante.fecha, 1, 13);
    // doc.text('Hora: 12:12:12', 25, 13, null, null, 'right');
    doc.text('CI/RUC: ' + comprobante.cliente.ruc, 1, 14);
    doc.text('Cliente: ' + comprobante.cliente.razonSocial, 1, 15);
    doc.line(1, 15.2, 25, 15.2);
    doc.text('DESCRIPCION', 1, 16.3);
    doc.text('CANTIDAD', 1, 17.3);
    doc.text('PRECIO', 10, 17.3);
    doc.text('TOTAL', 25, 17.3, null, null, 'right');
    doc.line(1, 17.5, 25, 17.5);
    let linea = 17.5;
    comprobante.detalleVenta.forEach(element => {
      linea++;
      doc.text(element.producto.descripcion, 1, linea);
      linea++;
      doc.text(element.cantidad.toString(), 1, linea);
      doc.text(element.precioUnitario.toString(), 10, linea);
      doc.text(element.importe.toString(), 25, linea, null, null, 'right');
    });
    linea += 0.2;
    doc.line(1, linea, 25, linea);
    linea ++;
    doc.text('TOTAL IVA (10%):', 1, linea);
    doc.text((Math.round(comprobante.importe / 11)).toString(), 25, linea, null, null, 'right');
    linea ++;
    doc.text('TOTAL A PAGAR:', 1, linea);
    doc.text(comprobante.importe.toString(), 25, linea, null, null, 'right');
    linea += 4.3;
    doc.text('ORIGINAL: CLIENTE', 1, linea);
    linea += 2;
    doc.text('DUPLICADO: ARCHIVO TRIBUTARIO', 1, linea);
    linea += 4;
    doc.text('GRACIAS POR SU PREFERENCIA!', 13, linea, null, null, 'center');
    doc.save('a_factura.pdf');
  }

  private formatDate(date: Date) {
    const d = new Date(date),
    year = d.getFullYear();
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }
}
