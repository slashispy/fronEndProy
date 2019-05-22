import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Producto } from '../../../clases/producto';

import { Router } from '@angular/router';
import { ProductosService } from '../../../servicios/productos.service';

@Component({
  selector: 'app-producto-crear',
  templateUrl: './producto-crear.component.html'
})
export class ProductoCrearComponent implements OnInit {
  productoForm = new FormGroup({
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    estado: new FormControl('A', Validators.required),
    controlarStock: new FormControl('S', Validators.required),
    precioUnitario: new FormControl(''),
    cantidadMinima: new FormControl('')
  });
  currentUser: Credenciales;
  producto: Producto;
  submitted = false;
  validator = true;

  constructor(private productosService: ProductosService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      this.productoForm.controls['precioUnitario'].disable();
    } else {
      this.router.navigate(['/login']);
    }
  }

  get f() {return this.productoForm.controls; }

  activarValidator(eve: any) {
    if (this.productoForm.get('controlarStock').value === 'S') {
      this.validator = true;
    } else {
      this.validator = false;
    }
    if (this.validator) {
      this.productoForm.get('cantidadMinima').setValidators([Validators.required]);
      this.productoForm.get('cantidadMinima').updateValueAndValidity();
    } else {
      this.productoForm.get('cantidadMinima').setValidators(null);
      this.productoForm.get('cantidadMinima').updateValueAndValidity();
    }
  }

  nuevoProducto() {
    this.submitted = true;
    if (this.productoForm.invalid) {
      return;
    }
    const prod = this.productoForm.value;
    this.producto = prod;
    if (this.currentUser != null) {
      this.productosService.addProduct(prod, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/productos']);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    }
  }
}
