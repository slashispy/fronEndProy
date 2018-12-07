import { Component, OnInit } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Producto } from '../../../clases/producto';

import { Router } from '@angular/router';

import { LoginService } from '../../../servicios/login.service';
import { ProductosService } from '../../../servicios/productos.service';

@Component({
  selector: 'app-producto-listar',
  templateUrl: './producto-listar.component.html'
})
export class ProductoListarComponent implements OnInit {

  credenciales: Credenciales;
  productos: Producto[];

  constructor(private loginService: LoginService,
    private productosService: ProductosService,
    private router: Router) { }

  ngOnInit() {
    this.credenciales = this.loginService.getCredecianles();
    if (this.credenciales != null) {
      this.productosService.getAllProducts(this.credenciales.token)
      .subscribe(
        resp => {
          this.productos = resp;
        },
        errorCode => {
          console.log(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }
}
