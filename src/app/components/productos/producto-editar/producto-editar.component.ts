import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Producto } from '../../../clases/producto';
import { Router } from '@angular/router';
import { ProductosService } from '../../../servicios/productos.service';
import { AlertService } from '../../../servicios/alert.service';

@Component({
  selector: 'app-producto-editar',
  templateUrl: './producto-editar.component.html'
})
export class ProductoEditarComponent implements OnInit {
  productoForm = new FormGroup({
    id: new FormControl('', Validators.required),
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
    controlarStock: new FormControl('', Validators.required),
    precioUnitario: new FormControl(''),
    cantidadMinima: new FormControl('', Validators.required)
  });
  currentUser: Credenciales;
  producto: Producto;
  submitted = false;
  validator = true;

  constructor(private productosService: ProductosService,
    private alertService: AlertService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    if (this.currentUser != null) {
      const productoId = localStorage.getItem('productoId');
      if (!productoId) {
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
          this.productoForm.controls['estado'].setValue(resp.estado);
          this.productoForm.controls['controlarStock'].setValue(resp.controlarStock);
          this.productoForm.controls['precioUnitario'].disable();
          this.productoForm.controls['cantidadMinima'].setValue(resp.cantidadMinima);
        },
        errorCode => {
        this.alertService.error(errorCode);
      } );
    } else {
      this.router.navigate(['home']);
      return;
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

  editarProducto() {
    this.submitted = true;
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
        this.alertService.error(errorCode);
      } );
    }
  }
}
