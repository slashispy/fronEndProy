import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Producto } from '../../../clases/producto';

import { Router } from '@angular/router';

import { LoginService } from '../../../servicios/login.service';
import { ProductosService } from '../../../servicios/productos.service';

import { Subject } from 'rxjs';
import { Datatables } from 'src/app/clases/datatables';

@Component({
  selector: 'app-producto-listar',
  templateUrl: './producto-listar.component.html'
})
export class ProductoListarComponent extends Datatables implements OnDestroy, OnInit {
  @Output() idProducto = new EventEmitter<string>();
  credenciales: Credenciales;
  productos: Producto[];
  dtTrigger: Subject<any> = new Subject();

  constructor(private loginService: LoginService,
    private productosService: ProductosService,
    private router: Router) {super(); }

  ngOnInit() {
    super.ngOnInit();
    this.credenciales = this.loginService.getCredecianles();
    if (this.credenciales != null) {
      this.productosService.getAllProducts(this.credenciales.token)
      .subscribe(
        resp => {
          this.productos = resp;
          this.dtTrigger.next();
        },
        errorCode => {
          console.log(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  editProduct(id: string): void {
    localStorage.removeItem('productoId');
    localStorage.setItem('productoId', id);
    this.router.navigate(['producto-editar']);
  }
}
