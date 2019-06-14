import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Compra, Item, TipoCompra } from '../../../clases/compra';
import { Router } from '@angular/router';
import { ProductosService } from '../../../servicios/productos.service';
import { ComprasService } from '../../../servicios/compras.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CompraItemsComponent } from '../compra-detalle/compra-items.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/clases/utils/date-adapter';
import { Proveedor } from 'src/app/clases/proveedor';
import { Observable } from 'rxjs';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  }, {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class CompraComponent implements OnInit {
  isValid = true;
  compraForm = new FormGroup({
    fecha: new FormControl({value: '', disabled: true}, Validators.required),
    nroFactura: new FormControl('', Validators.required),
    proveedor: new FormControl('', Validators.required),
    importe: new FormControl({value: '', disabled: true}, Validators.required),
    descuento: new FormControl({value: '', disabled: true}, Validators.required),
    tipoCompra: new FormControl('', Validators.required),
    detalleCompras: new FormControl('', Validators.required)
  });
  currentUser: Credenciales;
  compra: Compra;
  compraItems: Item[] = new Array();
  maxDate = new Date();
  options: Proveedor[];
  typeOptions: TipoCompra[];
  filteredOptions: Observable<Proveedor[]>;
  filteredTypeOptions: Observable<TipoCompra[]>;

  constructor(private productosService: ProductosService,
    private dialog: MatDialog,
    private router: Router,
    private comprasService: ComprasService,
    private proveedoresService: ProveedoresService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      this.proveedoresService.getAllProveedoresActives(this.currentUser.token)
      .subscribe(
        resp => {
          this.options = resp;
          // console.log(this.options);
          this.filteredOptions = this.compraForm.controls.proveedor.valueChanges
            .pipe(
              startWith<string | Proveedor>(''),
              map(value => typeof value === 'string' ? value : value.razonSocial),
              map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
            );
            this.comprasService.getAllTiposCompra(this.currentUser.token)
            .subscribe(
              // tslint:disable-next-line:no-shadowed-variable
              resp => {
                this.typeOptions = resp;
                // console.log(this.typeOptions);
                this.filteredTypeOptions = this.compraForm.controls.tipoCompra.valueChanges
                  .pipe(
                    startWith<string | TipoCompra>(''),
                    map(value => typeof value === 'string' ? value : value.descripcion),
                    map(descripcion => descripcion ? this._filterType(descripcion) : this.typeOptions.slice())
                  );
                this.compraForm.controls['importe'].setValue(0);
                this.compraForm.controls['descuento'].setValue(0);
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
    this.dialog.open(CompraItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      this.actualizarTotales();
    });
  }

  onDeleteOrderItem(i: number) {
    this.comprasService.compraItems.splice(i, 1);
    this.actualizarTotales();
  }

  actualizarTotales() {
    this.compraForm.controls['importe'].setValue( this.comprasService.compraItems.reduce((prev, curr) => {
      return prev + curr.importe;
    }, 0) );
    this.compraForm.controls['importe'].setValue(parseFloat(this.compraForm.controls['importe'].value));
    this.compraForm.controls['descuento'].setValue( this.comprasService.compraItems.reduce((prev, curr) => {
      return prev + curr.descuento;
    }, 0) );
    this.compraForm.controls['descuento'].setValue(parseFloat(this.compraForm.controls['descuento'].value));

    // agregar para formato
  }

  displayFn(user?: Proveedor): string | undefined {
    return user ? user.razonSocial : undefined;
  }

  displayFnType(user?: TipoCompra): string | undefined {
    return user ? user.descripcion : undefined;
  }

  private _filter(name: string): Proveedor[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.razonSocial.toLowerCase().indexOf(filterValue) !== -1 ||
    option.ruc.toLowerCase().indexOf(filterValue) !== -1);
  }

  private _filterType(name: string): TipoCompra[] {
    const filterValue = name.toLowerCase();
    return this.typeOptions.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) !== -1);
  }

  nuevaCompra() {
    this.compraForm.controls.detalleCompras.setValue(this.comprasService.compraItems);
    console.log(this.compraForm.value);
    if (this.compraForm.invalid) {
      return;
    }
    const comp = this.compraForm.getRawValue();
    this.compra = comp;
    if (this.currentUser != null) {
      this.comprasService.addCompra(comp, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/compras']);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    }
  }
}
