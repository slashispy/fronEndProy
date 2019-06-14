import { Component, OnInit, Inject } from '@angular/core';
import { DetalleAjuste } from '../../../clases/ajuste';
import { Producto } from '../../../clases/producto';
import { Credenciales } from '../../../clases/credenciales';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AjustesService } from '../../../servicios/ajustes.service';
import { ProductosService } from '../../../servicios/productos.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../servicios/alert.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-ajuste-detalle',
  templateUrl: './ajuste-detalle.component.html'
})
export class AjusteDetalleComponent implements OnInit {
  itemList: DetalleAjuste[];
  DetallaAjusteForm = new FormGroup({
    producto: new FormControl('', Validators.required),
    cantidad: new FormControl('', Validators.required),
    precioUnitario: new FormControl('', Validators.required),
    descuento: new FormControl('', Validators.required),
    importe: new FormControl('', Validators.required)
  });
  isValid = true;
  currentUser: Credenciales;
  options: Producto[];
  filteredOptions: Observable<Producto[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AjusteDetalleComponent>,
    private ajusteService: AjustesService,
    private productosService: ProductosService,
    private alertService: AlertService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    if (this.currentUser != null) {
      this.productosService.getAllProductsActives(this.currentUser.token)
      .subscribe(
        resp => {
          this.options = resp;
          this.filteredOptions = this.DetallaAjusteForm.controls.producto.valueChanges
            .pipe(
              startWith<string | Producto>(''),
              map(value => typeof value === 'string' ? value : value.descripcion),
              map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
            );
          if (this.data.orderItemIndex != null) {
            this.DetallaAjusteForm.controls['producto'].setValue(this.ajusteService.ajusteItem[this.data.orderItemIndex]['producto']);
            this.DetallaAjusteForm.controls['cantidad'].setValue(this.ajusteService.ajusteItem[this.data.orderItemIndex]['cantidad']);
            this.DetallaAjusteForm.controls['precioUnitario'].setValue(
              this.ajusteService.ajusteItem[this.data.orderItemIndex]['precioUnitario']);
            this.DetallaAjusteForm.controls['descuento'].setValue(this.ajusteService.ajusteItem[this.data.orderItemIndex]['descuento']);
            this.DetallaAjusteForm.controls['importe'].setValue(this.ajusteService.ajusteItem[this.data.orderItemIndex]['importe']);
          } else {
            this.DetallaAjusteForm.controls['descuento'].setValue(0);
          }
        },
        errorCode => {
            this.alertService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  updateTotal() {
    this.DetallaAjusteForm.controls['importe'].setValue(
        this.DetallaAjusteForm.controls['precioUnitario'].value * this.DetallaAjusteForm.controls['cantidad'].value
        - this.DetallaAjusteForm.controls['descuento'].value
    );
  }

  validateForm() {
    this.isValid = true;
    if (!this.options.includes(this.DetallaAjusteForm.controls['producto'].value)) {
      const prod: Producto = this.DetallaAjusteForm.controls['producto'].value;
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

  displayFn(user?: Producto): string | undefined {
    return user ? user.descripcion : undefined;
  }

  onSubmit(form: NgForm) {
    if (this.DetallaAjusteForm.invalid || !this.validateForm()) {
      return;
    }
    if (this.data.orderItemIndex != null) {
      this.ajusteService.ajusteItem[this.data.orderItemIndex] = this.DetallaAjusteForm.value;
    } else {
      this.ajusteService.ajusteItem.push(this.DetallaAjusteForm.value);
    }
    this.dialogRef.close();
  }

  private _filter(name: string): Producto[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) !== -1 ||
    option.codigo.toLowerCase().indexOf(filterValue) !== -1);
  }

}
