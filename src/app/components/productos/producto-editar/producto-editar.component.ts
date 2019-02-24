import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Producto } from '../../../clases/producto';
import { Router } from '@angular/router';
import { ProductosService } from '../../../servicios/productos.service';

@Component({
  selector: 'app-producto-editar',
  templateUrl: './producto-editar.component.html'
})
export class ProductoEditarComponent implements OnInit {
  productoForm = new FormGroup({
    id: new FormControl('', Validators.required),
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    cantidad: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
    controlarStock: new FormControl('', Validators.required),
    precioUnitario: new FormControl('', Validators.required),
    cantidadMinima: new FormControl('', Validators.required)
  });
  currentUser: Credenciales;
  producto: Producto;

  constructor(private productosService: ProductosService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    if (this.currentUser != null) {
      const productoId = localStorage.getItem('productoId');
      if (!productoId) {
        alert('Acción Inválida');
        this.router.navigate(['home']);
        return;
      }
      this.productosService.getProduct(this.currentUser.token, productoId)
      .subscribe(
        resp => {
          this.productoForm.controls['id'].setValue(resp.id);
          this.productoForm.controls['codigo'].setValue(resp.codigo);
          this.productoForm.controls['codigo'].disable();
          this.productoForm.controls['descripcion'].setValue(resp.descripcion);
          this.productoForm.controls['cantidad'].setValue(resp.cantidad);
          this.productoForm.controls['estado'].setValue(resp.estado);
          this.productoForm.controls['controlarStock'].setValue(resp.controlarStock);
          this.productoForm.controls['precioUnitario'].setValue(resp.precioUnitario);
          this.productoForm.controls['codigo'].setValue(resp.codigo);
          this.productoForm.controls['cantidadMinima'].setValue(resp.cantidadMinima);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  editarProducto() {
    if (this.productoForm.invalid) {
      return;
    }
    const prod = this.productoForm.value;
    this.producto = prod;
    if (this.currentUser != null) {
      this.productosService.editProduct(prod, this.currentUser.token)
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
