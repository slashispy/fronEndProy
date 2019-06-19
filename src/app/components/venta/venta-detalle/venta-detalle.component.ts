import { Component, OnInit, Inject } from '@angular/core';
import { DetalleVenta } from '../../../clases/venta';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Producto } from '../../../clases/producto';
import { Credenciales } from '../../../clases/credenciales';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VentasService } from '../../../servicios/ventas.service';
import { StockService } from '../../../servicios/stock.service';
import { AlertService } from '../../../servicios/alert.service';
import { map, startWith } from 'rxjs/operators';
import { Stock } from '../../../clases/stock';

@Component({
  selector: 'app-venta-detalle',
  templateUrl: './venta-detalle.component.html'
})
export class VentaDetalleComponent implements OnInit {
  itemList: DetalleVenta[];
  DetallaVentaForm = new FormGroup({
    producto: new FormControl('', Validators.required),
    cantidad: new FormControl('', Validators.required),
    precioUnitario: new FormControl({value: '', disabled: true}, Validators.required),
    descuento: new FormControl('', Validators.required),
    importe: new FormControl('', Validators.required)
  });
  isValid = true;
  currentUser: Credenciales;
  options: Producto[];
  filteredOptions: Observable<Producto[]>;
  MaxCant = 0;
  stock: Stock;
  productoSeleccionado: Producto;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<VentaDetalleComponent>,
    private ventasService: VentasService,
    private stockService: StockService,
    private alertService: AlertService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   }

  ngOnInit() {
    if (this.currentUser != null) {
      this.stockService.getAllProductsStock(this.currentUser.token)
      .subscribe(
        resp => {
          this.options = resp;
          this.filteredOptions = this.DetallaVentaForm.controls.producto.valueChanges
            .pipe(
              startWith<string | Producto>(''),
              map(value => typeof value === 'string' ? value : value.descripcion),
              map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
            );
          if (this.data.orderItemIndex != null) {
            this.DetallaVentaForm.controls['producto'].setValue(this.ventasService.ventasItem[this.data.orderItemIndex]['producto']);
            this.DetallaVentaForm.controls['cantidad'].setValue(this.ventasService.ventasItem[this.data.orderItemIndex]['cantidad']);
            this.DetallaVentaForm.controls['precioUnitario'].setValue(
              this.ventasService.ventasItem[this.data.orderItemIndex]['precioUnitario']);
            this.DetallaVentaForm.controls['descuento'].setValue(this.ventasService.ventasItem[this.data.orderItemIndex]['descuento']);
            this.DetallaVentaForm.controls['importe'].setValue(this.ventasService.ventasItem[this.data.orderItemIndex]['importe']);
          } else {
            this.DetallaVentaForm.controls['descuento'].setValue(0);
          }
        },
        errorCode => {
            this.alertService.error(errorCode);
        }
      );
    } else {
      this.dialogRef.close();
    }
  }

  validateForm() {
    this.isValid = true;
    if (!this.options.includes(this.DetallaVentaForm.controls['producto'].value)) {
      const prod: Producto = this.DetallaVentaForm.controls['producto'].value;
      for (let  x = 0; x < this.options.length; x++) {
        if (this.options[x].id === prod.id) {
          this.isValid = true;
          break;
        } else {
          this.isValid = false;
        }
      }
    }
    return this.isValid;
  }

  AsignarCantidadPrecioUnitario() {
    this.productoSeleccionado = this.DetallaVentaForm.controls['producto'].value;
    if (this.productoSeleccionado.codigo !== '' ) {
      this.stockService.getStock(this.currentUser.token, this.productoSeleccionado.id.toString())
      .subscribe(
        resp => {
          if (resp !== null) {
          this.stock = resp;
          this.MaxCant = this.stock.existencias;
          this.DetallaVentaForm.controls['precioUnitario'].setValue(this.stock.precioVenta);
          this.DetallaVentaForm.controls['precioUnitario'].disable();
        } else {
          this.DetallaVentaForm.controls['precioUnitario'].enable();
        }
        },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    }
  }

  updateTotal() {
    this.DetallaVentaForm.controls['importe'].setValue(
        this.DetallaVentaForm.controls['precioUnitario'].value * this.DetallaVentaForm.controls['cantidad'].value
        - this.DetallaVentaForm.controls['descuento'].value
    );
  }

  displayFn(user?: Producto): string | undefined {
    return user ? user.descripcion : undefined;
  }

  onSubmit(form: NgForm) {
    if (this.DetallaVentaForm.invalid || !this.validateForm()) {
      return;
    }
    if (this.data.orderItemIndex != null) {
      this.ventasService.ventasItem[this.data.orderItemIndex] = this.DetallaVentaForm.getRawValue();
    } else {
      this.ventasService.ventasItem.push(this.DetallaVentaForm.getRawValue());
    }
    this.dialogRef.close();
  }

  private _filter(name: string): Producto[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) !== -1 ||
    option.codigo.toLowerCase().indexOf(filterValue) !== -1);
  }

}
