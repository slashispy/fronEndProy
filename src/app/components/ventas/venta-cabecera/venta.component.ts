import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Venta, Item, TipoVenta } from '../../../clases/venta';
import { Router } from '@angular/router';
import { ProductosService } from '../../../servicios/productos.service';
import { VentasService } from '../../../servicios/ventas.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VentaItemsComponent } from '../venta-detalle/venta-items.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/clases/utils/date-adapter';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Cliente } from 'src/app/clases/cliente';
import { ClientesService } from 'src/app/servicios/clientes.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  }, {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class VentaComponent implements OnInit {
  isValid = true;
  ventaForm = new FormGroup({
    fecha: new FormControl({value: '', disabled: true}, Validators.required),
    ruc: new FormControl({value: '', disabled: true}, Validators.required),
    timbrado: new FormControl({value: '', disabled: true}, Validators.required),
    cliente: new FormControl('', Validators.required),
    importe: new FormControl({value: '', disabled: true}, Validators.required),
    descuento: new FormControl({value: '', disabled: true}, Validators.required),
    tipoVenta: new FormControl('', Validators.required),
    detalleVenta: new FormControl('', Validators.required)
  });
  currentUser: Credenciales;
  venta: Venta;
  ventaItems: Item[] = new Array();
  maxDate = new Date();
  options: Cliente[];
  typeOptions: TipoVenta[];
  filteredOptions: Observable<Cliente[]>;
  filteredTypeOptions: Observable<TipoVenta[]>;

  constructor(private productosService: ProductosService,
    private dialog: MatDialog,
    private router: Router,
    private ventasService: VentasService,
    private clientesService: ClientesService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.ventasService.ventaItems = [];
    }

  ngOnInit() {
    if (this.currentUser != null) {
      this.clientesService.getAllClients(this.currentUser.token)
      .subscribe(
        resp => {
          this.options = resp;
          // console.log(this.options);
          this.filteredOptions = this.ventaForm.controls.cliente.valueChanges
            .pipe(
              startWith<string | Cliente>(''),
              map(value => typeof value === 'string' ? value : value.razonSocial),
              map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
            );
            this.ventasService.getAllTiposVenta(this.currentUser.token)
            .subscribe(
              // tslint:disable-next-line:no-shadowed-variable
              resp => {
                this.typeOptions = resp;
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
                console.log(errorCode);
              }
            );
        },
        errorCode => {
          console.log(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  AddOrEditOrderItem(orderItemIndex) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { orderItemIndex };
    this.dialog.open(VentaItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      console.log(this.ventasService.ventaItems);
      this.actualizarTotales();
    });
  }

  onDeleteOrderItem(i: number) {
    this.ventasService.ventaItems.splice(i, 1);
    this.actualizarTotales();
  }

  actualizarTotales() {
    this.ventaForm.controls['importe'].setValue( this.ventasService.ventaItems.reduce((prev, curr) => {
      return prev + curr.importe;
    }, 0) );
    this.ventaForm.controls['importe'].setValue(parseFloat(this.ventaForm.controls['importe'].value));
    this.ventaForm.controls['descuento'].setValue( this.ventasService.ventaItems.reduce((prev, curr) => {
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
    this.ventaForm.controls.detalleVenta.setValue(this.ventasService.ventaItems);
    console.log(this.ventaForm.getRawValue());
    if (this.ventaForm.invalid) {
      return;
    }
    const vent = this.ventaForm.getRawValue();
    this.venta = vent;
    if (this.currentUser != null) {
      this.ventasService.addVenta(vent, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/ventas']);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    }
  }
}
