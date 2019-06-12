import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Proveedor } from '../../../clases/proveedor';
import { ProveedoresService } from '../../../servicios/proveedores.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../servicios/alert.service';

@Component({
  selector: 'app-proveedor-crear',
  templateUrl: './proveedor-crear.component.html'
})
export class ProveedorCrearComponent implements OnInit {

  proveedorForm = new FormGroup({
    razonSocial: new FormControl('', Validators.required),
    ruc: new FormControl('', Validators.required),
    estado: new FormControl('A', Validators.required),
    direccion: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required)
  });

  currentUser: Credenciales;
  submitted = false;
  proveedor: Proveedor;

  constructor(private proveedorService: ProveedoresService,
    private alertService: AlertService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      // something
    } else {
      this.router.navigate(['/login']);
    }
  }

  get f() {return this.proveedorForm.controls; }

  nuevoProveedor() {
    this.submitted = true;
    if (this.proveedorForm.invalid) {
      return;
    }
    const prov = this.proveedorForm.value;
    this.proveedor = prov;
    if (this.currentUser != null) {
      this.proveedorService.addProveedor(prov, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/proveedores']);
        },
        errorCode => {
          this.alertService.error(errorCode);
      } );
    }
  }
}
