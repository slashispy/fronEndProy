import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from '../../../clases/compra';
import { ComprasService } from '../../../servicios/compras.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Producto } from '../../../clases/producto';
import { ProductosService } from 'src/app/servicios/productos.service';
import { Credenciales } from 'src/app/clases/credenciales';
import { Router } from '@angular/router';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-compra-items',
  templateUrl: './compra-items.component.html'
})
export class CompraItemsComponent implements OnInit {
  itemList: Item[];
  productoItemForm = new FormGroup({
    producto: new FormControl('', Validators.required),
    cantidad: new FormControl('', Validators.required),
    precioUnitario: new FormControl('', Validators.required),
    descuento: new FormControl('', Validators.required),
    importe: new FormControl('', Validators.required)
  });
  isValid = true;
  currentUser: Credenciales;
  ComprasService: any;
  options: Producto[];
  filteredOptions: Observable<Producto[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<CompraItemsComponent>,
    private comprasService: ComprasService,
    private productosService: ProductosService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      this.productosService.getAllProductsActives(this.currentUser.token)
      .subscribe(
        resp => {
          this.options = resp;
          this.filteredOptions = this.productoItemForm.controls.producto.valueChanges
            .pipe(
              startWith<string | Producto>(''),
              map(value => typeof value === 'string' ? value : value.descripcion),
              map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
            );
          if (this.data.orderItemIndex != null) {
            this.productoItemForm.controls['producto'].setValue(this.comprasService.compraItems[this.data.orderItemIndex]['producto']);
            this.productoItemForm.controls['cantidad'].setValue(this.comprasService.compraItems[this.data.orderItemIndex]['cantidad']);
            this.productoItemForm.controls['precioUnitario'].setValue(
              this.comprasService.compraItems[this.data.orderItemIndex]['precioUnitario']);
            this.productoItemForm.controls['descuento'].setValue(this.comprasService.compraItems[this.data.orderItemIndex]['descuento']);
            this.productoItemForm.controls['importe'].setValue(this.comprasService.compraItems[this.data.orderItemIndex]['importe']);
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

  /*updatePrice(ctrl) {
    if (ctrl.selectedIndex === 0) {
      this.formData.Price = 0;
      this.formData.ItemName = '';
    } else {
      this.formData.Price = this.itemList[ctrl.selectedIndex - 1].Price;
      this.formData.ItemName = this.itemList[ctrl.selectedIndex - 1].Name;
    }
    this.updateTotal();
  }*/

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
      this.comprasService.compraItems[this.data.orderItemIndex] = this.productoItemForm.value;
    } else {
      this.comprasService.compraItems.push(this.productoItemForm.value);
    }
    this.dialogRef.close();
  }

  validateForm() {
    this.isValid = true;
    if (!this.options.includes(this.productoItemForm.controls['producto'].value)) {
      this.isValid = false;
    }
    return this.isValid;
  }

  displayFn(user?: Producto): string | undefined {
    return user ? user.descripcion : undefined;
  }

  private _filter(name: string): Producto[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) !== -1 ||
    option.codigo.toLowerCase().indexOf(filterValue) !== -1);
  }
}
