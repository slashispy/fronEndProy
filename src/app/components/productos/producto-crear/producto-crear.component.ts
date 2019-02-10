import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Producto } from '../../../clases/producto';

import { Router } from '@angular/router';

import { LoginService } from '../../../servicios/login.service';
import { ProductosService } from '../../../servicios/productos.service';

@Component({
  selector: 'app-producto-crear',
  templateUrl: './producto-crear.component.html'
})
export class ProductoCrearComponent implements OnInit {
  productoForm = new FormGroup({
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    cantidad: new FormControl('', Validators.required),
    estado: new FormControl('A', Validators.required),
    controlarStock: new FormControl('S', Validators.required),
    precioUnitario: new FormControl('', Validators.required),
    cantidadMinima: new FormControl('', Validators.required)
  });
  credenciales: Credenciales;
  producto: Producto;

  constructor(private loginService: LoginService,
    private productosService: ProductosService,
    private router: Router) { }

  ngOnInit() {
    this.credenciales = this.loginService.getCredecianles();
    if (this.credenciales != null) {
      // something
    } else {
      this.router.navigate(['/login']);
    }
  }

  nuevoProducto() {
    if (this.productoForm.invalid) {
      return;
    }
    const prod = this.productoForm.value;
    this.producto = prod;
    this.credenciales = this.loginService.getCredecianles();
    if (this.credenciales != null) {
      this.productosService.addProduct(prod, this.credenciales.token)
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
