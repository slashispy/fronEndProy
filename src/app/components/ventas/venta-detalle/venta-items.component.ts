import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item, ProductoStock } from '../../../clases/venta';
import { VentasService } from '../../../servicios/ventas.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Credenciales } from 'src/app/clases/credenciales';
import { Router } from '@angular/router';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-venta-items',
  templateUrl: './venta-items.component.html'
})
export class VentaItemsComponent implements OnInit {
  itemList: Item[];
  productoItemForm = new FormGroup({
    producto: new FormControl('', Validators.required),
    cantidad: new FormControl('', Validators.required),
    precioUnitario: new FormControl({value: '', disabled: true}, Validators.required),
    descuento: new FormControl('', Validators.required),
    importe: new FormControl('', Validators.required)
  });
  isValid = true;
  currentUser: Credenciales;
  VentasService: any;
  options: ProductoStock[];
  filteredOptions: Observable<ProductoStock[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<VentaItemsComponent>,
    private ventasService: VentasService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      this.ventasService.getAllProductos(this.currentUser.token)
      .subscribe(
        resp => {
          console.log(resp);
          this.options = resp;
          this.filteredOptions = this.productoItemForm.controls.producto.valueChanges
            .pipe(
              startWith<string | ProductoStock>(''),
              map(value => typeof value === 'string' ? value : value.descProducto),
              map(descProducto => descProducto ? this._filter(descProducto) : this.options.slice())
            );
          this.productoItemForm.controls.producto.valueChanges.subscribe(val => {
            this.productoItemForm.controls['precioUnitario'].setValue(val ? val.precioVenta : 0);
          });
          if (this.data.orderItemIndex != null) {
            this.productoItemForm.controls['producto'].setValue(this.ventasService.ventaItems[this.data.orderItemIndex]['producto']);
            this.productoItemForm.controls['cantidad'].setValue(this.ventasService.ventaItems[this.data.orderItemIndex]['cantidad']);
            this.productoItemForm.controls['precioUnitario'].setValue(
              this.ventasService.ventaItems[this.data.orderItemIndex]['precioUnitario']);
            this.productoItemForm.controls['descuento'].setValue(this.ventasService.ventaItems[this.data.orderItemIndex]['descuento']);
            this.productoItemForm.controls['importe'].setValue(this.ventasService.ventaItems[this.data.orderItemIndex]['importe']);
          } else {
            this.productoItemForm.controls['descuento'].setValue(0);
          }
        },
        errorCode => {
          console.log(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  updateTotal() {
    this.productoItemForm.controls['importe'].setValue(
        this.productoItemForm.controls['precioUnitario'].value * this.productoItemForm.controls['cantidad'].value
        - this.productoItemForm.controls['descuento'].value
    );
  }

  onSubmit(form: NgForm) {
    if (this.productoItemForm.invalid || !this.validateForm()) {
      return;
    }
    if (this.data.orderItemIndex != null) {
      this.ventasService.ventaItems[this.data.orderItemIndex] = this.productoItemForm.getRawValue();
    } else {
      this.ventasService.ventaItems.push(this.productoItemForm.getRawValue());
    }
    this.dialogRef.close();
  }

  validateForm() {
    this.isValid = true;
    if (!this.options.includes(this.productoItemForm.controls['producto'].value)) {
      const prod: ProductoStock = this.productoItemForm.controls['producto'].value;
      for (let  x = 0; x < this.options.length; x++) {
        if (this.options[x].idProducto === prod.idProducto) {
          this.isValid = true;
          break;
        } else {
          this.isValid = false;
        }
      }
    }
    return this.isValid;
  }

  displayFn(user?: ProductoStock): string | undefined {
    return user ? user.descProducto : undefined;
  }

  private _filter(name: string): ProductoStock[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.descProducto.toLowerCase().indexOf(filterValue) !== -1);
  }
}
